from __future__ import annotations
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents.base import BaseAgent
from app.ai.agents.state import GraphState, AgentMessage


class CodingAgent(BaseAgent):
    name = "coding"
    task_type = "coding"
    system_prompt = """You are the Senior Coding Agent in Swift AI OS.
Your objective:
1. Write clean, production-ready, typed, fully functional code (Python, TypeScript, SQL, etc.).
2. Always write code directly into files using markdown code blocks tagged with the filename:
   ```write_file:project_name/file_path.ext
   <complete code>
   ```
3. Never output truncated code, placeholders, or TODO comments.
4. Implement complete implementations including imports, configuration, handlers, and error checking.
"""

    async def run(self, state: GraphState, session: AsyncSession) -> dict[str, Any]:
        thought = await self.think(state, session)
        state.trace.append({"agent": self.name, "model": thought["model"], "content": thought["content"][:500]})
        state.messages.append(AgentMessage(role="assistant", content=thought["content"], agent=self.name))
        return {"next": "end"}


coding_agent = CodingAgent()
