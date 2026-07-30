from __future__ import annotations
from pathlib import Path
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.rag.parsers.pdf import parse_pdf
from app.ai.rag.parsers.docx import parse_docx
from app.ai.rag.parsers.pptx import parse_pptx
from app.ai.rag.parsers.code import parse_code
from app.ai.rag.parsers.web import parse_url
from app.ai.rag.chunker import chunk_text
from app.ai.rag.embedder import embedder
from app.models.document import Document, DocumentChunk


PARSERS = {
    "pdf": parse_pdf,
    "docx": parse_docx,
    "pptx": parse_pptx,
    "code": parse_code,
    "url": parse_url,
}


class RAGPipeline:
    async def ingest(self, session: AsyncSession, user_id: UUID, project_id: UUID | None, source_type: str, source: str | Path, title: str | None = None) -> Document:
        parser = PARSERS.get(source_type)
        if not parser:
            raise ValueError(f"Unsupported source type: {source_type}")
        raw_text = await parser(source)
        chunks = chunk_text(raw_text, chunk_size=800, overlap=100)

        doc = Document(
            user_id=user_id,
            project_id=project_id,
            title=title or (source.name if isinstance(source, Path) else str(source)),
            source_type=source_type,
            source_url=str(source) if isinstance(source, Path) else source,
            chunk_count=len(chunks),
            status="processing",
        )
        session.add(doc)
        await session.flush()

        embeddings = await embedder.embed_batch([c["text"] for c in chunks])
        for i, (chunk, emb) in enumerate(zip(chunks, embeddings)):
            db_chunk = DocumentChunk(
                document_id=doc.id,
                chunk_index=i,
                content=chunk["text"],
                metadata_=chunk.get("metadata", {}),
            )
            session.add(db_chunk)
        doc.status = "ready"
        await session.flush()
        await session.refresh(doc)
        return doc

    async def query(self, session: AsyncSession, user_id: UUID, query: str, top_k: int = 5) -> list[dict]:
        q_emb = await embedder.embed(query)
        from sqlalchemy import text
        sql = text("""
            SELECT dc.id, dc.content, dc.metadata, d.title, d.source_type,
                   1 - (dc.embedding <=> :qe) AS score
            FROM document_chunks dc
            JOIN documents d ON d.id = dc.document_id
            WHERE d.user_id = :uid AND d.status = 'ready'
            ORDER BY dc.embedding <=> :qe
            LIMIT :k
        """)
        result = await session.execute(sql, {"qe": str(q_emb), "uid": str(user_id), "k": top_k})
        rows = result.fetchall()
        return [
            {"chunk_id": r[0], "content": r[1], "metadata": r[2], "source": r[3], "type": r[4], "score": float(r[5])}
            for r in rows
        ]


rag_pipeline = RAGPipeline()