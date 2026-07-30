from __future__ import annotations
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_session
from app.models.user import User
from app.schemas.model import ModelRegistryCreate, ModelRegistryUpdate, ModelRegistryOut
from app.ai.router.model_router import model_router

router = APIRouter()


@router.get("/", response_model=list[ModelRegistryOut])
async def list_models(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    return await model_router.list_models(session)


@router.post("/", response_model=ModelRegistryOut)
async def register_model(
    data: ModelRegistryCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    return await model_router.register_model(session, data)


@router.patch("/{model_id}", response_model=ModelRegistryOut)
async def update_model(
    model_id: UUID,
    data: ModelRegistryUpdate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    return await model_router.update_model(session, model_id, data)


@router.post("/{model_id}/health")
async def check_health(
    model_id: UUID,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    return await model_router.check_health(session, model_id)


@router.post("/route")
async def route_model(
    task: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    return await model_router.select_model(session, task_type=task)