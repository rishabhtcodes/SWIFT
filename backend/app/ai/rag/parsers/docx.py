from __future__ import annotations
from pathlib import Path
import docx

async def parse_docx(source: str | Path) -> str:
    doc = docx.Document(str(source))
    return "\n".join(p.text for p in doc.paragraphs)
