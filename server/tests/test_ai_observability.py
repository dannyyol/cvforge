import os
import sys
from unittest.mock import MagicMock, patch

import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.services.ai.observability import (
    PRODUCT_ACTIONS,
    configure_ai_observability,
    get_product_action_cost,
    maybe_redact_for_logs,
    redact_pii,
)


def test_get_product_action_cost_maps_all_actions():
    for action in PRODUCT_ACTIONS:
        cost = get_product_action_cost(action)
        assert isinstance(cost, int)
        assert cost > 0


def test_get_product_action_cost_unknown():
    with pytest.raises(ValueError):
        get_product_action_cost("not_a_real_action")


def test_redact_pii_email_and_phone():
    text = "Contact Jane at jane.doe@example.com or +1 555-123-4567 for details."
    redacted = redact_pii(text)
    assert "jane.doe@example.com" not in redacted
    assert "[REDACTED_EMAIL]" in redacted
    assert "[REDACTED_PHONE]" in redacted


def test_redact_pii_urls():
    text = "Portfolio https://example.com/resume?token=secret"
    assert "[REDACTED_URL]" in redact_pii(text)


def test_maybe_redact_for_logs_omits_when_prompts_disabled():
    settings = MagicMock(AI_LOG_PROMPTS=False, DEBUG=True)
    with patch("src.services.ai.observability.get_settings", return_value=settings):
        out = maybe_redact_for_logs("secret resume text " * 20)
    assert "omitted" in out
    assert "secret resume" not in out


def test_maybe_redact_for_logs_redacts_when_enabled():
    settings = MagicMock(AI_LOG_PROMPTS=True, DEBUG=False)
    with patch("src.services.ai.observability.get_settings", return_value=settings):
        out = maybe_redact_for_logs("Email me at person@cvrise.test please")
    assert "[REDACTED_EMAIL]" in out
    assert "person@cvrise.test" not in out


def test_configure_ai_observability_enables_langsmith():
    settings = MagicMock(
        LANGSMITH_TRACING=True,
        LANGSMITH_API_KEY="ls-test-key",
        LANGSMITH_PROJECT="cvrise-test",
        LANGSMITH_ENDPOINT=None,
        DEBUG=False,
    )
    with patch("src.services.ai.observability.get_settings", return_value=settings):
        status = configure_ai_observability()
    assert status["langsmith_tracing"] is True
    assert status["hide_inputs"] is True
    assert os.environ.get("LANGSMITH_TRACING") == "true"
    assert os.environ.get("LANGSMITH_API_KEY") == "ls-test-key"
    assert os.environ.get("LANGSMITH_PROJECT") == "cvrise-test"
    assert os.environ.get("LANGSMITH_HIDE_INPUTS") == "true"


def test_configure_ai_observability_disabled_by_default_path():
    settings = MagicMock(
        LANGSMITH_TRACING=False,
        LANGSMITH_API_KEY=None,
        LANGSMITH_PROJECT="cvrise",
        LANGSMITH_ENDPOINT=None,
        DEBUG=True,
    )
    with patch("src.services.ai.observability.get_settings", return_value=settings):
        status = configure_ai_observability()
    assert status["langsmith_tracing"] is False
    assert os.environ.get("LANGSMITH_TRACING") == "false"
