from __future__ import annotations
from pathlib import Path

async def parse_code(source: str | Path) -> str:
    p = Path(source)
    return p.read_text(encoding="utf-8", errors="ignore")
