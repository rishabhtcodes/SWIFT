from __future__ import annotations
from typing import Type

from app.ai.router.providers.base import BaseProvider
from app.ai.router.providers.openai_provider import OpenAIProvider
from app.ai.router.providers.anthropic_provider import AnthropicProvider
from app.ai.router.providers.gemini_provider import GeminiProvider
from app.ai.router.providers.deepseek_provider import DeepSeekProvider
from app.ai.router.providers.qwen_provider import QwenProvider
from app.ai.router.providers.ollama_provider import OllamaProvider
from app.ai.router.providers.groq_provider import GroqProvider
from app.ai.router.providers.mock_provider import MockProvider


class ProviderRegistry:
    _providers: dict[str, Type[BaseProvider]] = {
        "openai": OpenAIProvider,
        "anthropic": AnthropicProvider,
        "google": GeminiProvider,
        "gemini": GeminiProvider,
        "deepseek": DeepSeekProvider,
        "qwen": QwenProvider,
        "ollama": OllamaProvider,
        "groq": GroqProvider,
        "mock": MockProvider,
    }

    @classmethod
    def register(cls, name: str, provider_cls: Type[BaseProvider]) -> None:
        cls._providers[name.lower()] = provider_cls

    @classmethod
    def get(cls, name: str) -> Type[BaseProvider] | None:
        return cls._providers.get(name.lower())

    @classmethod
    def available(cls) -> list[str]:
        return list(cls._providers.keys())