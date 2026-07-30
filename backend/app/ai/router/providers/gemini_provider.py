from __future__ import annotations
import time
from typing import Any, AsyncIterator
import httpx

from app.ai.router.providers.base import BaseProvider, ProviderMessage, ProviderResponse


class GeminiProvider(BaseProvider):
    name = "gemini"
    base_url = "https://generativelanguage.googleapis.com/v1beta"

    async def complete(
        self,
        model_id: str,
        messages: list[ProviderMessage],
        temperature: float = 0.2,
        max_tokens: int = 2048,
        tools: list[dict[str, Any]] | None = None,
    ) -> ProviderResponse:
        contents = []
        for m in messages:
            role = "user" if m.role in ["user", "system"] else "model"
            parts: list[dict[str, Any]] = [{"text": str(m.content)}]
            if m.image_base64:
                b64 = m.image_base64.split(",", 1)[-1] if "," in m.image_base64 else m.image_base64
                parts.insert(0, {
                    "inlineData": {
                        "mimeType": "image/jpeg",
                        "data": b64
                    }
                })
            if contents and contents[-1]["role"] == role:
                contents[-1]["parts"].extend(parts)
            else:
                contents.append({"role": role, "parts": parts})

        payload = {
            "contents": contents,
            "generationConfig": {"temperature": temperature, "maxOutputTokens": max_tokens},
        }

        start = time.perf_counter()
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                f"{self.base_url}/models/{model_id}:generateContent?key={self.api_key or ''}",
                json=payload,
            )
            resp.raise_for_status()
            data = resp.json()
        latency = int((time.perf_counter() - start) * 1000)

        text = ""
        candidates = data.get("candidates", [])
        if candidates:
            parts = candidates[0].get("content", {}).get("parts", [])
            text = "".join(p.get("text", "") for p in parts)

        return ProviderResponse(
            content=text,
            model_id=model_id,
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
