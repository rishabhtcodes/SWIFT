import asyncio
import sys
import os
import httpx
sys.path.insert(0, os.getcwd())

# Load .env
from dotenv import load_dotenv
load_dotenv(".env")

async def test_ceo():
    key = os.environ.get("GROQ_API_KEY", "")
    
    # Exact payload for CEO agent
    payload = {
        "model": "deepseek-r1-distill-llama-70b",
        "messages": [
            {"role": "system", "content": "You are the CEO Agent..."},
            {"role": "user", "content": "Hi, what can you do?"}
        ],
        "temperature": 0.2,
        "max_tokens": 2048,
    }

    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {key}"},
            json=payload,
        )
        print(f"deepseek-r1 response: {resp.status_code} {resp.text}")

    # Test llama-3.3
    payload["model"] = "llama-3.3-70b-versatile"
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {key}"},
            json=payload,
        )
        print(f"llama-3.3 response: {resp.status_code} {resp.text}")

asyncio.run(test_ceo())
