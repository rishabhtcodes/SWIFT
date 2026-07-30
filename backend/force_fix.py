import asyncio
from sqlalchemy import select, update
from app.core.database import async_session_factory
from app.models.model_registry import ModelRegistry

async def fix():
    async with async_session_factory() as session:
        # Check current models
        res = await session.execute(select(ModelRegistry))
        for m in res.scalars().all():
            print(m.model_id, m.provider, m.priority)
            
        # FORCE UPDATE any gemini-2.5-flash to gemini-1.5-flash
        await session.execute(
            update(ModelRegistry)
            .where(ModelRegistry.model_id == "gemini-2.5-flash")
            .values(model_id="gemini-1.5-flash", display_name="Gemini 1.5 Flash")
        )
        await session.commit()
        
        # Check again
        res = await session.execute(select(ModelRegistry))
        for m in res.scalars().all():
            print(m.model_id, m.provider, m.priority)

asyncio.run(fix())
