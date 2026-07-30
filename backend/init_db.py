import asyncio
from app.core.database import engine, Base
import app.models  # load models

async def seed_models():
    from app.core.database import async_session_factory
    from sqlalchemy import select, delete
    from app.models.model_registry import ModelRegistry

    async with async_session_factory() as session:
        # Clear existing to ensure fresh comprehensive seeding
        await session.execute(delete(ModelRegistry))
        await session.commit()

        print("Seeding comprehensive default model registry...")
        models = [
            # DashScope / Qwen
            ModelRegistry(
                provider="qwen",
                model_id="qwen3.7-plus",
                display_name="Qwen 3.7 Plus",
                capabilities=["reasoning", "coding", "planning", "rag", "general", "translation", "document"],
                context_window=128000,
                input_cost_per_1m=0.40,
                output_cost_per_1m=1.20,
                priority=15,
                health_status="healthy",
            ),
            ModelRegistry(
                provider="qwen",
                model_id="qwen-vl-plus",
                display_name="Qwen VL Plus",
                capabilities=["vision", "general", "document"],
                context_window=64000,
                input_cost_per_1m=0.50,
                output_cost_per_1m=1.50,
                priority=12,
                health_status="healthy",
            ),
            # Groq
            ModelRegistry(
                provider="groq",
                model_id="llama-3.3-70b-versatile",
                display_name="Llama 3.3 70B",
                capabilities=["reasoning", "coding", "planning", "general"],
                context_window=128000,
                input_cost_per_1m=0.59,
                output_cost_per_1m=0.79,
                priority=10,
                health_status="healthy",
            ),
            ModelRegistry(
                provider="groq",
                model_id="llama-3.1-8b-instant",
                display_name="Llama 3.1 8B Instant",
                capabilities=["general", "coding"],
                context_window=131072,
                input_cost_per_1m=0.05,
                output_cost_per_1m=0.08,
                priority=8,
                health_status="healthy",
            ),
            # Google Gemini
            ModelRegistry(
                provider="google",
                model_id="gemini-2.0-flash",
                display_name="Gemini 2.0 Flash",
                capabilities=["reasoning", "vision", "coding", "planning", "general", "document"],
                context_window=1048576,
                input_cost_per_1m=0.10,
                output_cost_per_1m=0.40,
                priority=14,
                health_status="healthy",
            ),
            ModelRegistry(
                provider="google",
                model_id="gemini-1.5-pro",
                display_name="Gemini 1.5 Pro",
                capabilities=["reasoning", "vision", "document", "rag", "planning"],
                context_window=2097152,
                input_cost_per_1m=1.25,
                output_cost_per_1m=5.00,
                priority=11,
                health_status="healthy",
            ),
            # DeepSeek
            ModelRegistry(
                provider="deepseek",
                model_id="deepseek-chat",
                display_name="DeepSeek V3",
                capabilities=["reasoning", "coding", "general"],
                context_window=64000,
                input_cost_per_1m=0.14,
                output_cost_per_1m=0.28,
                priority=13,
                health_status="healthy",
            ),
            # Ollama (Local)
            ModelRegistry(
                provider="ollama",
                model_id="llama3.2",
                display_name="Ollama Llama 3.2 (Local)",
                capabilities=["general", "coding"],
                context_window=32768,
                input_cost_per_1m=0.0,
                output_cost_per_1m=0.0,
                priority=4,
                health_status="offline",
            ),
        ]
        session.add_all(models)
        await session.commit()
        print("Comprehensive models seeded successfully!")

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created successfully!")
    await seed_models()

if __name__ == "__main__":
    asyncio.run(init_db())
