from functools import lru_cache
from typing import Any

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    project_name: str = "Abhishek Portfolio API"
    api_v1_str: str = "/api/v1"
    environment: str = "development"
    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 60 * 24
    backend_cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    postgres_user: str = "portfolio"
    postgres_password: str = "portfolio"
    postgres_db: str = "portfolio_db"
    database_url: str = "postgresql+psycopg2://portfolio:portfolio@db:5432/portfolio_db"

    admin_email: str = "admin@portfolio.com"
    admin_password: str = "admin123"
    admin_full_name: str = "Aggimalla Abhishek"

    github_username: str = "AggimallaAbhishek"

    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None
    smtp_from_email: str = "noreply@portfolio.com"
    smtp_to_email: str = "abhishek.aggimalla.dev@gmail.com"
    smtp_use_tls: bool = True

    uploads_dir: str = "uploads"

    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def assemble_cors_origins(cls, value: Any) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
