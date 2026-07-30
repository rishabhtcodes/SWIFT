from __future__ import annotations
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # App
    app_name: str = "Swift AI OS"
    version: str = "0.1.0"
    debug: bool = False
    environment: str = "production"
    api_prefix: str = "/api/v1"
    allowed_origins: List[str] = Field(default_factory=lambda: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "*"])

    # Database
    database_url: str = "postgresql+asyncpg://swift:swift@localhost:5432/swift_ai_os"
    database_echo: bool = False

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Auth
    secret_key: str = "change-me-in-production-use-openssl-rand-hex-32"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    refresh_token_expire_days: int = 30

    # OAuth
    google_client_id: str = ""
    google_client_secret: str = ""
    github_client_id: str = ""
    github_client_secret: str = ""

    # AI
    default_embedding_model: str = "text-embedding-3-small"
    embedding_dimensions: int = 1536
    chroma_persist_dir: str = "./chroma_data"
    workspace_root: str = "./workspace"

    # Providers (keys injected via env)
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    google_api_key: str = ""
    deepseek_api_key: str = ""
    qwen_api_key: str = ""
    groq_api_key: str = ""
    mistral_api_key: str = ""

    # Safety
    max_tool_iterations: int = 25
    sandbox_enabled: bool = True


settings = Settings()