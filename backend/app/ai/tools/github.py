from __future__ import annotations

class GitHubTool:
    async def invoke(self, action: str, params: dict | None = None) -> dict:
        return {"status": "ok", "action": action, "message": "GitHub operation complete"}
