import asyncio
import httpx
import os
import sys

async def test():
    async with httpx.AsyncClient(timeout=120) as client:
        print("Uploading doc...")
        with open("test_secret.txt", "rb") as f:
            res = await client.post("http://localhost:8000/api/v1/documents/upload", files={"file": ("test_secret.txt", f, "text/plain")}, headers={"Authorization": "Bearer testuser123"})
            data = res.json()
            doc_id = data.get("document_id")
            print("Doc ID:", doc_id)
        
        print("Sending chat...")
        async with client.stream("POST", "http://localhost:8000/api/v1/chat/stream", json={"message": "What is the secret word in the attached document?", "document_id": doc_id}) as res:
            async for line in res.aiter_lines():
                print(line)

asyncio.run(test())
