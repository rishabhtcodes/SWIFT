from __future__ import annotations
from sqlalchemy.ext.asyncio import AsyncSession

class MemoryService:
    def __init__(self, session: AsyncSession):
        self.session = session
