from __future__ import annotations
from typing import Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

class BaseMemoryStore:
    async def store(self, user_id: UUID, content: str, key: str | None = None, metadata: dict | None = None, session: AsyncSession | None = None, project_id: UUID | None = None) -> None:
        pass

    async def retrieve(self, user_id: UUID, query: str, limit: int = 5, session: AsyncSession | None = None) -> list[dict[str, Any]]:
        return []

    async def forget(self, user_id: UUID, memory_id: UUID, session: AsyncSession) -> None:
        pass

class LongTermMemory(BaseMemoryStore): pass
