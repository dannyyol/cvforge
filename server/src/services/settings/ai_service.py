from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from typing import Dict, Any, Tuple
from urllib.parse import urlsplit

from src.models.settings import Setting
from src.models.ai_model import AIModel
from src.api.schemas.ai_settings import AISettingsUpdate
from src.services.ai.ai_clients_service import (
    AsyncLLMClient, get_ai_client
)
from src.services.ai.ai_provider_registry_service import resolve_ai_base_url, resolve_ai_model_id
from src.services.ai.ai_runtime_config import resolve_ai_runtime_config

class AISettingsService:
    def __init__(self, session: AsyncSession, user_id: str):
        self.session = session
        self.user_id = user_id

    async def get_ai_settings(self) -> Dict[str, Any]:
        result = await self.session.execute(select(Setting).where(Setting.user_id == self.user_id, Setting.key == 'ai_config'))
        setting = result.scalar_one_or_none()
        if not setting:
            return {}
        return setting.value

    async def update_ai_settings(self, settings_data: AISettingsUpdate) -> Dict[str, Any]:
        active_model_id = settings_data.activeModelId
        
        model_result = await self.session.execute(select(AIModel).where(AIModel.id == active_model_id))
        model = model_result.scalar_one_or_none()
        if not model:
             raise HTTPException(status_code=400, detail="Invalid Active Model ID")
             
        configs = settings_data.configs
        provider_config_model = configs.get(model.key_id)
        provider_config = provider_config_model.model_dump() if provider_config_model else {}
        validation_errors = {}
        
        result = await self.session.execute(select(Setting).where(Setting.user_id == self.user_id, Setting.key == 'ai_config'))
        existing_setting = result.scalar_one_or_none()
        if settings_data.usageMode == 'custom':
            base_url = resolve_ai_base_url(model.key_id, provider_config.get('baseUrl'))
            model_id = resolve_ai_model_id(model.key_id, provider_config.get('modelId'), model.id)
            api_key = str(provider_config.get('apiKey') or '').strip()

            if not base_url:
                validation_errors['baseUrl'] = "Base URL is required"
            else:
                parsed = urlsplit(base_url)
                if parsed.scheme.lower() not in {"http", "https"} or not parsed.netloc:
                    validation_errors['baseUrl'] = "Base URL must be a valid http(s) URL (e.g. https://api.openai.com/v1)"

            if not model_id:
                validation_errors['modelId'] = "Model ID is required"

            if model.key_id != 'ollama' and not api_key:
                validation_errors['apiKey'] = "API Key is required"
        
        if validation_errors:
            raise HTTPException(status_code=400, detail=validation_errors)

        value_to_store = settings_data.model_dump()
        
        if existing_setting:
            existing_setting.value = value_to_store
            await self.session.commit()
            await self.session.refresh(existing_setting)
            return existing_setting.value
        else:
            new_setting = Setting(user_id=self.user_id, key='ai_config', value=value_to_store)
            self.session.add(new_setting)
            await self.session.commit()
            await self.session.refresh(new_setting)
            return new_setting.value

async def get_configured_ai_client(session: AsyncSession, user_id: str) -> Tuple[AsyncLLMClient, str, bool]:
    """
    Returns (client, model_id, is_platform_mode)
    """
    config = await resolve_ai_runtime_config(session, user_id)
    client = get_ai_client(config.provider, config.base_url, config.api_key)
    return client, config.model_id, config.is_platform_mode
