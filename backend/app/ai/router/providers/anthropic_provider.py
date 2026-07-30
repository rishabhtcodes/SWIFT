from __future__ import annotations
import time
from typing import Any, AsyncIterator
import httpx

from app.ai.router.providers.base import BaseProvider, ProviderMessage, ProviderResponse


class AnthropicProvider(BaseProvider):
    name = "anthropic"
    base_url = "https://api.anthropic.com/v1"

    async def complete(
        self,
        model_id: str,
        messages: list[ProviderMessage],
        temperature: float = 0.2,
        max_tokens: int = 2048,
        tools: list[dict[str, Any]] | None = None,
    ) -> ProviderResponse:
        system_msg = "\n".join(m.content for m in messages if m.role == "system" and isinstance(m.content, str))
        user_msgs = [{"role": m.role if m.role != "system" else "user", "content": m.content} for m in messages if m.role != "system"]
        if not user_msgs:
            user_msgs = [{"role": "user", "content": "Hello"}]

        payload: dict[str, Any] = {
            "model": model_id,
            "messages": user_msgs,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }
        if system_msg:
            payload["system"] = system_msg

        start = time.perf_counter()
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                f"{self.base_url}/messages",
                headers={
                    "x-api-key": self.api_key or "",
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json=payload,
            )
            resp.raise_for_status()
            data = resp.json()
        latency = int((time.perf_counter() - start) * 1000)
        content_text = ""
        for block in data.get("content", []):
            if block.get("type") == "text":
                content_text += block.get("text", "")
        usage = data.get("usage", {})
        return ProviderResponse(
            content=content_text,
            model_id=model_id,
            tokens_in=usage.get("input_tokens", 0),
            tokens_out=usage.get("output_tokens", 0),
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
