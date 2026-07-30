from __future__ import annotations
from pathlib import Path
import pypdf

async def parse_pdf(source: str | Path) -> str:
    reader = pypdf.PdfReader(str(source))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text
