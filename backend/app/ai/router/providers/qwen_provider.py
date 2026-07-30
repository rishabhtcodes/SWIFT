from __future__ import annotations
import asyncio
import time
from typing import Any, AsyncIterator

import dashscope
from dashscope import MultiModalConversation, Generation
from http import HTTPStatus

from app.ai.router.providers.base import BaseProvider, ProviderMessage, ProviderResponse

# Use the international DashScope endpoint
dashscope.base_http_api_url = "https://dashscope-intl.aliyuncs.com/api/v1"


def _build_dashscope_messages(messages: list[ProviderMessage]) -> list[dict[str, Any]]:
    """Convert ProviderMessages to DashScope MultiModal message format."""
    result = []
    for m in messages:
        if isinstance(m.content, list):
            # Already structured content (text + image parts)
            content = m.content
        elif m.image_base64:
            # Base64 image attached to a text message
            content = [
                {"image": f"data:image/jpeg;base64,{m.image_base64}"},
                {"text": m.content},
            ]
        else:
            # Plain text — wrap in list for MultiModal API compatibility
            content = [{"text": m.content}]
        result.append({"role": m.role, "content": content})
    return result


def _build_generation_messages(messages: list[ProviderMessage]) -> list[dict[str, Any]]:
    """Convert ProviderMessages to DashScope Generation (text-only) message format."""
    return [
        {"role": m.role, "content": m.content if isinstance(m.content, str) else str(m.content)}
        for m in messages
    ]


def _has_vision_content(messages: list[ProviderMessage]) -> bool:
    """Return True if any message contains image content."""
    for m in messages:
        if m.image_base64:
            return True
        if isinstance(m.content, list):
            if any("image" in part for part in m.content):
                return True
    return False


class QwenProvider(BaseProvider):
    name = "qwen"

    # Default model — can be overridden per-request via model_id
    DEFAULT_MODEL = "qwen-plus"
    DEFAULT_VISION_MODEL = "qwen-vl-plus"

    def __init__(self, api_key: str | None = None, config: dict[str, Any] | None = None):
        super().__init__(api_key=api_key, config=config)

    async def complete(
        self,
        model_id: str,
        messages: list[ProviderMessage],
        temperature: float = 0.2,
        max_tokens: int = 2048,
        tools: list[dict[str, Any]] | None = None,
    ) -> ProviderResponse:
        start = time.perf_counter()
        use_vision = _has_vision_content(messages)

        def _call_sync() -> Any:
            if use_vision:
                ds_messages = _build_dashscope_messages(messages)
                return MultiModalConversation.call(
                    api_key=self.api_key,
                    model=model_id,
                    messages=ds_messages,
                )
            else:
                ds_messages = _build_generation_messages(messages)
                kwargs: dict[str, Any] = dict(
                    api_key=self.api_key,
                    model=model_id,
                    messages=ds_messages,
                    max_tokens=max_tokens,
                    temperature=temperature,
                )
                if tools:
                    kwargs["tools"] = tools
                return Generation.call(**kwargs)

        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, _call_sync)

        if response.status_code != HTTPStatus.OK:
            raise RuntimeError(
                f"[QwenProvider] API error {response.status_code}: "
                f"{response.message} (request_id={response.request_id})"
            )

        latency = int((time.perf_counter() - start) * 1000)
        choice = response.output.choices[0]
        message = choice.message

        # Extract text content (multimodal responses return list, text returns string)
        if use_vision:
            raw_content = message.content
            if isinstance(raw_content, list):
                text = " ".join(
                    part.get("text", "") for part in raw_content if isinstance(part, dict)
                )
            else:
                text = str(raw_content)
        else:
            text = message.content or ""

        # Append tool_calls if present
        if hasattr(message, "tool_calls") and message.tool_calls:
            text += "\n[tool_calls:" + str(message.tool_calls) + "]"

        usage = response.usage or {}
        tokens_in = getattr(usage, "input_tokens", 0) or 0
        tokens_out = getattr(usage, "output_tokens", 0) or 0

        return ProviderResponse(
            content=text,
            model_id=model_id,
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            latency_ms=latency,
            raw=response.__dict__,
        )

    async def stream(
        self,
        model_id: str,
        messages: list[ProviderMessage],
        temperature: float = 0.2,
        max_tokens: int = 2048,
    ) -> AsyncIterator[str]:
        """Streaming via DashScope incremental output."""
        ds_messages = _build_generation_messages(messages)

        def _stream_sync():
            return Generation.call(
                api_key=self.api_key,
                model=model_id,
                messages=ds_messages,
                max_tokens=max_tokens,
                temperature=temperature,
                stream=True,
                incremental_output=True,
            )

        loop = asyncio.get_event_loop()
        responses = await loop.run_in_executor(None, _stream_sync)

        for resp in responses:
            if resp.status_code == HTTPStatus.OK:
                chunk = resp.output.choices[0].message.content
                if chunk:
                    yield chunk
            else:
                raise RuntimeError(
                    f"[QwenProvider] Stream error {resp.status_code}: {resp.message}"
                )
