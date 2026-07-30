from __future__ import annotations
import json
import re
from abc import ABC, abstractmethod
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents.state import GraphState
from app.ai.router.model_router import model_router
from app.ai.router.providers.base import ProviderMessage
from app.ai.memory.manager import memory_manager
from app.ai.tools.registry import tool_registry


class BaseAgent(ABC):
    name: str = "base"
    task_type: str = "general"
    system_prompt: str = "You are a helpful assistant."

    def _extract_tool_calls_from_text(self, text: str) -> list[dict[str, Any]]:
        """
        Parse tool calls embedded in response text.
        Supports:
          1. Explicit markdown tool directives:
             ```write_file:path/to/file.py
             content...
             ```
          2. JSON blocks with tool execution directives:
             [TOOL_CALL: name {"param": "val"}]
        """
        tool_calls = []

        # 1. Match code blocks with file path targets: ```write_file:filename.ext ... ```
        pattern = r"```(?:write_file|file):([^\n]+)\n(.*?)```"
        matches = re.findall(pattern, text, re.DOTALL)
        for path_str, content_str in matches:
            clean_path = path_str.strip()
            if clean_path:
                tool_calls.append({
                    "name": "write_file",
                    "kwargs": {"path": clean_path, "content": content_str.strip()}
                })

        # 2. Match explicit [TOOL_CALL: name {"json": "args"}]
        pattern_json = r"\[TOOL_CALL:\s*(\w+)\s*(\{.*?\})\]"
        matches_json = re.findall(pattern_json, text, re.DOTALL)
        for name_str, args_json in matches_json:
            try:
                kwargs = json.loads(args_json)
                tool_calls.append({"name": name_str, "kwargs": kwargs})
            except Exception:
                pass

        return tool_calls

    async def execute_tools(self, tool_calls: list[dict[str, Any]]) -> list[str]:
        results = []
        for tc in tool_calls:
            name = tc.get("name")
            kwargs = tc.get("kwargs", {})
            try:
                out = await tool_registry.invoke(name, **kwargs)
                results.append(f"Tool `{name}` output: {json.dumps(out)}")
            except Exception as e:
                results.append(f"Tool `{name}` failed: {e}")
        return results

    async def think(self, state: GraphState, session: AsyncSession) -> dict[str, Any]:
        """Core reasoning step with memory retrieval and model router invocation."""
        memories = await memory_manager.retrieve(
            user_id=state.user_id,
            query=state.user_message,
            memory_types=["semantic", "conversation", "project"],
            limit=5,
        )
        memory_context = "\n".join(f"- {m['content']}" for m in memories) if memories else ""

        if state.document_id:
            from sqlalchemy import select
            from app.models.document import DocumentChunk
            from uuid import UUID
            try:
                stmt = select(DocumentChunk.content).where(DocumentChunk.document_id == UUID(state.document_id)).order_by(DocumentChunk.chunk_index)
                res = await session.execute(stmt)
                doc_content = "\n\n".join([row[0] for row in res.fetchall()])
                if doc_content:
                    memory_context += f"\n\nAttached Document Content:\n{doc_content}"
            except Exception as e:
                print("Error loading document:", e)

        messages = [
            ProviderMessage(role="system", content=self.system_prompt),
        ]
        if memory_context:
            messages.append(ProviderMessage(role="system", content=f"Relevant context:\n{memory_context}"))

        for m in state.messages[-10:]:
            r = getattr(m, "role", m.get("role", "user") if isinstance(m, dict) else "user")
            c = getattr(m, "content", m.get("content", "") if isinstance(m, dict) else "")
            a = getattr(m, "agent", m.get("agent", "") if isinstance(m, dict) else "")
            messages.append(ProviderMessage(role=r, content=f"[{a}] {c}" if a else c))

        messages.append(ProviderMessage(role="user", content=state.user_message, image_base64=state.image_base64))

        if state.image_base64:
            self.task_type = "vision"

        tools = tool_registry.get_tools_for_agent(self.name)
        response = await model_router.complete(
            session=session,
            task_type=self.task_type,
            messages=messages,
            tools=tools or None,
        )

        content = response.content
        # Check for tool call directives and execute
        embedded_tools = self._extract_tool_calls_from_text(content)
        if embedded_tools:
            tool_outputs = await self.execute_tools(embedded_tools)
            content += "\n\n" + "\n".join(tool_outputs)

        return {"content": content, "model": response.model_id, "tokens": (response.tokens_in, response.tokens_out)}

    @abstractmethod
    async def run(self, state: GraphState, session: AsyncSession) -> dict[str, Any]:
        ...