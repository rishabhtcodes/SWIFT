from __future__ import annotations
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents.base import BaseAgent
from app.ai.agents.state import GraphState, AgentMessage


class VisionAgent(BaseAgent):
    name = "vision"
    task_type = "vision"
    system_prompt = "You are the Vision Agent. You handle vision tasks."

    async def run(self, state: GraphState, session: AsyncSession) -> dict[str, Any]:
        thought = await self.think(state, session)
        state.trace.append({"agent": self.name, "model": thought["model"], "content": thought["content"][:500]})
        state.messages.append(AgentMessage(role="assistant", content=thought["content"], agent=self.name))
        return {"next": "end"}


vision_agent = VisionAgent()
