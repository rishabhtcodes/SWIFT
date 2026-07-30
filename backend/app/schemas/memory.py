from __future__ import annotations
import uuid
from datetime import datetime
from pydantic import BaseModel


class MemoryCreate(BaseModel):
    memory_type: str
    content: str
    key: str | None = None
    project_id: uuid.UUID | None = None
    importance: float = 0.5
    metadata: dict = {}


class MemoryOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    memory_type: str
    key: str | None
    content: str
    importance: float
    access_count: int
    created_at: datetime

    model_config = {"from_attributes": True}
