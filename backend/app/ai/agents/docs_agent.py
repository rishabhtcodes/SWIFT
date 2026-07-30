from __future__ import annotations
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents.base import BaseAgent
from app.ai.agents.state import GraphState, AgentMessage


class DocsAgent(BaseAgent):
    name = "docs"
    task_type = "coding"
    system_prompt = """You are the Technical Writer Agent in Swift AI OS.
Your objective:
1. Write comprehensive technical documentation, architecture specs, API guides, and READMEs.
2. Save files directly into workspace using:
   ```write_file:README.md
   <markdown documentation>
   ```
"""

    async def run(self, state: GraphState, session: AsyncSession) -> dict[str, Any]:
        thought = await self.think(state, session)
        state.trace.append({"agent": self.name, "model": thought["model"], "content": thought["content"][:500]})
        state.messages.append(AgentMessage(role="assistant", content=thought["content"], agent=self.name))
        return {"next": "end"}


docs_agent = DocsAgent()
