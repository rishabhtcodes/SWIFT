import asyncio
from sqlalchemy import text
from app.core.database import async_session_factory

async def f():
    async with async_session_factory() as session:
        res = await session.execute(text('SELECT content FROM document_chunks WHERE document_id = :did LIMIT 5'), {"did": "96c2916c-ed31-4687-9fa8-5675c6504fe4"})
        print("Filtered:", res.fetchall())

asyncio.run(f())
