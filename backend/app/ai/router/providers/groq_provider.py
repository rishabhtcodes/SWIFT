from __future__ import annotations
import time
from typing import Any, AsyncIterator

import httpx

from app.ai.router.providers.base import BaseProvider, ProviderMessage, ProviderResponse


class GroqProvider(BaseProvider):
    name = "groq"
    base_url = "https://api.groq.com/openai/v1"

    async def complete(
        self,
        model_id: str,
        messages: list[ProviderMessage],
        temperature: float = 0.2,
        max_tokens: int = 2048,
        tools: list[dict[str, Any]] | None = None,
    ) -> ProviderResponse:
        payload: dict[str, Any] = {
            "model": model_id,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if tools:
            payload["tools"] = tools

        start = time.perf_counter()
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                f"{self.base_url}/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json=payload,
            )
            resp.raise_for_status()
            data = resp.json()
        latency = int((time.perf_counter() - start) * 1000)
        choice = data["choices"][0]["message"]
        usage = data.get("usage", {})
        content = choice.get("content") or ""
        if choice.get("tool_calls"):
            content += "\n[tool_calls:" + str(choice["tool_calls"]) + "]"
        return ProviderResponse(
            content=content,
            model_id=model_id,
            tokens_in=usage.get("prompt_tokens", 0),
            tokens_out=usage.get("completion_tokens", 0),
            latency_ms=latency,
            raw=data,
        )

    async def stream(self, model_id: str, messages: list[ProviderMessage], temperature: float = 0.2, max_tokens: int = 2048) -> AsyncIterator[str]:
        payload = {
            "model": model_id,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": True,
        }
        async with httpx.AsyncClient(timeout=120) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json=payload,
            ) as resp:
                resp.raise_for_status()
                async for line in resp.aiter_lines():
                    if not line.startswith("data:"):
                        continue
                    data = line[5:].strip()
                    if data == "[DONE]":
                        return
                    yield data
