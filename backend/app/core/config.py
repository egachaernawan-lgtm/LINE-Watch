from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    env: str = "local"
    database_url: str = "postgresql+asyncpg://linewatch:linewatch@localhost:5432/linewatch"
    cors_origins: list[str] = ["http://localhost:3000"]

    # Auth: the Next.js server mints a short-lived HS256 JWT after Google Login.
    backend_jwt_secret: str = "dev-secret-change-me"
    allowed_emails: list[str] = Field(default_factory=list)
    admin_emails: list[str] = Field(default_factory=list)
    auth_disabled: bool = False  # local development only

    # Cloud Scheduler -> /internal/* (OIDC). Empty audience disables verification (local only).
    scheduler_audience: str = ""
    scheduler_service_account: str = ""
    internal_api_key: str = ""  # fallback for local testing of /internal/*

    # Gemini
    gemini_api_key: str = ""
    gemini_model: str = "gemini-3.8-flash"
    gemini_concurrency: int = 2
    # Free-tier keys allow roughly 10 requests/minute. Raise on a paid plan.
    gemini_requests_per_minute: int = 10
    # Articles analysed per ingest run; the rest are picked up by the next runs (newest first).
    gemini_max_per_run: int = 30

    # Ingestion
    fetch_timeout_s: float = 20.0
    fetch_concurrency: int = 8
    max_items_per_source: int = 40
    max_article_age_hours: int = 48  # only collect recently published items
    title_dedupe_hours: int = 48
    user_agent: str = "LINEWatchBot/1.0 (+media monitoring for LINE Indonesia)"

    # Google Workspace (service account JSON, path or raw JSON)
    google_service_account_json: str = ""
    sheets_spreadsheet_id: str = ""
    sheets_worksheet: str = "Articles"
    drive_reports_folder_id: str = ""

    # Email
    sendgrid_api_key: str = ""
    email_from: str = ""
    report_recipients: list[str] = Field(default_factory=list)

    frontend_url: str = "http://localhost:3000"
    timezone: str = "Asia/Jakarta"


@lru_cache
def get_settings() -> Settings:
    return Settings()
