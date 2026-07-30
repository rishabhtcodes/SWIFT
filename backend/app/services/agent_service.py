from __future__ import annotations
import uuid
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.agent_run import AgentRun

class AgentService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def start_run(self, user_id: uuid.UUID, project_id: uuid.UUID | None, agent_name: str, input_msg: str) -> AgentRun:
        run = AgentRun(
            user_id=user_id,
            project_id=project_id,
            agent_name=agent_name,
            input={"message": input_msg},
            status="running",
        )
        self.session.add(run)
        await self.session.flush()
        return run

    async def finish_run(self, run_id: uuid.UUID, status: str = "completed", output: Any = None, error: str | None = None) -> None:
        from sqlalchemy import select
        res = await self.session.execute(select(AgentRun).where(AgentRun.id == run_id))
        run = res.scalar_one_or_none()
        if run:
            run.status = status
            run.output = output if isinstance(output, dict) else {"result": str(output)}
            run.error = error
            run.finished_at = __import__("datetime").datetime.utcnow()
            await self.session.flush()
