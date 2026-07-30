from __future__ import annotations
import numpy as np

class Embedder:
    async def embed(self, text: str) -> list[float]:
        # Return a zero/pseudo 1536-dim vector for demonstration or embedding generation
        np.random.seed(abs(hash(text)) % (2**32))
        return np.random.uniform(-0.1, 0.1, size=1536).tolist()

    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        return [await self.embed(t) for t in texts]

embedder = Embedder()
