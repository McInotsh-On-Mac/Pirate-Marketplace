from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path
from typing import List

from dotenv import load_dotenv


load_dotenv(Path(__file__).resolve().parents[1] / ".env")


def _split_csv(value: str) -> List[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings:
    def __init__(self) -> None:
        self.app_name = os.getenv("APP_NAME", "Pirate Marketplace API")
        self.api_prefix = os.getenv("API_PREFIX", "/api")
        self.frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
        self.cors_origins = _split_csv(
            os.getenv("CORS_ORIGINS", self.frontend_origin)
        )
        self.auth_provider = os.getenv("AUTH_PROVIDER", "supabase").strip().lower()
        self.supabase_url = os.getenv(
            "SUPABASE_URL",
            os.getenv("DB_API_URL", "https://avebyhsqudvbdaoubttc.supabase.co"),
        ).rstrip("/")
        self.db_api_url = os.getenv("DB_API_URL", self.supabase_url).rstrip("/")
        self.db_login_path = os.getenv("DB_LOGIN_PATH", "/auth/login").strip()
        self.db_api_key = os.getenv("DB_API_KEY")
        self.db_api_key_header = os.getenv("DB_API_KEY_HEADER", "x-api-key")
        self.db_bearer_token = os.getenv("DB_BEARER_TOKEN")
        self.db_email_field = os.getenv("DB_EMAIL_FIELD", "email")
        self.db_password_field = os.getenv("DB_PASSWORD_FIELD", "password")
        self.request_timeout_seconds = float(
            os.getenv("REQUEST_TIMEOUT_SECONDS", "10")
        )
        self.supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")

    @property
    def login_url(self) -> str:
        if self.auth_provider == "supabase":
            if not self.supabase_url:
                return ""
            return f"{self.supabase_url}/auth/v1/token?grant_type=password"

        if not self.db_api_url:
            return ""

        path = self.db_login_path if self.db_login_path.startswith("/") else f"/{self.db_login_path}"
        return f"{self.db_api_url}{path}"


@lru_cache
def get_settings() -> Settings:
    return Settings()
