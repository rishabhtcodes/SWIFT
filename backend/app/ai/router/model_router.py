from __future__ import annotations
import time
from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.redis import redis_client
from app.models.model_registry import ModelRegistry
from app.schemas.model import ModelRegistryCreate, ModelRegistryUpdate
from app.ai.router.provider_registry import ProviderRegistry
from app.ai.router.providers.base import BaseProvider, ProviderMessage


# Task type → required capabilities mapping
TASK_CAPABILITY_MAP = {
    "coding": ["coding"],
    "reasoning": ["reasoning"],
    "vision": ["vision"],
    "translation": ["translation"],
    "document": ["document"],
    "planning": ["planning", "reasoning"],
    "rag": ["rag", "reasoning"],
    "general": [],
}


class ModelRouter:
    def __init__(self):
        self._instances: dict[str, BaseProvider] = {}

    async def initialize(self) -> None:
        # Pre-instantiate providers with API keys
        key_map = {
            "openai": settings.openai_api_key,
            "anthropic": settings.anthropic_api_key,
            "google": settings.google_api_key,
            "gemini": settings.google_api_key,
            "deepseek": settings.deepseek_api_key,
            "qwen": settings.qwen_api_key,
            "groq": settings.groq_api_key,
        }
        for name, cls in ProviderRegistry._providers.items():
            key = key_map.get(name)
            if cls is not OllamaProvider or True:  # Ollama needs no key
                try:
                    self._instances[name] = cls(api_key=key)
                except Exception:
                    pass

    def _get_provider(self, provider_name: str) -> BaseProvider:
        inst = self._instances.get(provider_name)
        if inst:
            return inst
        cls = ProviderRegistry.get(provider_name)
        if not cls:
            raise ValueError(f"Unknown provider: {provider_name}")
        inst = cls()
        self._instances[provider_name] = inst
        return inst

    async def list_models(self, session: AsyncSession) -> list[ModelRegistry]:
        result = await session.execute(select(ModelRegistry).order_by(ModelRegistry.priority.desc()))
        return list(result.scalars().all())

    async def register_model(self, session: AsyncSession, data: ModelRegistryCreate) -> ModelRegistry:
        model = ModelRegistry(**data.model_dump())
        session.add(model)
        await session.flush()
        await session.refresh(model)
        return model

    async def update_model(self, session: AsyncSession, model_id: UUID, data: ModelRegistryUpdate) -> ModelRegistry:
        result = await session.execute(select(ModelRegistry).where(ModelRegistry.id == model_id))
        model = result.scalar_one_or_none()
        if not model:
            raise ValueError("Model not found")
        for k, v in data.model_dump(exclude_unset=True).items():
            setattr(model, k, v)
        await session.flush()
        await session.refresh(model)
        return model

    async def check_health(self, session: AsyncSession, model_id: UUID) -> dict[str, Any]:
        result = await session.execute(select(ModelRegistry).where(ModelRegistry.id == model_id))
        model = result.scalar_one_or_none()
        if not model:
            raise ValueError("Model not found")
        provider = self._get_provider(model.provider)
        health = await provider.health_check(model.model_id)
        model.health_status = health.get("status", "unknown")
        model.latency_ms = health.get("latency_ms")
        model.last_checked_at = __import__("datetime").datetime.utcnow()
        await session.flush()
        return health

    async def select_model(self, session: AsyncSession, task_type: str = "general") -> dict[str, Any]:
        """Pick the best enabled model for a task type, with fallback."""
        cache_key = f"model_route:{task_type}"
        # Cache temporarily disabled to force fresh DB read
        # cached = await redis_client.get(cache_key)
        # if cached:
        #     return cached

        required = TASK_CAPABILITY_MAP.get(task_type, [])
        result = await session.execute(
            select(ModelRegistry)
            .where(ModelRegistry.is_enabled == True)
            .order_by(ModelRegistry.priority.desc())
        )
        candidates = list(result.scalars().all())

        # Filter by capability
        if required:
            filtered = [m for m in candidates if any(c in (m.capabilities or []) for c in required)]
            if filtered:
                candidates = filtered

        if not candidates:
            raise ValueError(f"No model available for task type: {task_type}")

        # Pick highest priority healthy model
        primary = next((m for m in candidates if m.health_status == "healthy"), candidates[0])

        await redis_client.set(cache_key, {
            "provider": primary.provider,
            "model_id": primary.model_id,
            "display_name": primary.display_name,
            "context_window": primary.context_window,
        }, ttl=60)

        return {
            "provider": primary.provider,
            "model_id": primary.model_id,
            "display_name": primary.display_name,
            "context_window": primary.context_window,
        }

    async def complete(self, session: AsyncSession, task_type: str, messages: list[ProviderMessage], **kwargs) -> Any:
        selection = await self.select_model(session, task_type)
        provider = self._get_provider(selection["provider"])
        try:
            return await provider.complete(selection["model_id"], messages, **kwargs)
        except Exception as e:
            # Fallback
            if selection.get("fallback_model_id"):
                fallback_provider = self._get_provider(selection["provider"])
                return await fallback_provider.complete(selection["fallback_model_id"], messages, **kwargs)
            raise


from app.ai.router.providers.ollama_provider import OllamaProvider


model_router = ModelRouter()