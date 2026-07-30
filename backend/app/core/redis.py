from __future__ import annotations
import json
from typing import Any

import redis.asyncio as aioredis

from app.core.config import settings


class RedisClient:
    def __init__(self):
        self._client: aioredis.Redis | None = None
        self._memory_store: dict[str, Any] = {}

    async def initialize(self) -> None:
        try:
            self._client = aioredis.from_url(settings.redis_url, decode_responses=True)
            await self._client.ping()
        except Exception:
            self._client = None

    async def close(self) -> None:
        if self._client:
            await self._client.aclose()

    async def get(self, key: str) -> Any | None:
        if not self._client:
            return self._memory_store.get(key)
        try:
            val = await self._client.get(key)
            if val is None:
                return None
            return json.loads(val)
        except Exception:
            return self._memory_store.get(key)

    async def set(self, key: str, value: Any, ttl: int = 300) -> None:
        self._memory_store[key] = value
        if self._client:
            try:
                await self._client.set(key, json.dumps(value), ex=ttl)
            except Exception:
                pass

    async def delete(self, key: str) -> None:
        await self._c().delete(key)

    async def exists(self, key: str) -> bool:
        return bool(await self._c().exists(key))

    async def publish(self, channel: str, message: Any) -> None:
        await self._c().publish(channel, json.dumps(message))


redis_client = RedisClient()
