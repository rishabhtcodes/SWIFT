import asyncio
from app.core.database import engine, Base
import app.models  # load models

async def seed_models():
    from app.core.database import async_session_factory
    from sqlalchemy import select
    from app.models.model_registry import ModelRegistry
    
    async with async_session_factory() as session:
        result = await session.execute(select(ModelRegistry))
        if len(result.scalars().all()) == 0:
            print("Seeding default models...")
            models = [
                ModelRegistry(provider="groq", model_id="llama-3.3-70b-versatile", display_name="Llama 3.3", capabilities=["reasoning", "general", "coding", "planning"], priority=10),
                ModelRegistry(provider="groq", model_id="llama-3.1-8b-instant", display_name="Llama 3.1 8B", capabilities=["general", "coding"], priority=8),
                ModelRegistry(provider="google", model_id="gemini-1.5-flash", display_name="Gemini 1.5 Flash", capabilities=["general", "coding", "planning", "vision"], priority=5),
            ]
            session.add_all(models)
            await session.commit()
            print("Default models seeded successfully!")

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created successfully!")
    await seed_models()

if __name__ == "__main__":
    asyncio.run(init_db())
