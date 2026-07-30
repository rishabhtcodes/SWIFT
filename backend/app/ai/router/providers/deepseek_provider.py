from __future__ import annotations
from app.ai.router.providers.openai_provider import OpenAIProvider


class DeepSeekProvider(OpenAIProvider):
    name = "deepseek"
    base_url = "https://api.deepseek.com/v1"
