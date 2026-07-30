from __future__ import annotations
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents.base import BaseAgent
from app.ai.agents.state import GraphState, AgentMessage


class TestingAgent(BaseAgent):
    name = "testing"
    task_type = "testing"
    system_prompt = "You are the Testing Agent. You handle testing tasks."

    async def run(self, state: GraphState, session: AsyncSession) -> dict[str, Any]:
        thought = await self.think(state, session)
        state.trace.append({"agent": self.name, "model": thought["model"], "content": thought["content"][:500]})
        state.messages.append(AgentMessage(role="assistant", content=thought["content"], agent=self.name))
        return {"next": "end"}


testing_agent = TestingAgent()
