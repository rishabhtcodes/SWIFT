from __future__ import annotations
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents.base import BaseAgent
from app.ai.agents.state import GraphState, AgentMessage


class BackendAgent(BaseAgent):
    name = "backend"
    task_type = "coding"
    system_prompt = """You are the Senior Backend Engineer Agent in Swift AI OS.
Your objective:
1. Design and build robust FastAPI microservices, REST APIs, or Python backend modules.
2. Write production-ready code directly into workspace files using:
   ```write_file:backend/app/main.py
   <code here>
   ```
3. Include Pydantic schemas, endpoints, error handling, CORS, and dependency injection.
"""

    async def run(self, state: GraphState, session: AsyncSession) -> dict[str, Any]:
        thought = await self.think(state, session)
        state.trace.append({"agent": self.name, "model": thought["model"], "content": thought["content"][:500]})
        state.messages.append(AgentMessage(role="assistant", content=thought["content"], agent=self.name))
        return {"next": "end"}


backend_agent = BackendAgent()
