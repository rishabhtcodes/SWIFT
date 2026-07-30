import asyncio
from app.core.database import async_session_factory
from sqlalchemy import select
from app.models.model_registry import ModelRegistry

async def fix_gemini():
    async with async_session_factory() as session:
        result = await session.execute(select(ModelRegistry))
        models = result.scalars().all()
        for m in models:
            if m.model_id == "gemini-2.5-flash":
                m.model_id = "gemini-1.5-flash"
                m.display_name = "Gemini 1.5 Flash"
        await session.commit()
        print("Gemini model updated!")

if __name__ == "__main__":
    asyncio.run(fix_gemini())
