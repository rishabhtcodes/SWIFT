from __future__ import annotations
import httpx
from bs4 import BeautifulSoup

class BrowserTool:
    async def read_url(self, url: str) -> dict:
        try:
            async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
                resp = await client.get(url)
                resp.raise_for_status()
                soup = BeautifulSoup(resp.text, "html.parser")
                for s in soup(["script", "style"]):
                    s.decompose()
                text = soup.get_text(separator="\n", strip=True)
                return {"status": "ok", "url": url, "content": text[:10000]}
        except Exception as e:
            return {"status": "error", "error": str(e)}
