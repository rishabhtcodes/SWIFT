import asyncio
import sys
import os
import httpx
sys.path.insert(0, os.getcwd())

from dotenv import load_dotenv
load_dotenv(".env")

async def get_models():
    key = os.environ.get("GROQ_API_KEY", "")
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.get(
            "https://api.groq.com/openai/v1/models",
            headers={"Authorization": f"Bearer {key}"},
        )
        data = resp.json()
        print([m['id'] for m in data['data']])

asyncio.run(get_models())
