from __future__ import annotations
from datetime import datetime
from typing import Any
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.memory.short_term import ShortTermMemory
from app.ai.memory.long_term import LongTermMemory
from app.ai.memory.semantic import SemanticMemory
from app.ai.memory.conversation import ConversationMemory
from app.ai.memory.project import ProjectMemory
from app.ai.memory.preference import PreferenceMemory
from app.ai.memory.learning import LearningMemory


class MemoryManager:
    def __init__(self):
        self.stores = {
            "short_term": ShortTermMemory(),
            "long_term": LongTermMemory(),
            "semantic": SemanticMemory(),
            "conversation": ConversationMemory(),
            "project": ProjectMemory(),
            "preference": PreferenceMemory(),
            "learning": LearningMemory(),
        }

    async def store(self, user_id: UUID, memory_type: str, content: str, key: str | None = None, metadata: dict | None = None, session: AsyncSession | None = None, project_id: UUID | None = None) -> None:
        store = self.stores.get(memory_type)
        if not store:
            raise ValueError(f"Unknown memory type: {memory_type}")
        await store.store(user_id=user_id, content=content, key=key, metadata=metadata or {}, session=session, project_id=project_id)

    async def retrieve(self, user_id: UUID, query: str, memory_types: list[str] | None = None, limit: int = 5, session: AsyncSession | None = None) -> list[dict[str, Any]]:
        types = memory_types or list(self.stores.keys())
        results = []
        for t in types:
            store = self.stores.get(t)
            if not store:
                continue
            items = await store.retrieve(user_id=user_id, query=query, limit=limit, session=session)
            for item in items:
                item["memory_type"] = t
            results.extend(items)
        # Rank by relevance (simple: importance + recency)
        results.sort(key=lambda x: x.get("score", 0), reverse=True)
        return results[:limit]

    async def forget(self, user_id: UUID, memory_id: UUID, session: AsyncSession) -> None:
        for store in self.stores.values():
            await store.forget(user_id, memory_id, session)


memory_manager = MemoryManager()