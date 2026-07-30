from __future__ import annotations
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents.base import BaseAgent
from app.ai.agents.state import GraphState, AgentMessage


class TestingAgent(BaseAgent):
    name = "testing"
    task_type = "coding"
    system_prompt = """You are the Senior QA & Testing Engineer Agent in Swift AI OS.
Your objective:
1. Write unit tests, integration tests, and API contract test suites (PyTest / Jest / Vitest).
2. Save test suites directly into workspace using:
   ```write_file:tests/test_api.py
   <test code>
   ```
"""

    async def run(self, state: GraphState, session: AsyncSession) -> dict[str, Any]:
        thought = await self.think(state, session)
        state.trace.append({"agent": self.name, "model": thought["model"], "content": thought["content"][:500]})
        state.messages.append(AgentMessage(role="assistant", content=thought["content"], agent=self.name))
        return {"next": "end"}


testing_agent = TestingAgent()
