import asyncio
import os
import sys
from unittest.mock import AsyncMock, MagicMock

import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.services.ai.ai_clients_service import AIConfigurationError, AIProviderError
from src.services.ai.llm.schemas import SmokeStructuredResult
from src.services.ai.llm.models import ainvoke_structured, build_chat_model
from src.services.ai.llm.errors import map_llm_exception
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI
from openai import AuthenticationError as OpenAIAuthenticationError


def test_build_chat_model_openai():
    model = build_chat_model(
        provider="openai",
        model_id="gpt-4o",
        base_url="https://api.openai.com/v1",
        api_key="sk-test",
    )
    assert isinstance(model, ChatOpenAI)


def test_build_chat_model_anthropic():
    model = build_chat_model(
        provider="anthropic",
        model_id="claude-sonnet-4-6",
        base_url="https://api.anthropic.com",
        api_key="sk-ant-test",
    )
    assert isinstance(model, ChatAnthropic)


def test_build_chat_model_google():
    model = build_chat_model(
        provider="google",
        model_id="gemini-1.5-pro",
        base_url="https://generativelanguage.googleapis.com",
        api_key="google-test-key",
    )
    assert isinstance(model, ChatGoogleGenerativeAI)


def test_build_chat_model_ollama_without_api_key():
    model = build_chat_model(
        provider="ollama",
        model_id="llama3.1",
        base_url="http://localhost:11434",
    )
    assert isinstance(model, ChatOllama)


def test_build_chat_model_requires_api_key_for_openai():
    with pytest.raises(AIConfigurationError):
        build_chat_model(
            provider="openai",
            model_id="gpt-4o",
            base_url="https://api.openai.com/v1",
            api_key=None,
        )


def test_build_chat_model_rejects_unknown_provider():
    with pytest.raises(AIConfigurationError):
        build_chat_model(
            provider="unknown",
            model_id="x",
            base_url="http://localhost",
            api_key="k",
        )


def test_map_llm_exception_auth():
    exc = OpenAIAuthenticationError(
        message="Invalid API key",
        response=MagicMock(status_code=401, headers={}),
        body=None,
    )
    with pytest.raises(AIConfigurationError):
        map_llm_exception(exc)


def test_map_llm_exception_generic_provider():
    with pytest.raises(AIProviderError):
        map_llm_exception(RuntimeError("upstream exploded"))


def test_ainvoke_structured_round_trip_with_mock_model():
    mock_model = MagicMock()
    structured = MagicMock()
    structured.ainvoke = AsyncMock(
        return_value=SmokeStructuredResult(score=88.5, summary="strong match")
    )
    mock_model.with_structured_output.return_value = structured

    result = asyncio.run(
        ainvoke_structured(mock_model, SmokeStructuredResult, "score this resume")
    )

    assert result.score == 88.5
    assert result.summary == "strong match"
    mock_model.with_structured_output.assert_called_once_with(SmokeStructuredResult)
    structured.ainvoke.assert_awaited_once()


def test_ainvoke_structured_maps_provider_errors():
    mock_model = MagicMock()
    structured = MagicMock()
    structured.ainvoke = AsyncMock(side_effect=RuntimeError("connection reset"))
    mock_model.with_structured_output.return_value = structured

    with pytest.raises(AIProviderError):
        asyncio.run(
            ainvoke_structured(
                mock_model, SmokeStructuredResult, "score this resume", max_attempts=1
            )
        )
