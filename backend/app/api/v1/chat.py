from __future__ import annotations
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_session
from app.models.user import User
from app.schemas.agent import ChatRequest, ChatResponse
from app.ai.agents.graph import orchestrator

router = APIRouter()


@router.post("/complete", response_model=ChatResponse)
async def chat_complete(
    req: ChatRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await orchestrator.run(
        user_id=user.id,
        project_id=req.project_id,
        user_message=req.message,
        session=session,
        image_base64=req.image_base64,
        document_id=req.document_id,
    )
    return ChatResponse(
        response=result.get("final_answer", ""),
        agent_trace=result.get("trace", []),
        tasks_created=result.get("tasks_created", 0),
        model_used=result.get("model_used"),
    )


@router.post("/stream")
async def chat_stream(
    req: ChatRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    from fastapi.responses import StreamingResponse

    async def event_generator():
        async for event in orchestrator.stream(
            user_id=user.id,
            project_id=req.project_id,
            user_message=req.message,
            session=session,
            image_base64=req.image_base64,
            document_id=req.document_id,
        ):
            yield f"data: {event}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")