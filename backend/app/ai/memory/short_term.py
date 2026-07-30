from __future__ import annotations
from typing import Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

class ShortTermMemory:
    def __init__(self):
        self._cache = {}

    async def store(self, user_id: UUID, content: str, key: str | None = None, metadata: dict | None = None, session: AsyncSession | None = None, project_id: UUID | None = None) -> None:
        self._cache[f"{user_id}:{key or content[:20]}"] = content

    async def retrieve(self, user_id: UUID, query: str, limit: int = 5, session: AsyncSession | None = None) -> list[dict[str, Any]]:
        return [{"content": v, "score": 0.8} for k, v in self._cache.items() if str(user_id) in k][:limit]

    async def forget(self, user_id: UUID, memory_id: UUID, session: AsyncSession) -> None:
        pass
