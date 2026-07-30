from __future__ import annotations
import uuid
from datetime import datetime
from pydantic import BaseModel


class TaskCreate(BaseModel):
    project_id: uuid.UUID | None = None
    parent_id: uuid.UUID | None = None
    title: str
    description: str | None = None
    status: str = "backlog"
    priority: int = 2
    assigned_agent: str | None = None
    sprint: str | None = None


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    priority: int | None = None
    assigned_agent: str | None = None
    sprint: str | None = None
    progress: dict | None = None


class TaskOut(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID | None
    parent_id: uuid.UUID | None
    title: str
    description: str | None
    status: str
    priority: int
    assigned_agent: str | None
    sprint: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
