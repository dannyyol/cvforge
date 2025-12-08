from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


BASE_DIR = Path(__file__).resolve().parents[1]
ENV_FILE = BASE_DIR / ".env"

class AppSettings(BaseSettings):
    APP_NAME: str
    APP_VERSION: str
    API_PREFIX: str

    HOST: str
    PORT: int

    DEBUG: bool

    CORS_ALLOWED_ORIGINS: List[str]

    CLIENT_BASE_URL: str
    TOKEN_TTL_SECONDS: int = Field(default=300, env="TOKEN_TTL_SECONDS")

    @field_validator("CORS_ALLOWED_ORIGINS", mode="before")
    def _split_csv(cls, v):
        if isinstance(v, str):
            return [s.strip() for s in v.split(",") if s.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


@lru_cache(maxsize=1)
def get_settings() -> AppSettings:
    return AppSettings()
