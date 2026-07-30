from __future__ import annotations
import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Boolean, DateTime, Numeric, JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class ModelRegistry(Base):
    __tablename__ = "model_registry"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider: Mapped[str] = mapped_column(String(64), nullable=False)
    model_id: Mapped[str] = mapped_column(String(128), nullable=False)
    display_name: Mapped[str | None] = mapped_column(String(255))
    capabilities: Mapped[list] = mapped_column(JSON, default=list)
    context_window: Mapped[int] = mapped_column(Integer, default=128000)
    input_cost_per_1m: Mapped[float] = mapped_column(Numeric(10, 4), default=0)
    output_cost_per_1m: Mapped[float] = mapped_column(Numeric(10, 4), default=0)
    latency_ms: Mapped[int | None] = mapped_column(Integer)
    is_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    priority: Mapped[int] = mapped_column(Integer, default=10)
    fallback_model_id: Mapped[str | None] = mapped_column(String(128))
    health_status: Mapped[str] = mapped_column(String(32), default="healthy")
    last_checked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    config: Mapped[dict] = mapped_column(JSON, default=dict)