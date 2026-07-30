from __future__ import annotations
import asyncio
import logging
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

logger = logging.getLogger("swift.model_router")

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

GROQ_FALLBACK_MODELS = [
    "llama-3.1-8b-instant",
    "llama-3.3-70b-versatile",
    "mixtral-8x7b-32768",
]


class ModelRouter:
    def __init__(self):
        self._instances: dict[str, BaseProvider] = {}

    async def initialize(self) -> None:
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

    def _is_valid_provider(self, provider_name: str) -> bool:
        """Check if provider has a configured API key or is local (Ollama/Mock)."""
        if provider_name in ("ollama", "mock"):
            return True
        inst = self._instances.get(provider_name)
        if not inst or not inst.api_key or inst.api_key.startswith("sk_your") or inst.api_key.startswith("sk-ant-your"):
            return False
        return True

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
        cache_key = f"model_route:{task_type}"

        required = TASK_CAPABILITY_MAP.get(task_type, [])
        result = await session.execute(
            select(ModelRegistry)
            .where(ModelRegistry.is_enabled == True)
            .order_by(ModelRegistry.priority.desc())
        )
        candidates = list(result.scalars().all())

        if required:
            filtered = [m for m in candidates if any(c in (m.capabilities or []) for c in required)]
            if filtered:
                candidates = filtered

        # Prefer candidates with configured valid API keys
        valid_candidates = [m for m in candidates if self._is_valid_provider(m.provider)]
        if valid_candidates:
            candidates = valid_candidates

        if not candidates:
            raise ValueError(f"No model available for task type: {task_type}")

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
            "_all_candidates": [
                {"provider": m.provider, "model_id": m.model_id}
                for m in candidates
            ],
        }

    def _is_rate_limit_error(self, exc: Exception) -> bool:
        msg = str(exc).lower()
        return "429" in msg or "rate limit" in msg or "too many requests" in msg or "quota" in msg

    async def complete(self, session: AsyncSession, task_type: str, messages: list[ProviderMessage], **kwargs) -> Any:
        selection = await self.select_model(session, task_type)
        all_candidates = selection.pop("_all_candidates", [])

        # Priority list of models to try
        candidates_to_try = [selection] + [c for c in all_candidates if (c["provider"], c["model_id"]) != (selection["provider"], selection["model_id"])]

        tried = set()

        for cand in candidates_to_try:
            prov_name = cand["provider"]
            mod_id = cand["model_id"]
            key = (prov_name, mod_id)
            if key in tried:
                continue
            tried.add(key)

            if not self._is_valid_provider(prov_name):
                continue

            provider = self._get_provider(prov_name)

            # Retry up to 2 times with exponential backoff on 429
            for attempt in range(2):
                try:
                    return await provider.complete(mod_id, messages, **kwargs)
                except Exception as e:
                    if self._is_rate_limit_error(e):
                        logger.warning(f"[ModelRouter] Rate limit on {prov_name}/{mod_id} (attempt {attempt + 1}) - waiting 1.5s...")
                        await asyncio.sleep(1.5 * (attempt + 1))
                        continue
                    else:
                        logger.warning(f"[ModelRouter] Error on {prov_name}/{mod_id}: {e}")
                        break

        # Fallback to Groq if configured
        if self._is_valid_provider("groq"):
            groq_provider = self._get_provider("groq")
            for groq_model in GROQ_FALLBACK_MODELS:
                if ("groq", groq_model) in tried:
                    continue
                try:
                    logger.warning(f"[ModelRouter] Groq fallback - {groq_model}")
                    await asyncio.sleep(1.0)
                    return await groq_provider.complete(groq_model, messages, **kwargs)
                except Exception as e:
                    if self._is_rate_limit_error(e):
                        await asyncio.sleep(2.0)
                        continue
                    logger.error(f"[ModelRouter] Groq {groq_model} error: {e}")

        raise RuntimeError(
            "All configured AI providers are currently rate-limited. "
            "Please wait a moment and try again, or add additional API keys in Settings."
        )


from app.ai.router.providers.ollama_provider import OllamaProvider

model_router = ModelRouter()