import asyncio
import os
import sys
from unittest.mock import AsyncMock, MagicMock

import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.services.ai.ai_clients_service import AIConfigurationError, AIProviderError
from src.services.resumes.review_service import ContentAnalyzer, SectionAnalyzer


def _failing_model(exc: Exception):
    model = MagicMock()
    structured = MagicMock()
    structured.ainvoke = AsyncMock(side_effect=exc)
    model.with_structured_output.return_value = structured
    return model


def test_section_analyzer_reraises_ai_provider_error():
    analyzer = SectionAnalyzer(_failing_model(AIProviderError("down")))
    with pytest.raises(AIProviderError):
        asyncio.run(analyzer.analyze_section("Summary", "text", "model"))


def test_content_analyzer_reraises_ai_configuration_error():
    analyzer = ContentAnalyzer(_failing_model(AIConfigurationError("bad key")))
    with pytest.raises(AIConfigurationError):
        asyncio.run(analyzer.analyze_resume_content("text", "model"))
