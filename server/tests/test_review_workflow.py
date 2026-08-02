import asyncio
import os
import sys
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.services.ai.ai_clients_service import AIConfigurationError, AIProviderError
from src.services.ai.llm.schemas import ContentReview, ScoredSummaryBlock, SectionReview
from src.services.ai.workflows.review import (
    build_review_graph,
    fan_out_analyses,
    run_cv_review,
)
from src.services.ai.workflows.review_merge import (
    is_empty_review,
    merge_review_scores,
    weighted_section_score,
)
from src.services.resumes.review_service import ContentAnalyzer, SectionAnalyzer, create_cv_review_service


def test_weighted_section_score():
    score = weighted_section_score(
        [
            {"name": "Experience", "score": 80},
            {"name": "Skills", "score": 100},
        ]
    )
    # 80*0.35 + 100*0.20 = 28 + 20 = 48 / 0.55 ≈ 87.3
    assert score == 87.3


def test_merge_review_scores_applies_missing_section_penalty():
    result = merge_review_scores(
        section_results=[
            {
                "name": "Summary",
                "score": 90,
                "strengths": ["Clear"],
                "areas_to_improve": [],
                "suggestions": ["Keep it"],
            }
        ],
        content_review={
            "atsCompatibility": {"score": 80, "summary": ["ok"]},
            "contentQuality": {"score": 70, "summary": ["ok"]},
            "formattingAnalysis": {"score": 60, "summary": ["ok"]},
        },
        flat_sections={"Summary": "Hello"},  # missing Experience/Skills/Education
    )
    assert "atsCompatibility" in result
    assert result["overall_score"] < 90
    assert result["sections"][0]["name"] == "Summary"


def test_is_empty_review():
    assert is_empty_review(
        {
            "overall_score": 0,
            "strengths": [],
            "areas_to_improve": [],
            "sections": [{"name": "Summary", "score": 0, "suggestions": []}],
            "atsCompatibility": {"score": 0, "summary": []},
            "contentQuality": {"score": 0, "summary": []},
            "formattingAnalysis": {"score": 0, "summary": []},
        }
    )


def test_fan_out_analyses_sends_sections_and_content():
    sends = fan_out_analyses(
        {
            "flat_sections": {
                "Summary": "About me",
                "Experience": "Did work",
                "Empty": "   ",
            },
            "resume_text": "full text",
        }
    )
    targets = [s.node for s in sends]
    assert targets.count("analyze_section") == 2
    assert targets.count("analyze_content") == 1


def test_fan_out_analyses_fallback_when_no_content():
    sends = fan_out_analyses({"flat_sections": {}, "resume_text": ""})
    assert len(sends) == 2
    assert sends[0].node == "analyze_section"
    assert sends[0].arg["section_name"] == "Summary"
    assert sends[1].node == "analyze_content"


def test_review_graph_runs_sections_and_content_in_parallel():
    payload = {
        "sections": [{"type": "summary"}],
        "professionalSummary": {"content": "Engineer with Python experience"},
        "workExperiences": [
            {
                "position": "Engineer",
                "company": "Acme",
                "description": "Built APIs",
                "startDate": "2020-01",
                "endDate": "2022-01",
            }
        ],
        "skills": [{"name": "", "items": ["Python"]}],
    }

    content = ContentReview(
        atsCompatibility=ScoredSummaryBlock(score=80, summary=["Good headings"]),
        contentQuality=ScoredSummaryBlock(score=70, summary=["Decent"]),
        formattingAnalysis=ScoredSummaryBlock(score=60, summary=["Consistent"]),
    )

    async def _side_effect(model, schema, prompt, **kwargs):
        if schema is ContentReview:
            return content
        # Infer section name from prompt text
        for name in ("Summary", "Experience", "Skills"):
            if f"'{name}'" in str(prompt) or f"exactly '{name}'" in str(prompt):
                scores = {"Summary": 88, "Experience": 75, "Skills": 90}
                return SectionReview(
                    name=name,
                    score=scores[name],
                    strengths=["Clear"] if name == "Summary" else ["Relevant"],
                    areas_to_improve=[] if name != "Experience" else ["Impact"],
                    suggestions=["Add metrics"],
                )
        return SectionReview(
            name="Summary",
            score=70,
            strengths=["ok"],
            areas_to_improve=[],
            suggestions=["ok"],
        )

    with patch(
        "src.services.ai.workflows.review.ainvoke_structured",
        new=AsyncMock(side_effect=_side_effect),
    ):
        result = asyncio.run(run_cv_review(chat_model=MagicMock(), payload=payload))

    assert result["overall_score"] > 0
    assert len(result["sections"]) == 3
    assert result["atsCompatibility"]["score"] == 80
    assert "Clear" in result["strengths"] or "Relevant" in result["strengths"]


def test_review_graph_section_provider_error_is_fail_soft():
    payload = {
        "sections": [{"type": "summary"}],
        "professionalSummary": {"content": "Hello"},
    }

    content = ContentReview(
        atsCompatibility=ScoredSummaryBlock(score=50, summary=["ok"]),
        contentQuality=ScoredSummaryBlock(score=50, summary=["ok"]),
        formattingAnalysis=ScoredSummaryBlock(score=50, summary=["ok"]),
    )

    async def _side_effect(model, schema, prompt, **kwargs):
        if schema is SectionReview:
            raise AIProviderError("down")
        return content

    with patch(
        "src.services.ai.workflows.review.ainvoke_structured",
        new=AsyncMock(side_effect=_side_effect),
    ):
        result = asyncio.run(run_cv_review(chat_model=MagicMock(), payload=payload))

    assert result["sections"][0]["score"] == 0
    assert result["atsCompatibility"]["score"] == 50


def test_review_graph_content_provider_error_is_fail_hard():
    payload = {
        "sections": [{"type": "summary"}],
        "professionalSummary": {"content": "Hello"},
    }

    async def _side_effect(model, schema, prompt, **kwargs):
        if schema is ContentReview:
            raise AIProviderError("down")
        return SectionReview(
            name="Summary",
            score=80,
            strengths=["ok"],
            areas_to_improve=[],
            suggestions=["ok"],
        )

    with patch(
        "src.services.ai.workflows.review.ainvoke_structured",
        new=AsyncMock(side_effect=_side_effect),
    ):
        with pytest.raises(AIProviderError):
            asyncio.run(run_cv_review(chat_model=MagicMock(), payload=payload))


def test_create_cv_review_service_delegates_to_graph():
    service = create_cv_review_service(MagicMock(), "gpt-4o")
    with patch(
        "src.services.ai.workflows.review.run_cv_review",
        new=AsyncMock(return_value={"overall_score": 42}),
    ) as mocked:
        result = asyncio.run(service.review_cv_payload({"sections": [{"type": "summary"}]}))
    assert result["overall_score"] == 42
    mocked.assert_awaited_once()


def test_build_review_graph_nodes():
    graph = build_review_graph()
    assert set(graph.nodes.keys()) >= {
        "prepare_sections",
        "analyze_section",
        "analyze_content",
        "merge_scores",
    }


def test_section_analyzer_reraises_ai_configuration_error():
    model = MagicMock()
    structured = MagicMock()
    structured.ainvoke = AsyncMock(side_effect=AIConfigurationError("bad key"))
    model.with_structured_output.return_value = structured
    analyzer = SectionAnalyzer(model)
    with pytest.raises(AIConfigurationError):
        asyncio.run(analyzer.analyze_section("Summary", "text", "model"))


def test_content_analyzer_reraises_ai_provider_error():
    model = MagicMock()
    structured = MagicMock()
    structured.ainvoke = AsyncMock(side_effect=AIProviderError("down"))
    model.with_structured_output.return_value = structured
    analyzer = ContentAnalyzer(model)
    with pytest.raises(AIProviderError):
        asyncio.run(analyzer.analyze_resume_content("text", "model"))
