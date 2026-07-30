from __future__ import annotations
import uuid
from datetime import datetime
from pydantic import BaseModel


class ModelRegistryCreate(BaseModel):
    provider: str
    model_id: str
    display_name: str | None = None
    capabilities: list[str] = []
    context_window: int = 8192
    input_cost_per_1m: float = 0.0
    output_cost_per_1m: float = 0.0
    is_enabled: bool = True
    priority: int = 50
    fallback_model_id: str | None = None
    config: dict = {}


class ModelRegistryUpdate(BaseModel):
    display_name: str | None = None
    capabilities: list[str] | None = None
    context_window: int | None = None
    input_cost_per_1m: float | None = None
    output_cost_per_1m: float | None = None
    is_enabled: bool | None = None
    priority: int | None = None
    fallback_model_id: str | None = None
    health_status: str | None = None
    config: dict | None = None


class ModelRegistryOut(BaseModel):
    id: uuid.UUID
    provider: str
    model_id: str
    display_name: str | None
    capabilities: list[str]
    context_window: int
    input_cost_per_1m: float
    output_cost_per_1m: float
    latency_ms: int | None
    is_enabled: bool
    priority: int
    fallback_model_id: str | None
    health_status: str
    last_checked_at: datetime | None

    model_config = {"from_attributes": True}
