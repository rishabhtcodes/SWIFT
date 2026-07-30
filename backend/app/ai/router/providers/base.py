from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, AsyncIterator


@dataclass
class ProviderMessage:
    role: str  # system | user | assistant | tool
    content: str | list[dict[str, Any]]
    image_base64: str | None = None


@dataclass
class ProviderResponse:
    content: str
    model_id: str
    tokens_in: int = 0
    tokens_out: int = 0
    latency_ms: int = 0
    raw: dict[str, Any] | None = None


class BaseProvider(ABC):
    name: str = "base"

    def __init__(self, api_key: str | None = None, config: dict[str, Any] | None = None):
        self.api_key = api_key
        self.config = config or {}

    @abstractmethod
    async def complete(
        self,
        model_id: str,
        messages: list[ProviderMessage],
        temperature: float = 0.2,
        max_tokens: int = 2048,
        tools: list[dict[str, Any]] | None = None,
    ) -> ProviderResponse:
        ...

    @abstractmethod
    async def stream(
        self,
        model_id: str,
        messages: list[ProviderMessage],
        temperature: float = 0.2,
        max_tokens: int = 2048,
    ) -> AsyncIterator[str]:
        ...

    async def health_check(self, model_id: str) -> dict[str, Any]:
        try:
            resp = await self.complete(
                model_id=model_id,
                messages=[ProviderMessage(role="user", content="ping")],
                max_tokens=4,
            )
            return {"status": "healthy", "latency_ms": resp.latency_ms}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}