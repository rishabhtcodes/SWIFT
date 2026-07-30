from __future__ import annotations
import httpx

class WebSearchTool:
    async def search(self, query: str) -> dict:
        return {"status": "ok", "query": query, "results": [{"title": f"Result for {query}", "snippet": "Sample web result content."}]}
