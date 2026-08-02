import asyncio
import os
import sys
from unittest.mock import AsyncMock, MagicMock

import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.services.ai.ai_clients_service import AIConfigurationError, AIProviderError
from src.services.ai.llm.models import ainvoke_structured
from src.services.ai.llm.schemas import (
    JobMatchResult,
    JobMatchSuggestion,
    ParsedResumeData,
    SectionReview,
    SmokeStructuredResult,
    TailorActionsPlan,
    UpdateSummaryAction,
)
from src.services.ai.ai_resume_parser_service import AIResumeParser
from src.services.resumes.job_match_service import JobMatchService
from src.services.resumes.review_service import ContentAnalyzer, SectionAnalyzer


def _mock_structured_model(return_value=None, side_effect=None, side_effects=None):
    mock_model = MagicMock()
    structured = MagicMock()
    if side_effects is not None:
        structured.ainvoke = AsyncMock(side_effect=side_effects)
    elif side_effect is not None:
        structured.ainvoke = AsyncMock(side_effect=side_effect)
    else:
        structured.ainvoke = AsyncMock(return_value=return_value)
    mock_model.with_structured_output.return_value = structured
    return mock_model, structured


def test_job_match_result_clamps_and_filters():
    result = JobMatchResult(
        match_score=150,
        summary="  Good fit  ",
        matched_keywords=["Python", " ", "FastAPI"],
        missing_keywords=["Kubernetes"],
        suggestions=[
            JobMatchSuggestion(section="Skills", suggestion="Add FastAPI", priority="HIGH"),
            JobMatchSuggestion(section="", suggestion="skip", priority="low"),
        ],
    )
    data = result.to_analyse_dict()
    assert data["match_score"] == 100.0
    assert data["summary"] == "Good fit"
    assert data["matched_keywords"] == ["Python", "FastAPI"]
    assert data["suggestions"] == [
        {"section": "Skills", "suggestion": "Add FastAPI", "priority": "high"}
    ]


def test_job_match_service_uses_structured_output():
    payload = JobMatchResult(
        match_score=82,
        summary="Solid match",
        matched_keywords=["Python"],
        missing_keywords=["Go"],
        suggestions=[
            JobMatchSuggestion(section="Skills", suggestion="Mention Go", priority="medium")
        ],
    )
    mock_model, structured = _mock_structured_model(return_value=payload)

    data = asyncio.run(
        JobMatchService(mock_model).analyse("Engineer", "Need Python", "Python developer")
    )

    assert data["match_score"] == 82.0
    assert data["missing_keywords"] == ["Go"]
    mock_model.with_structured_output.assert_called_once_with(JobMatchResult)
    structured.ainvoke.assert_awaited_once()


def test_resume_parser_uses_structured_output_and_fills_ids():
    parsed = ParsedResumeData(
        workExperiences=[{"company": "Acme", "position": "Eng", "id": ""}],  # type: ignore[arg-type]
        skills=[{"name": "Languages", "items": ["Python"]}],  # type: ignore[arg-type]
    )
    mock_model, _ = _mock_structured_model(return_value=parsed)

    data = asyncio.run(AIResumeParser.parse_with_model("Jane Doe\nPython", mock_model))

    assert data["workExperiences"][0]["company"] == "Acme"
    assert data["workExperiences"][0]["id"]
    assert data["skills"][0]["items"] == ["Python"]


def test_ainvoke_structured_retries_then_succeeds():
    good = SmokeStructuredResult(score=70, summary="ok")
    mock_model, structured = _mock_structured_model(
        side_effects=[RuntimeError("bad json"), good]
    )

    result = asyncio.run(
        ainvoke_structured(mock_model, SmokeStructuredResult, "score this", max_attempts=2)
    )

    assert result.summary == "ok"
    assert structured.ainvoke.await_count == 2


def test_ainvoke_structured_retries_then_fails():
    mock_model, structured = _mock_structured_model(
        side_effects=[RuntimeError("bad json"), RuntimeError("still bad")]
    )

    with pytest.raises(AIProviderError):
        asyncio.run(
            ainvoke_structured(mock_model, SmokeStructuredResult, "score this", max_attempts=2)
        )

    assert structured.ainvoke.await_count == 2


def test_section_analyzer_reraises_ai_provider_error():
    mock_model, _ = _mock_structured_model(side_effect=AIProviderError("down"))
    analyzer = SectionAnalyzer(mock_model)
    with pytest.raises(AIProviderError):
        asyncio.run(analyzer.analyze_section("Summary", "text", "model"))


def test_content_analyzer_reraises_ai_configuration_error():
    mock_model, _ = _mock_structured_model(side_effect=AIConfigurationError("bad key"))
    analyzer = ContentAnalyzer(mock_model)
    with pytest.raises(AIConfigurationError):
        asyncio.run(analyzer.analyze_resume_content("text", "model"))


def test_section_review_and_tailor_plan_schemas():
    section = SectionReview(name="Skills", score=-5, strengths=["clear"], suggestions=["add metrics"])
    assert section.to_analyse_dict("Skills")["score"] == 0.0

    plan = TailorActionsPlan(
        actions=[UpdateSummaryAction(type="update_summary", content="Improved summary")]
    )
    assert plan.to_action_dicts() == [
        {"type": "update_summary", "content": "Improved summary"}
    ]
    # OpenAI json_schema rejects oneOf; keep the plan schema flat.
    import json

    assert "oneOf" not in json.dumps(TailorActionsPlan.model_json_schema())
