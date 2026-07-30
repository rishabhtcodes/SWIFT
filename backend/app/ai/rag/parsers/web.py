from __future__ import annotations
import httpx
from bs4 import BeautifulSoup

async def parse_url(source: str) -> str:
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.get(str(source))
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        for s in soup(["script", "style"]):
            s.decompose()
        return soup.get_text(separator="\n", strip=True)
