import os

agents = [
    "coding", "research", "memory", "vision", "learning", "deployment", 
    "testing", "docs", "database", "frontend", "backend", "devops"
]

template = """from __future__ import annotations
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents.base import BaseAgent
from app.ai.agents.state import GraphState, AgentMessage


class {cap}Agent(BaseAgent):
    name = "{lower}"
    task_type = "{lower}"
    system_prompt = "You are the {cap} Agent. You handle {lower} tasks."

    async def run(self, state: GraphState, session: AsyncSession) -> dict[str, Any]:
        thought = await self.think(state, session)
        state.trace.append({{"agent": self.name, "model": thought["model"], "content": thought["content"][:500]}})
        state.messages.append(AgentMessage(role="assistant", content=thought["content"], agent=self.name))
        return {{"next": "end"}}


{lower}_agent = {cap}Agent()
"""

for a in agents:
    with open(f"app/ai/agents/{a}_agent.py", "w") as f:
        f.write(template.format(lower=a, cap=a.capitalize()))

planner_template = """from __future__ import annotations
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents.base import BaseAgent
from app.ai.agents.state import GraphState, AgentMessage


class PlannerAgent(BaseAgent):
    name = "planner"
    task_type = "planning"
    system_prompt = "You are the Planner Agent. You orchestrate tasks."

    async def run(self, state: GraphState, session: AsyncSession) -> dict[str, Any]:
        thought = await self.think(state, session)
        state.trace.append({"agent": self.name, "model": thought["model"], "content": thought["content"][:500]})
        state.messages.append(AgentMessage(role="assistant", content=thought["content"], agent=self.name))
        return {"next": "executor"}


planner_agent = PlannerAgent()
"""
with open(f"app/ai/agents/planner_agent.py", "w") as f:
    f.write(planner_template)
