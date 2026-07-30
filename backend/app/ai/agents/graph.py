from __future__ import annotations
from typing import Any, AsyncIterator
import json
import re

from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.ai.agents.state import GraphState, AgentMessage
from app.ai.agents.ceo_agent import ceo_agent
from app.ai.agents.planner_agent import planner_agent
from app.ai.agents.coding_agent import coding_agent
from app.ai.agents.research_agent import research_agent
from app.ai.agents.memory_agent import memory_agent
from app.ai.agents.vision_agent import vision_agent
from app.ai.agents.learning_agent import learning_agent
from app.ai.agents.deployment_agent import deployment_agent
from app.ai.agents.testing_agent import testing_agent
from app.ai.agents.docs_agent import docs_agent
from app.ai.agents.database_agent import database_agent
from app.ai.agents.frontend_agent import frontend_agent
from app.ai.agents.backend_agent import backend_agent
from app.ai.agents.devops_agent import devops_agent
from app.services.agent_service import AgentService


AGENT_MAP = {
    "ceo": ceo_agent,
    "planner": planner_agent,
    "coding": coding_agent,
    "research": research_agent,
    "memory": memory_agent,
    "vision": vision_agent,
    "learning": learning_agent,
    "deployment": deployment_agent,
    "testing": testing_agent,
    "docs": docs_agent,
    "database": database_agent,
    "frontend": frontend_agent,
    "backend": backend_agent,
    "devops": devops_agent,
}


def _extract_clean_text(raw: str) -> str:
    """
    Extract the clean human-readable answer from a raw LLM response.
    Handles:
      - JSON with {"decision": ..., "answer": "..."}
      - Markdown code-fenced JSON ```json { ... } ```
      - Plain text (returned as-is)
    """
    if not raw:
        return raw

    text = raw.strip()

    # Strip ```json ... ``` or ``` ... ``` wrappers
    fenced = re.match(r"^```(?:json)?\s*\n?(.*?)\n?```$", text, re.DOTALL)
    if fenced:
        text = fenced.group(1).strip()

    # Try parsing as JSON
    if text.startswith("{"):
        try:
            parsed = json.loads(text)
            # Unwrap nested "answer" key if present
            answer = parsed.get("answer", text)
            if isinstance(answer, str):
                # Recursively unwrap one more level if still JSON
                if answer.strip().startswith("{"):
                    try:
                        inner = json.loads(answer)
                        answer = inner.get("answer", answer)
                    except Exception:
                        pass
                return answer
        except Exception:
            pass  # Not valid JSON — fall through

    return text


class Orchestrator:
    """LangGraph-style stateful orchestrator with conditional routing."""

    async def run(
        self,
        user_id: UUID,
        project_id: UUID | None,
        user_message: str,
        session: AsyncSession,
        image_base64: str | None = None,
        document_id: str | None = None,
    ) -> dict[str, Any]:
        state = GraphState(
            user_id=user_id,
            project_id=project_id,
            user_message=user_message,
            messages=[AgentMessage(role="user", content=user_message, agent="user")],
            image_base64=image_base64,
            document_id=document_id,
        )
        agent_service = AgentService(session)
        current = "ceo"

        while current != "end" and state.iteration < state.max_iterations:
            state.iteration += 1
            state.current_agent = current
            agent = AGENT_MAP.get(current)
            if not agent:
                state.error = f"Unknown agent: {current}"
                break

            run = await agent_service.start_run(user_id, project_id, current, state.user_message)
            try:
                result = await agent.run(state, session)
                await agent_service.finish_run(run.id, status="completed", output=result)
            except Exception as e:
                await agent_service.finish_run(run.id, status="failed", error=str(e))
                state.error = str(e)
                break

            next_node = result.get("next", "end")

            if current == "ceo" and next_node == "planner":
                current = "planner"
            elif current == "planner" and next_node == "executor":
                import asyncio
                for task in list(state.active_tasks.values()):
                    task.status = "running"
                    task_agent = AGENT_MAP.get(task.assigned_agent, coding_agent)
                    sub_state = GraphState(
                        user_id=user_id,
                        project_id=project_id,
                        user_message=f"{task.title}\n\n{task.description}",
                        messages=state.messages.copy(),
                    )
                    try:
                        await asyncio.sleep(1.0)  # Pacing delay to respect API rate limits
                        await task_agent.run(sub_state, session)
                    except Exception:
                        pass
                    task.status = "done"
                    # Extract CLEAN text from sub-agent result
                    raw_result = sub_state.messages[-1].content if sub_state.messages else ""
                    task.result = _extract_clean_text(raw_result)
                    state.completed_tasks[task.id] = task
                current = "ceo"
            elif current == "ceo" and not state.final_answer and state.completed_tasks:
                # Direct synthesis — no extra CEO call, just concatenate task results cleanly
                parts = []
                for t in state.completed_tasks.values():
                    clean = _extract_clean_text(t.result or "")
                    if clean:
                        parts.append(f"**{t.title}**\n{clean}")
                state.final_answer = "\n\n".join(parts) if parts else "Task completed."
                state.completed_tasks = {}
                current = "end"
            elif next_node == "end" or (current == "ceo" and state.final_answer):
                # Ensure final_answer is always clean
                if state.final_answer:
                    state.final_answer = _extract_clean_text(state.final_answer)
                current = "end"
            else:
                current = next_node

        # Clean final_answer one last time before returning
        if state.final_answer:
            state.final_answer = _extract_clean_text(state.final_answer)

        try:
            await learning_agent.run(state, session)
        except Exception:
            pass

        return {
            "final_answer": state.final_answer or "Task completed.",
            "trace": state.trace,
            "tasks_created": state.tasks_created,
            "model_used": state.model_used,
        }

    async def stream(
        self,
        user_id: UUID,
        project_id: UUID | None,
        user_message: str,
        session: AsyncSession,
        image_base64: str | None = None,
        document_id: str | None = None,
    ) -> AsyncIterator[str]:
        """SSE streaming wrapper around run()."""
        state = GraphState(
            user_id=user_id,
            project_id=project_id,
            user_message=user_message,
            messages=[AgentMessage(role="user", content=user_message, agent="user")],
            image_base64=image_base64,
            document_id=document_id,
        )
        yield json.dumps({"type": "start", "message": user_message})
        current = "ceo"

        while current != "end" and state.iteration < state.max_iterations:
            state.iteration += 1
            state.current_agent = current
            agent = AGENT_MAP.get(current)
            if not agent:
                break

            yield json.dumps({"type": "agent_start", "agent": current})
            try:
                result = await agent.run(state, session)
                yield json.dumps({"type": "agent_done", "agent": current, "next": result.get("next")})
            except Exception as e:
                yield json.dumps({"type": "error", "error": str(e)})
                break

            next_node = result.get("next", "end")

            if current == "ceo" and next_node == "planner":
                current = "planner"
            elif current == "planner" and next_node == "executor":
                for task in list(state.active_tasks.values()):
                    task.status = "running"
                    task_agent = AGENT_MAP.get(task.assigned_agent, coding_agent)
                    sub_state = GraphState(
                        user_id=user_id,
                        project_id=project_id,
                        user_message=f"{task.title}\n\n{task.description}",
                        messages=state.messages.copy(),
                    )
                    yield json.dumps({"type": "agent_start", "agent": task.assigned_agent})
                    try:
                        await task_agent.run(sub_state, session)
                    except Exception as sub_exc:
                        yield json.dumps({"type": "error", "error": str(sub_exc)})
                    task.status = "done"
                    raw_result = sub_state.messages[-1].content if sub_state.messages else ""
                    task.result = _extract_clean_text(raw_result)
                    state.completed_tasks[task.id] = task
                current = "ceo"

            elif current == "ceo" and not state.final_answer and state.completed_tasks:
                # Direct clean synthesis — skip extra CEO API call to save rate limit
                parts = []
                for t in state.completed_tasks.values():
                    clean = _extract_clean_text(t.result or "")
                    if clean:
                        parts.append(f"**{t.title}**\n{clean}")
                state.final_answer = "\n\n".join(parts) if parts else "Task completed."
                state.completed_tasks = {}
                current = "end"

            elif next_node == "end" or (current == "ceo" and state.final_answer):
                if state.final_answer:
                    state.final_answer = _extract_clean_text(state.final_answer)
                current = "end"
            else:
                current = next_node

        # Final cleanup pass
        if state.final_answer:
            state.final_answer = _extract_clean_text(state.final_answer)

        yield json.dumps({"type": "done", "answer": state.final_answer or "Completed."})


orchestrator = Orchestrator()