from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

# Database URL — reads from environment / .env via settings
# For local dev: postgresql+asyncpg://swift:swift@localhost:5432/swift_ai_os
import os
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./swift_ai_os.db"
)

# Async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
)

# Session factory
async_session_factory = async_sessionmaker(engine, expire_on_commit=False)


# Declarative Base — all ORM models inherit from this
class Base(DeclarativeBase):
    pass