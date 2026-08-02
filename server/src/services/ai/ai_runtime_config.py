from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import get_settings
from src.models.ai_model import AIModel
from src.models.settings import Setting
from src.services.ai.ai_provider_registry_service import resolve_ai_base_url, resolve_ai_model_id


@dataclass(frozen=True)
class AIRuntimeConfig:
    """Resolved provider credentials for a user request.

    Billing / token deduction stays outside this layer; callers use
    ``is_platform_mode`` to decide whether to charge ``COST_*`` tokens.
    """

    provider: str
    model_id: str
    base_url: str
    api_key: Optional[str]
    is_platform_mode: bool


async def resolve_ai_runtime_config(session: AsyncSession, user_id: str) -> AIRuntimeConfig:
    """Resolve platform vs custom BYOK settings into a concrete runtime config."""
    stmt = select(Setting).where(Setting.user_id == user_id, Setting.key == "ai_config")
    result = await session.execute(stmt)
    setting = result.scalar_one_or_none()
    ai_settings = setting.value if setting else {}

    usage_mode = ai_settings.get("usageMode", "custom")

    if usage_mode == "platform":
        app_settings = get_settings()

        if not app_settings.PLATFORM_OPENAI_API_KEY:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Platform OpenAI API Key is not configured on the server. "
                    "Please contact support or switch to Custom mode."
                ),
            )

        return AIRuntimeConfig(
            provider="openai",
            model_id=app_settings.PLATFORM_OPENAI_MODEL,
            base_url="https://api.openai.com/v1",
            api_key=app_settings.PLATFORM_OPENAI_API_KEY,
            is_platform_mode=True,
        )

    active_model_id = ai_settings.get("activeModelId")
    if not active_model_id:
        raise HTTPException(
            status_code=400,
            detail="No active AI model selected. Please configure an AI model in Settings.",
        )

    stmt = select(AIModel).where(AIModel.id == active_model_id)
    result = await session.execute(stmt)
    active_model = result.scalar_one_or_none()

    if not active_model:
        raise HTTPException(status_code=400, detail="Invalid Active Model ID")

    provider = active_model.key_id
    configs = ai_settings.get("configs", {})
    provider_config = configs.get(provider, {})

    base_url = resolve_ai_base_url(provider, provider_config.get("baseUrl", ""))
    api_key = str(provider_config.get("apiKey", "") or "").strip() or None
    model_id = resolve_ai_model_id(provider, provider_config.get("modelId"), active_model.id)

    if not model_id:
        raise HTTPException(
            status_code=400,
            detail="No AI model configured. Please check your AI configuration settings.",
        )

    if not base_url:
        raise HTTPException(
            status_code=400,
            detail="AI Base URL is missing. Please check your AI configuration settings.",
        )

    if not (base_url.startswith("http://") or base_url.startswith("https://")):
        raise HTTPException(
            status_code=400,
            detail=(
                "AI Base URL must start with http:// or https://. "
                "Please check your AI configuration settings."
            ),
        )

    if provider != "ollama" and not api_key:
        raise HTTPException(
            status_code=400,
            detail="AI API key is missing. Please check your AI configuration settings.",
        )

    if provider not in {"openai", "anthropic", "google", "ollama"}:
        raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")

    return AIRuntimeConfig(
        provider=provider,
        model_id=model_id,
        base_url=base_url,
        api_key=api_key,
        is_platform_mode=False,
    )
