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

# ─── Groq fallback models (used as last resort when ALL other providers fail) ──
GROQ_FALLBACK_MODELS = [
    "llama-3.1-8b-instant",       # Fastest, cheapest — try first
    "llama-3.3-70b-versatile",    # Most capable — try second
    "mixtral-8x7b-32768",         # Alternative — try third
]


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
            # Return all candidates so complete() can walk the fallback chain
            "_all_candidates": [
                {"provider": m.provider, "model_id": m.model_id}
                for m in candidates
            ],
        }

    def _is_rate_limit_error(self, exc: Exception) -> bool:
        """Detect 429 / rate-limit errors from any provider."""
        msg = str(exc).lower()
        return "429" in msg or "rate limit" in msg or "too many requests" in msg or "quota" in msg

    async def complete(self, session: AsyncSession, task_type: str, messages: list[ProviderMessage], **kwargs) -> Any:
        """
        Smart fallback chain:
          1. Try primary model (from DB, highest priority)
          2. Try remaining DB-registered models in priority order
          3. Last resort: try Groq fallback models (llama-3.1-8b -> llama-3.3-70b -> mixtral)

        On ANY 429 / rate-limit error the next provider is tried automatically.
        Groq is ALWAYS available as the final guarantee.
        """
        import asyncio
        import logging
        logger = logging.getLogger("swift.model_router")

        selection = await self.select_model(session, task_type)
        all_candidates = selection.pop("_all_candidates", [])

        # --- Step 1: Try primary model ---
        try:
            provider = self._get_provider(selection["provider"])
            return await provider.complete(selection["model_id"], messages, **kwargs)
        except Exception as e:
            if self._is_rate_limit_error(e):
                logger.warning(f"[ModelRouter] Rate limit on {selection['provider']}/{selection['model_id']} - trying fallback chain")
            else:
                logger.warning(f"[ModelRouter] Error on {selection['provider']}/{selection['model_id']}: {e} - trying fallback chain")

        # --- Step 2: Try remaining DB-registered models (skip the primary already tried) ---
        tried = {(selection["provider"], selection["model_id"])}
        for candidate in all_candidates:
            key = (candidate["provider"], candidate["model_id"])
            if key in tried:
                continue
            tried.add(key)
            try:
                logger.info(f"[ModelRouter] Fallback - trying {candidate['provider']}/{candidate['model_id']}")
                await asyncio.sleep(0.5)  # Brief pause to avoid flooding
                provider = self._get_provider(candidate["provider"])
                return await provider.complete(candidate["model_id"], messages, **kwargs)
            except Exception as e:
                logger.warning(f"[ModelRouter] Fallback {candidate['provider']}/{candidate['model_id']} failed: {e}")

        # --- Step 3: LAST RESORT - Groq fallback models ---
        groq_provider = self._get_provider("groq")
        for groq_model in GROQ_FALLBACK_MODELS:
            if ("groq", groq_model) in tried:
                continue
            try:
                logger.warning(f"[ModelRouter] Last-resort Groq fallback - {groq_model}")
                await asyncio.sleep(1.0)  # Respect rate limits with a small pause
                return await groq_provider.complete(groq_model, messages, **kwargs)
            except Exception as e:
                if self._is_rate_limit_error(e):
                    logger.warning(f"[ModelRouter] Groq {groq_model} also rate-limited, trying next...")
                    await asyncio.sleep(3.0)  # Longer pause before next groq model
                    continue
                logger.error(f"[ModelRouter] Groq {groq_model} error: {e}")

        # All providers exhausted
        raise RuntimeError(
            "All AI providers are currently unavailable or rate-limited. "
            "Please wait a moment and try again, or add additional API keys in Settings."
        )


from app.ai.router.providers.ollama_provider import OllamaProvider


model_router = ModelRouter()