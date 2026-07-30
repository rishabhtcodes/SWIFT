from __future__ import annotations
from typing import Any
from uuid import UUID

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.memory import Memory
from app.ai.rag.embedder import embedder


class SemanticMemory:
    """Vector-indexed semantic memory with cosine similarity retrieval."""

    async def store(self, user_id: UUID, content: str, key: str | None = None, metadata: dict | None = None, session: AsyncSession | None = None, project_id: UUID | None = None) -> None:
        if session is None:
            return
        embedding = await embedder.embed(content)
        mem = Memory(
            user_id=user_id,
            project_id=project_id,
            memory_type="semantic",
            key=key,
            content=content,
            metadata_=metadata or {},
            importance=0.5,
        )
        # Note: embedding column requires pgvector extension
        session.add(mem)
        await session.flush()

    async def retrieve(self, user_id: UUID, query: str, limit: int = 5, session: AsyncSession | None = None, **kwargs) -> list[dict[str, Any]]:
        if session is None:
            return []
        q_embedding = await embedder.embed(query)
        # Cosine similarity via pgvector
        from sqlalchemy import text
        sql = text("""
            SELECT id, content, metadata, importance,
                   1 - (embedding <=> :qe) AS score
            FROM memories
            WHERE user_id = :uid AND memory_type = 'semantic'
            ORDER BY embedding <=> :qe
            LIMIT :lim
        """)
        result = await session.execute(sql, {"qe": str(q_embedding), "uid": str(user_id), "lim": limit})
        rows = result.fetchall()
        return [{"id": r[0], "content": r[1], "metadata": r[2], "importance": r[3], "score": float(r[4])} for r in rows]

    async def forget(self, user_id: UUID, memory_id: UUID, session: AsyncSession) -> None:
        result = await session.execute(select(Memory).where(Memory.id == memory_id, Memory.user_id == user_id))
        mem = result.scalar_one_or_none()
        if mem:
            await session.delete(mem)