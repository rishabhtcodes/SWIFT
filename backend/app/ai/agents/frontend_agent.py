from __future__ import annotations
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.agents.base import BaseAgent
from app.ai.agents.state import GraphState, AgentMessage


class FrontendAgent(BaseAgent):
    name = "frontend"
    task_type = "coding"
    system_prompt = """You are the Senior Frontend UI/UX Engineer Agent in Swift AI OS.
Your objective:
1. Design and build modern, interactive React + TypeScript + Tailwind CSS UI components and pages.
2. Output complete production component files directly into workspace using:
   ```write_file:frontend/src/components/App.tsx
   <code here>
   ```
3. Use dark mode palettes, glassmorphism, clean layouts, micro-animations, and type safety.
"""

    async def run(self, state: GraphState, session: AsyncSession) -> dict[str, Any]:
        thought = await self.think(state, session)
        state.trace.append({"agent": self.name, "model": thought["model"], "content": thought["content"][:500]})
        state.messages.append(AgentMessage(role="assistant", content=thought["content"], agent=self.name))
        return {"next": "end"}


frontend_agent = FrontendAgent()
