from __future__ import annotations
import asyncio
import time
from typing import Any, AsyncIterator

from app.ai.router.providers.base import BaseProvider, ProviderMessage, ProviderResponse


class MockProvider(BaseProvider):
    name = "mock"

    async def complete(
        self,
        model_id: str,
        messages: list[ProviderMessage],
        temperature: float = 0.2,
        max_tokens: int = 2048,
        tools: list[dict[str, Any]] | None = None,
    ) -> ProviderResponse:
        await asyncio.sleep(1) # simulate latency
        
        # Decide output based on agent prompting
        content = "This is a simulated response from the Mock Provider."
        last_msg = messages[-1].content if messages else ""
        system_msg = next((m.content for m in messages if m.role == "system"), "")
        
        if "CEO Agent" in system_msg:
            content = '{"decision": "delegate", "answer": "I have created a plan to handle your request.", "plan": [{"title": "Initial Setup", "agent": "planner", "description": "Plan the steps for the user request"}]}'
        elif "Planner Agent" in system_msg:
            content = '{"next": "executor"}'
        elif "Coding Agent" in system_msg or "Backend Agent" in system_msg or "Frontend Agent" in system_msg:
            content = f'I have written the code requested in the task:\n```\n// Simulated code output\n```'

        return ProviderResponse(
            content=content,
            model_id=model_id,
            tokens_in=10,
            tokens_out=20,
            latency_ms=1000,
            raw={},
        )

    async def stream(
        self,
        model_id: str,
        messages: list[ProviderMessage],
        temperature: float = 0.2,
        max_tokens: int = 2048,
    ) -> AsyncIterator[str]:
        resp = await self.complete(model_id, messages, temperature, max_tokens)
        words = resp.content.split(" ")
        for word in words:
            yield word + " "
            await asyncio.sleep(0.05)
