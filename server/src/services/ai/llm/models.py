from __future__ import annotations

import time
from typing import Any, Optional, Sequence, Tuple, Type, TypeVar, Union

from langchain_anthropic import ChatAnthropic
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI
from loguru import logger
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.services.ai.ai_clients_service import AIConfigurationError, AIProviderError
from src.services.ai.ai_runtime_config import AIRuntimeConfig, resolve_ai_runtime_config
from src.services.ai.llm.errors import map_llm_exception
from src.services.ai.observability import maybe_redact_for_logs

T = TypeVar("T", bound=BaseModel)

MessageLike = Union[str, Sequence[BaseMessage]]

_DEFAULT_TEMPERATURE = 0.2
_DEFAULT_TIMEOUT_SECONDS = 300.0
_OLLAMA_TIMEOUT_SECONDS = 1200.0
_DEFAULT_STRUCTURED_ATTEMPTS = 2


def build_chat_model(
    *,
    provider: str,
    model_id: str,
    base_url: str,
    api_key: Optional[str] = None,
) -> BaseChatModel:
    """Construct a LangChain chat model for a resolved provider config."""
    provider_key = provider.strip().lower()
    cleaned_base_url = base_url.rstrip("/")

    if provider_key == "openai":
        if not api_key:
            raise AIConfigurationError(
                "AI API key is missing. Please check your AI configuration settings."
            )
        return ChatOpenAI(
            model=model_id,
            api_key=api_key,
            base_url=cleaned_base_url,
            temperature=_DEFAULT_TEMPERATURE,
            timeout=_DEFAULT_TIMEOUT_SECONDS,
            max_retries=1,
        )

    if provider_key == "anthropic":
        if not api_key:
            raise AIConfigurationError(
                "AI API key is missing. Please check your AI configuration settings."
            )
        return ChatAnthropic(
            model=model_id,
            api_key=api_key,
            base_url=cleaned_base_url,
            temperature=_DEFAULT_TEMPERATURE,
            timeout=_DEFAULT_TIMEOUT_SECONDS,
            max_retries=1,
            max_tokens=4096,
        )

    if provider_key == "google":
        if not api_key:
            raise AIConfigurationError(
                "AI API key is missing. Please check your AI configuration settings."
            )
        return ChatGoogleGenerativeAI(
            model=model_id,
            google_api_key=api_key,
            base_url=cleaned_base_url,
            temperature=_DEFAULT_TEMPERATURE,
            timeout=_DEFAULT_TIMEOUT_SECONDS,
            max_retries=1,
        )

    if provider_key == "ollama":
        return ChatOllama(
            model=model_id,
            base_url=cleaned_base_url,
            temperature=_DEFAULT_TEMPERATURE,
            client_kwargs={"timeout": _OLLAMA_TIMEOUT_SECONDS},
        )

    raise AIConfigurationError(f"Unsupported AI provider: {provider}")


def build_chat_model_from_config(config: AIRuntimeConfig) -> BaseChatModel:
    return build_chat_model(
        provider=config.provider,
        model_id=config.model_id,
        base_url=config.base_url,
        api_key=config.api_key,
    )


async def get_chat_model(
    session: AsyncSession,
    user_id: str,
) -> Tuple[BaseChatModel, str, bool]:
    """Return ``(chat_model, model_id, is_platform_mode)``.

    Mirrors ``get_configured_ai_client``: same settings resolution and billing
    flag. Token deduction remains the caller's responsibility.
    """
    config = await resolve_ai_runtime_config(session, user_id)
    model = build_chat_model_from_config(config)
    return model, config.model_id, config.is_platform_mode


def _coerce_messages(prompt: MessageLike) -> list[BaseMessage]:
    if isinstance(prompt, str):
        return [HumanMessage(content=prompt)]
    return list(prompt)


async def ainvoke_structured(
    model: BaseChatModel,
    schema: Type[T],
    prompt: MessageLike,
    *,
    max_attempts: int = _DEFAULT_STRUCTURED_ATTEMPTS,
    **structured_output_kwargs: Any,
) -> T:
    """Invoke a chat model with structured output, one retry, and error mapping."""
    if max_attempts < 1:
        raise ValueError("max_attempts must be >= 1")

    runnable = model.with_structured_output(schema, **structured_output_kwargs)
    messages = _coerce_messages(prompt)
    last_error: Optional[BaseException] = None
    start = time.perf_counter()
    prompt_preview = maybe_redact_for_logs(prompt) if isinstance(prompt, str) else ""

    for attempt in range(1, max_attempts + 1):
        try:
            result = await runnable.ainvoke(messages)
            if isinstance(result, schema):
                logger.info(
                    "ai_structured {}",
                    {
                        "event": "ai_structured",
                        "schema": schema.__name__,
                        "status": "ok",
                        "attempt": attempt,
                        "latency_ms": round((time.perf_counter() - start) * 1000.0, 1),
                        **({"prompt_preview": prompt_preview} if prompt_preview else {}),
                    },
                )
                return result
            last_error = AIProviderError(
                "AI returned an unexpected structured response. Please try again."
            )
            logger.warning(
                "Structured LLM returned unexpected type {} on attempt {}",
                type(result).__name__,
                attempt,
            )
        except Exception as exc:
            last_error = exc
            logger.error(
                "Structured LLM invoke failed on attempt {}: {}",
                attempt,
                repr(exc),
            )
            if isinstance(exc, AIConfigurationError):
                raise
            if isinstance(exc, AIProviderError) and attempt >= max_attempts:
                raise

        if attempt < max_attempts:
            messages = [
                *messages,
                AIMessage(content="I could not produce valid structured output."),
                HumanMessage(
                    content=(
                        f"Your previous response was invalid or unusable "
                        f"({type(last_error).__name__}: {last_error}). "
                        f"Return a valid {schema.__name__} object that matches the schema exactly."
                    )
                ),
            ]

    assert last_error is not None
    map_llm_exception(last_error)
    raise AIProviderError("AI request failed. Please try again.") from last_error
