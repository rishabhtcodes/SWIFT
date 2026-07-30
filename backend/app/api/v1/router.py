from fastapi import APIRouter

from app.api.v1 import auth, users, projects, agents, tasks, models, memory, documents, chat, stats, settings

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(models.router, prefix="/models", tags=["models"])
api_router.include_router(memory.router, prefix="/memory", tags=["memory"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])