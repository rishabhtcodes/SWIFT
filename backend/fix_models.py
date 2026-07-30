import asyncio
from app.core.database import async_session_factory
from sqlalchemy import select
from app.models.model_registry import ModelRegistry

async def fix_models():
    async with async_session_factory() as session:
        result = await session.execute(select(ModelRegistry))
        models = result.scalars().all()
        for m in models:
            if m.display_name == "Gemini 2.5 Flash":
                m.provider = "google"
                m.model_id = "gemini-2.5-flash"
            elif m.display_name == "Llama 3.3":
                m.provider = "groq"
                m.model_id = "llama-3.3-70b-versatile"
            elif m.display_name == "DeepSeek R1":
                m.provider = "groq"
                m.model_id = "deepseek-r1-distill-llama-70b"
            elif m.display_name == "Qwen 3 Coder":
                m.provider = "groq"
                m.model_id = "qwen-2.5-coder-32b"
                
        await session.commit()
        print("Models updated to real providers!")

if __name__ == "__main__":
    asyncio.run(fix_models())
