from __future__ import annotations
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password, verify_password, create_token
from app.models.user import User
from app.schemas.user import UserCreate, TokenResponse


class AuthService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def register(self, data: UserCreate) -> User:
        existing = await self.session.execute(select(User).where(User.email == data.email))
        if existing.scalar_one_or_none():
            raise ValueError("Email already registered")
        user = User(
            email=data.email,
            hashed_password=hash_password(data.password),
            full_name=data.full_name,
        )
        self.session.add(user)
        await self.session.flush()
        await self.session.refresh(user)
        return user

    async def login(self, email: str, password: str) -> TokenResponse:
        result = await self.session.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if not user or not user.hashed_password or not verify_password(password, user.hashed_password):
            raise ValueError("Invalid credentials")
        access = create_token(str(user.id), "access", {"role": user.role})
        refresh = create_token(str(user.id), "refresh")
        return TokenResponse(access_token=access, refresh_token=refresh, token_type="bearer")

    async def get_user(self, user_id: UUID) -> User | None:
        result = await self.session.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()