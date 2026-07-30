import asyncio
from sqlalchemy import select, update
from app.core.database import async_session_factory
from app.models.model_registry import ModelRegistry

async def fix():
    async with async_session_factory() as session:
        # Lower gemini priority to 5 so Groq gets picked
        await session.execute(
            update(ModelRegistry)
            .where(ModelRegistry.provider == "google")
            .values(priority=5)
        )
        await session.commit()
        print("Updated priorities. Groq is now the primary provider.")

asyncio.run(fix())
