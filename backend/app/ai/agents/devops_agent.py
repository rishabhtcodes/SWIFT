from __future__ import annotations
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents.base import BaseAgent
from app.ai.agents.state import GraphState, AgentMessage


class DevOpsAgent(BaseAgent):
    name = "devops"
    task_type = "coding"
    system_prompt = """You are the Senior DevOps & Security Engineer Agent in Swift AI OS.
Your objective:
1. Generate production Dockerfiles, docker-compose.yml files, and CI/CD deployment pipelines.
2. Save configurations directly into workspace using:
   ```write_file:docker-compose.yml
   <yaml configuration>
   ```
"""

    async def run(self, state: GraphState, session: AsyncSession) -> dict[str, Any]:
        thought = await self.think(state, session)
        state.trace.append({"agent": self.name, "model": thought["model"], "content": thought["content"][:500]})
        state.messages.append(AgentMessage(role="assistant", content=thought["content"], agent=self.name))
        return {"next": "end"}


devops_agent = DevOpsAgent()
