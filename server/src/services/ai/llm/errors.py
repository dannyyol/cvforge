from __future__ import annotations

from typing import Optional

from openai import APIConnectionError as OpenAIAPIConnectionError
from openai import APIStatusError as OpenAIAPIStatusError
from openai import AuthenticationError as OpenAIAuthenticationError

from src.services.ai.ai_clients_service import AIConfigurationError, AIProviderError

try:
    from anthropic import APIConnectionError as AnthropicAPIConnectionError
    from anthropic import APIStatusError as AnthropicAPIStatusError
    from anthropic import AuthenticationError as AnthropicAuthenticationError
except ImportError:  # pragma: no cover
    AnthropicAPIConnectionError = ()  # type: ignore[misc, assignment]
    AnthropicAPIStatusError = ()  # type: ignore[misc, assignment]
    AnthropicAuthenticationError = ()  # type: ignore[misc, assignment]


def map_llm_exception(exc: BaseException) -> None:
    """Re-raise provider SDK / LangChain errors as CVRise AI errors.

    Callers should ``try`` / ``except`` around model invokes and call this
    in the ``except`` body (it always raises).
    """
    if isinstance(exc, (AIConfigurationError, AIProviderError)):
        raise exc

    if isinstance(exc, (OpenAIAuthenticationError, AnthropicAuthenticationError)):
        raise AIConfigurationError(
            "AI authentication failed. Please check your AI API key in Settings."
        ) from exc

    status_code: Optional[int] = None
    if isinstance(exc, OpenAIAPIStatusError):
        status_code = getattr(exc, "status_code", None)
    elif isinstance(exc, AnthropicAPIStatusError):
        status_code = getattr(exc, "status_code", None)

    if status_code in {401, 403}:
        raise AIConfigurationError(
            "AI authentication failed. Please check your AI API key in Settings."
        ) from exc

    if isinstance(exc, (OpenAIAPIConnectionError, AnthropicAPIConnectionError)):
        raise AIProviderError(
            "AI provider connection failed. Please check your AI configuration and try again."
        ) from exc

    message = str(exc).lower()
    if "authentication" in message or "unauthorized" in message or "invalid api key" in message:
        raise AIConfigurationError(
            "AI authentication failed. Please check your AI API key in Settings."
        ) from exc

    if "connection" in message or "connect" in message or "timeout" in message:
        raise AIProviderError(
            "AI provider connection failed. Please check your AI configuration and try again."
        ) from exc

    if "base url" in message or "invalid url" in message:
        raise AIConfigurationError(
            "Invalid AI Base URL. Please check your AI configuration settings."
        ) from exc

    raise AIProviderError("AI request failed. Please try again.") from exc
