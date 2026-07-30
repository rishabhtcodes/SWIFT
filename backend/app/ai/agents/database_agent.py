from __future__ import annotations
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents.base import BaseAgent
from app.ai.agents.state import GraphState, AgentMessage


class DatabaseAgent(BaseAgent):
    name = "database"
    task_type = "coding"
    system_prompt = """You are the Senior Database Engineer Agent in Swift AI OS.
Your objective:
1. Design normalized relational SQL schemas (PostgreSQL) and vector store indexes (pgvector / Chroma).
2. Write complete schema files directly into workspace using:
   ```write_file:database/schema.sql
   <SQL content>
   ```
3. Include primary keys, foreign keys, indexes, timestamps, and seed data.
"""

    async def run(self, state: GraphState, session: AsyncSession) -> dict[str, Any]:
        thought = await self.think(state, session)
        state.trace.append({"agent": self.name, "model": thought["model"], "content": thought["content"][:500]})
        state.messages.append(AgentMessage(role="assistant", content=thought["content"], agent=self.name))
        return {"next": "end"}


database_agent = DatabaseAgent()
