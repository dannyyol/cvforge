"""LangGraph workflow for CV review."""

from __future__ import annotations

import operator
from dataclasses import dataclass
from typing import Annotated, Dict, List, Optional, TypedDict

from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.runnables import RunnableConfig
from langgraph.graph import END, START, StateGraph
from langgraph.types import Send
from loguru import logger

from src.services.ai.ai_clients_service import AIConfigurationError, AIProviderError
from src.services.ai.llm.models import ainvoke_structured
from src.services.ai.llm.schemas import ContentReview, SectionReview
from src.services.ai.observability import observe_node, timed_ai_action
from src.services.ai.workflows.review_merge import (
    empty_content_review,
    is_empty_review,
    merge_review_scores,
    soft_failed_section,
)
from src.config import settings


class ReviewState(TypedDict, total=False):
    payload: dict
    flat_sections: Dict[str, str]
    resume_text: str
    section_results: Annotated[List[dict], operator.add]
    content_review: dict
    result: dict


class SectionTaskState(TypedDict):
    section_name: str
    section_content: str


@dataclass
class ReviewDeps:
    chat_model: BaseChatModel


def _get_deps(config: RunnableConfig) -> ReviewDeps:
    deps = (config.get("configurable") or {}).get("deps")
    if not isinstance(deps, ReviewDeps):
        raise RuntimeError("CV review workflow missing deps in runnable config")
    return deps


@observe_node("review", "prepare_sections")
async def prepare_sections(state: ReviewState, config: RunnableConfig) -> dict:
    from src.services.resumes.review_service import ResumeProcessor

    payload = state.get("payload") or {}
    flat = ResumeProcessor.flatten_resume_sections(payload)
    resume_text = ResumeProcessor.build_resume_text_from_nested(payload)
    return {
        "flat_sections": flat,
        "resume_text": resume_text or "",
        "section_results": [],
        "content_review": {},
    }


def fan_out_analyses(state: ReviewState) -> List[Send]:
    flat = state.get("flat_sections") or {}
    sends: List[Send] = [
        Send(
            "analyze_section",
            {"section_name": name, "section_content": content},
        )
        for name, content in flat.items()
        if str(content).strip()
    ]
    if not sends:
        joined = "\n".join(str(v) for v in flat.values() if str(v).strip())
        sends.append(
            Send(
                "analyze_section",
                {"section_name": "Summary", "section_content": joined or "Empty resume"},
            )
        )
    sends.append(
        Send(
            "analyze_content",
            {
                "resume_text": state.get("resume_text") or "",
                "flat_sections": flat,
            },
        )
    )
    return sends


@observe_node("review", "analyze_section")
async def analyze_section(state: SectionTaskState, config: RunnableConfig) -> dict:
    """Fail-soft per section except configuration errors (bad API key, etc.)."""
    from src.services.resumes.review_service import PromptBuilder

    deps = _get_deps(config)
    name = str(state.get("section_name") or "Section").strip() or "Section"
    content = str(state.get("section_content") or "")
    try:
        prompt = PromptBuilder.compose_section_prompt(name, content)
        result = await ainvoke_structured(deps.chat_model, SectionReview, prompt)
        return {"section_results": [result.to_analyse_dict(fallback_name=name)]}
    except AIConfigurationError:
        raise
    except AIProviderError as exc:
        logger.warning("Section analysis provider error for '{}': {}", name, str(exc))
        return {
            "section_results": [
                soft_failed_section(name, "Section analysis failed due to AI provider error")
            ]
        }
    except Exception as exc:
        logger.warning("Section analysis failed for '{}': {}", name, str(exc))
        return {
            "section_results": [
                soft_failed_section(name, "Section analysis unavailable")
            ]
        }


@observe_node("review", "analyze_content")
async def analyze_content(state: ReviewState, config: RunnableConfig) -> dict:
    """Content pass: fail-hard on AI config/provider errors (matches prior behavior)."""
    from src.services.resumes.review_service import PromptBuilder

    deps = _get_deps(config)
    resume_text = str(state.get("resume_text") or "")
    try:
        prompt = PromptBuilder.compose_content_analysis_prompt(resume_text)
        result = await ainvoke_structured(deps.chat_model, ContentReview, prompt)
        return {"content_review": result.to_analyse_dict()}
    except (AIConfigurationError, AIProviderError):
        raise
    except Exception as exc:
        logger.warning("Combined content analysis failed: {}", str(exc))
        return {"content_review": empty_content_review()}


@observe_node("review", "merge_scores")
async def merge_scores(state: ReviewState, config: RunnableConfig) -> dict:
    result = merge_review_scores(
        section_results=list(state.get("section_results") or []),
        content_review=state.get("content_review") or empty_content_review(),
        flat_sections=state.get("flat_sections") or {},
    )
    if is_empty_review(result):
        raise ValueError("AI review returned empty response")
    return {"result": result}


def build_review_graph():
    graph = StateGraph(ReviewState)
    graph.add_node("prepare_sections", prepare_sections)
    graph.add_node("analyze_section", analyze_section)
    graph.add_node("analyze_content", analyze_content)
    graph.add_node("merge_scores", merge_scores)

    graph.add_edge(START, "prepare_sections")
    graph.add_conditional_edges("prepare_sections", fan_out_analyses)
    graph.add_edge("analyze_section", "merge_scores")
    graph.add_edge("analyze_content", "merge_scores")
    graph.add_edge("merge_scores", END)
    return graph.compile()


_REVIEW_GRAPH = None


def get_review_graph():
    global _REVIEW_GRAPH
    if _REVIEW_GRAPH is None:
        _REVIEW_GRAPH = build_review_graph()
    return _REVIEW_GRAPH


async def run_cv_review(
    *,
    chat_model: BaseChatModel,
    payload: dict,
    is_platform_mode: Optional[bool] = None,
) -> dict:
    graph = get_review_graph()
    async with timed_ai_action(
        "cv_review",
        is_platform_mode=is_platform_mode,
        cost=settings.COST_CV_REVIEW,
    ) as meta:
        meta["section_keys"] = list((payload or {}).keys())[:20]
        final_state = await graph.ainvoke(
            {"payload": payload},
            config={"configurable": {"deps": ReviewDeps(chat_model=chat_model)}},
        )
    result = final_state.get("result")
    if not isinstance(result, dict):
        raise ValueError("AI review returned empty response")
    return result
