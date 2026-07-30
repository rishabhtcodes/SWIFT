from __future__ import annotations
import uuid
from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    project_id: uuid.UUID | None = None
    model_override: str | None = None
    image_base64: str | None = None
    document_id: str | None = None


class ChatResponse(BaseModel):
    response: str
    agent_trace: list[dict] = []
    tasks_created: int = 0
    model_used: str | None = None


class AgentRunOut(BaseModel):
    id: uuid.UUID
    agent_name: str
    status: str
    tokens_in: int
    tokens_out: int
    latency_ms: int
    cost_usd: float
    model_used: str | None
    error: str | None

    model_config = {"from_attributes": True}
