from __future__ import annotations
from sqlalchemy.ext.asyncio import AsyncSession

class ProjectService:
    def __init__(self, session: AsyncSession):
        self.session = session
