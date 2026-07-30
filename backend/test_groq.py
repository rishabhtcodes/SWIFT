import asyncio
import sys
import os
sys.path.insert(0, os.getcwd())

# Load .env
from dotenv import load_dotenv
load_dotenv(".env")

from app.ai.router.providers.groq_provider import GroqProvider
from app.ai.router.providers.base import ProviderMessage

async def test():
    key = os.environ.get("GROQ_API_KEY", "")
    print(f"GROQ_API_KEY starts with: {key[:10]}...")
    
    provider = GroqProvider(api_key=key)
    msgs = [
        ProviderMessage(role="user", content="Say hello in 5 words")
    ]
    try:
        resp = await provider.complete("llama-3.3-70b-versatile", msgs)
        print(f"SUCCESS: {resp.content}")
        return True
    except Exception as e:
        print(f"FAILED: {e}")
        return False

result = asyncio.run(test())
sys.exit(0 if result else 1)
