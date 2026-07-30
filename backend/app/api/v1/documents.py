from __future__ import annotations
import shutil
import tempfile
from pathlib import Path

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_session, get_current_user
from app.models.user import User
from app.ai.rag.pipeline import rag_pipeline

router = APIRouter()

@router.get("/")
async def list_documents():
    return []

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    try:
        # Determine source type based on extension
        ext = Path(file.filename or "").suffix.lower()
        if ext == ".pdf":
            source_type = "pdf"
        elif ext in [".docx", ".doc"]:
            source_type = "docx"
        elif ext in [".pptx", ".ppt"]:
            source_type = "pptx"
        else:
            source_type = "code" # Fallback to code/text parser for txt, py, etc.

        # Save to temp file
        temp_dir = Path(tempfile.gettempdir()) / "swift_uploads"
        temp_dir.mkdir(parents=True, exist_ok=True)
        temp_path = temp_dir / (file.filename or "uploaded_file")
        
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Ingest into RAG pipeline
        doc = await rag_pipeline.ingest(
            session=session,
            user_id=user.id,
            project_id=None,
            source_type=source_type,
            source=temp_path,
            title=file.filename
        )
        
        return {"status": "success", "document_id": str(doc.id), "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
