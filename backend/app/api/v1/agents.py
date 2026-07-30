from __future__ import annotations
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_agents():
    return [
        {"name": "CEO", "status": "active", "role": "Orchestrator"},
        {"name": "Planner", "status": "active", "role": "Task Decomposition"},
        {"name": "Coding", "status": "active", "role": "Software Engineer"},
        {"name": "Research", "status": "active", "role": "Knowledge Retrieval"},
        {"name": "Memory", "status": "active", "role": "Memory Manager"},
    ]
