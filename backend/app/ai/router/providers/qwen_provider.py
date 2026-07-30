from __future__ import annotations
from app.ai.router.providers.openai_provider import OpenAIProvider


class QwenProvider(OpenAIProvider):
    name = "qwen"
    base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"
