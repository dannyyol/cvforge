from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


BASE_DIR = Path(__file__).resolve().parents[1]
ENV_FILE = BASE_DIR / ".env"
print(ENV_FILE)

class AppSettings(BaseSettings):
    APP_NAME: str = "CVForge API"
    APP_VERSION: str = "0.1.0"
    API_PREFIX: str = "/api"

    HOST: str = "127.0.0.1"
    PORT: int = 8000

    DEBUG: bool = True

    CORS_ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    @field_validator("CORS_ALLOWED_ORIGINS", mode="before")
    def _split_csv(cls, v):
        if isinstance(v, str):
            return [s.strip() for s in v.split(",") if s.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


@lru_cache(maxsize=1)
def get_settings() -> AppSettings:
    return AppSettings()