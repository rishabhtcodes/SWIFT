from __future__ import annotations
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.memory import Memory
from app.repositories.base import BaseRepository

class MemoryRepository(BaseRepository[Memory]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, Memory)
