from __future__ import annotations
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session_factory
from app.core.security import decode_token
from app.models.user import User

bearer_scheme = HTTPBearer(auto_error=False)


async def get_session() -> AsyncSession:
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    session: AsyncSession = Depends(get_session),
) -> User:
    from sqlalchemy import select
    # For local OS mode, auto-login or create a default user to bypass JWT
    result = await session.execute(select(User).limit(1))
    user = result.scalar_one_or_none()
    if not user:
        user = User(
            email="local@swift.os",
            hashed_password="local",
            full_name="Swift Local User",
            is_active=True
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
    return user