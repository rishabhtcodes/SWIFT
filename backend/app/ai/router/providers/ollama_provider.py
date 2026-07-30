from __future__ import annotations
import time
from typing import Any, AsyncIterator
import httpx

from app.ai.router.providers.base import BaseProvider, ProviderMessage, ProviderResponse


class OllamaProvider(BaseProvider):
    name = "ollama"
    base_url = "http://localhost:11434/api"

    async def complete(
        self,
        model_id: str,
        messages: list[ProviderMessage],
        temperature: float = 0.2,
        max_tokens: int = 2048,
        tools: list[dict[str, Any]] | None = None,
    ) -> ProviderResponse:
        payload = {
            "model": model_id,
            "messages": [{"role": m.role, "content": str(m.content)} for m in messages],
            "stream": False,
            "options": {"temperature": temperature, "num_predict": max_tokens},
        }

        start = time.perf_counter()
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(f"{self.base_url}/chat", json=payload)
            resp.raise_for_status()
            data = resp.json()
        latency = int((time.perf_counter() - start) * 1000)

        content = data.get("message", {}).get("content", "")
        return ProviderResponse(
            content=content,
            model_id=model_id,
            tokens_in=data.get("prompt_eval_count", 0),
            tokens_out=data.get("eval_count", 0),
            latency_ms=latency,
            raw=data,
        )

    async def stream(
        self,
        model_id: str,
        messages: list[ProviderMessage],
        temperature: float = 0.2,
        max_tokens: int = 2048,
    ) -> AsyncIterator[str]:
        resp = await self.complete(model_id, messages, temperature, max_tokens)
        yield resp.content
