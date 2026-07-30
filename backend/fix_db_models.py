import asyncio
from sqlalchemy import select, update, delete
from app.core.database import async_session_factory
from app.models.model_registry import ModelRegistry

async def fix():
    async with async_session_factory() as session:
        # Delete the deprecated models
        await session.execute(
            delete(ModelRegistry)
            .where(ModelRegistry.model_id.in_(["deepseek-r1-distill-llama-70b", "qwen-2.5-coder-32b"]))
        )
        
        # Ensure llama 3.3 has all capabilities
        await session.execute(
            update(ModelRegistry)
            .where(ModelRegistry.model_id == "llama-3.3-70b-versatile")
            .values(capabilities=["reasoning", "general", "coding", "planning"], priority=10)
        )
        await session.commit()
        print("Updated models in DB.")

asyncio.run(fix())
