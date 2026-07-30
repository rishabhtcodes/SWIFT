from __future__ import annotations
import os
import re
from pathlib import Path

from app.core.config import settings


class FileSystemTool:
    def __init__(self):
        self.root = Path(settings.workspace_root).resolve()
        self.root.mkdir(parents=True, exist_ok=True)

    def _safe_path(self, path: str) -> Path:
        p = (self.root / path).resolve()
        if not str(p).startswith(str(self.root)):
            raise PermissionError("Path escapes workspace")
        return p

    async def write_file(self, path: str, content: str) -> dict:
        p = self._safe_path(path)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content, encoding="utf-8")
        return {"status": "ok", "path": str(p), "bytes": len(content)}

    async def read_file(self, path: str) -> dict:
        p = self._safe_path(path)
        if not p.exists():
            return {"status": "error", "error": "not found"}
        return {"status": "ok", "content": p.read_text(encoding="utf-8")}

    async def search(self, pattern: str, path: str = ".") -> dict:
        p = self._safe_path(path)
        regex = re.compile(pattern)
        matches = []
        for root, _, files in os.walk(p):
            for f in files:
                fp = Path(root) / f
                try:
                    text = fp.read_text(encoding="utf-8", errors="ignore")
                    for i, line in enumerate(text.splitlines()):
                        if regex.search(line):
                            matches.append({"file": str(fp.relative_to(self.root)), "line": i + 1, "text": line})
                            if len(matches) >= 100:
                                return {"matches": matches}
                except Exception:
                    continue
        return {"matches": matches}