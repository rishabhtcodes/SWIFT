from __future__ import annotations
import re
from typing import Any


def chunk_text(text: str, chunk_size: int = 800, overlap: int = 100) -> list[dict[str, Any]]:
    """Sentence-aware chunker with overlap."""
    sentences = re.split(r"(?<=[.!?])\s+", text)
    chunks: list[dict[str, Any]] = []
    current: list[str] = []
    current_len = 0
    for sent in sentences:
        if current_len + len(sent) > chunk_size and current:
            chunks.append({"text": " ".join(current), "metadata": {}})
            # overlap
            overlap_sents = []
            overlap_len = 0
            for s in reversed(current):
                if overlap_len + len(s) > overlap:
                    break
                overlap_sents.insert(0, s)
                overlap_len += len(s)
            current = overlap_sents
            current_len = overlap_len
        current.append(sent)
        current_len += len(sent)
    if current:
        chunks.append({"text": " ".join(current), "metadata": {}})
    return chunks