from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Callable, Dict, List, Literal, Optional, TypedDict

from fastapi import HTTPException
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.runnables import RunnableConfig
from langgraph.graph import END, START, StateGraph
from loguru import logger
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.orm.attributes import flag_modified

from src.api.schemas.resume import ResumeResponse, TailorResumeRequest
from src.config import settings
from src.models.resume import Resume
from src.models.user import User
from src.services.ai.ai_clients_service import AIConfigurationError, AIProviderError
from src.services.ai.guardrails import GuardrailViolation, assess_tailor_action_quality, enforce_safe_user_inputs
from src.services.ai.llm.models import ainvoke_structured
from src.services.ai.llm.schemas import TailorActionsPlan
from src.services.ai.observability import observe_node, timed_ai_action
from src.services.ai.workflows.tailor_actions import (
    apply_tailor_actions,
    build_plan_actions_prompt,
    build_projects_context,
    build_work_experiences_context,
    validate_tailor_actions,
)
from src.services.settings.plan_service import PlanService
from src.utils.skills import collect_skill_item_names, normalize_skills

MAX_PLAN_RETRIES = 2


class TailorWorkflowError(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)


class TailorState(TypedDict, total=False):
    resume_id: str
    job_title: str
    job_description: str
    tone: str
    resume_text: str
    resume_data: dict
    job_match: dict
    actions: List[dict]
    validation_errors: List[str]
    retry_count: int
    is_platform_mode: bool
    cost: int
    result_resume: Optional[ResumeResponse]


@dataclass
class TailorDeps:
    db: AsyncSession
    user: User
    chat_model: BaseChatModel
    plan_service: PlanService
    compose_resume_text: Callable[[Resume], str]
    get_resume_by_id: Callable[[str], Any]


def _get_deps(config: RunnableConfig) -> TailorDeps:
    deps = (config.get("configurable") or {}).get("deps")
    if not isinstance(deps, TailorDeps):
        raise RuntimeError("Tailor workflow missing deps in runnable config")
    return deps


@observe_node("tailor", "input_guardrails")
async def input_guardrails(state: TailorState, config: RunnableConfig) -> dict:
    try:
        enforce_safe_user_inputs(state.get("job_title"), state.get("job_description"))
    except GuardrailViolation as exc:
        raise TailorWorkflowError(400, exc.detail) from exc
    return {}


@observe_node("tailor", "load_resume")
async def load_resume(state: TailorState, config: RunnableConfig) -> dict:
    deps = _get_deps(config)
    stmt = (
        select(Resume)
        .where(Resume.id == state["resume_id"], Resume.user_id == deps.user.id)
        .options(
            selectinload(Resume.template),
            selectinload(Resume.theme),
            selectinload(Resume.cover_letters),
        )
    )
    result = await deps.db.execute(stmt)
    resume = result.scalar_one_or_none()
    if not resume:
        raise TailorWorkflowError(404, "Resume not found")

    resume_data = resume.resume_data or {}
    if not isinstance(resume_data, dict):
        resume_data = {}

    return {
        "resume_text": deps.compose_resume_text(resume),
        "resume_data": resume_data,
    }


@observe_node("tailor", "check_balance")
async def check_balance(state: TailorState, config: RunnableConfig) -> dict:
    deps = _get_deps(config)
    cost = int(state.get("cost") or settings.COST_TAILOR_RESUME)
    is_platform_mode = bool(state.get("is_platform_mode"))
    if is_platform_mode and not await deps.plan_service.has_sufficient_balance(cost):
        raise TailorWorkflowError(
            402,
            f"Insufficient tokens. This action requires at least {cost} tokens.",
        )
    return {"cost": cost}


@observe_node("tailor", "job_match")
async def job_match(state: TailorState, config: RunnableConfig) -> dict:
    from src.services.resumes.job_match_service import JobMatchService

    deps = _get_deps(config)
    try:
        match = await JobMatchService(deps.chat_model).analyse(
            state["job_title"],
            state["job_description"],
            state["resume_text"],
        )
    except AIConfigurationError as exc:
        logger.error("AI job match configuration error: {}", str(exc))
        raise TailorWorkflowError(
            400,
            "AI configuration is invalid. Please check your AI configuration settings.",
        ) from exc
    except GuardrailViolation as exc:
        raise TailorWorkflowError(400, exc.detail) from exc
    except AIProviderError as exc:
        logger.error("AI job match provider error: {}", str(exc))
        raise TailorWorkflowError(
            502,
            "AI connection failed. Please check your AI configuration settings and try again.",
        ) from exc
    return {"job_match": match}


@observe_node("tailor", "plan_actions")
async def plan_actions(state: TailorState, config: RunnableConfig) -> dict:
    deps = _get_deps(config)
    resume_data = state.get("resume_data") or {}
    job_match_data = state.get("job_match") or {}

    skills = resume_data.get("skills")
    existing_skill_names: set[str] = set()
    if isinstance(skills, list):
        existing_skill_names = {
            name.lower() for name in collect_skill_item_names(normalize_skills(skills))
        }

    prompt = build_plan_actions_prompt(
        tone=state.get("tone") or "professional",
        job_title=state["job_title"],
        job_description=state["job_description"],
        suggestions=job_match_data.get("suggestions") or [],
        missing_keywords=job_match_data.get("missing_keywords") or [],
        resume_text=state.get("resume_text") or "",
        existing_skill_names=sorted(existing_skill_names),
        work_experiences_context=build_work_experiences_context(resume_data),
        projects_context=build_projects_context(resume_data),
        validation_errors=state.get("validation_errors") or [],
    )

    try:
        plan = await ainvoke_structured(deps.chat_model, TailorActionsPlan, prompt)
        actions = plan.to_action_dicts()
    except AIConfigurationError as exc:
        logger.error("AI tailoring configuration error: {}", str(exc))
        raise TailorWorkflowError(
            400,
            "AI configuration is invalid. Please check your AI configuration settings.",
        ) from exc
    except AIProviderError as exc:
        logger.error("AI tailoring provider error: {}", str(exc))
        raise TailorWorkflowError(
            502,
            "AI connection failed. Please check your AI configuration settings and try again.",
        ) from exc

    return {"actions": actions}


@observe_node("tailor", "validate_actions")
async def validate_actions(state: TailorState, config: RunnableConfig) -> dict:
    valid, errors = validate_tailor_actions(
        state.get("actions") or [],
        state.get("resume_data") or {},
    )
    retry_count = int(state.get("retry_count") or 0)
    if errors:
        logger.info(
            "Tailor action validation failed (retry_count={}): {}",
            retry_count,
            errors,
        )
        return {
            "actions": valid,
            "validation_errors": errors,
            "retry_count": retry_count + 1,
        }
    return {
        "actions": valid,
        "validation_errors": [],
        "retry_count": retry_count,
    }


def route_after_validate(state: TailorState) -> Literal["plan_actions", "quality_check"]:
    errors = state.get("validation_errors") or []
    retry_count = int(state.get("retry_count") or 0)
    if errors and retry_count <= MAX_PLAN_RETRIES:
        return "plan_actions"
    return "quality_check"


@observe_node("tailor", "quality_check")
async def quality_check(state: TailorState, config: RunnableConfig) -> dict:
    """Post-plan heuristics: drop toxic / invented-employer actions before apply."""
    kept, warnings = assess_tailor_action_quality(
        state.get("actions") or [],
        state.get("resume_data") or {},
    )
    if warnings:
        logger.info("Tailor quality_check filtered actions: {}", warnings)
    return {"actions": kept}


@observe_node("tailor", "apply_actions")
async def apply_actions(state: TailorState, config: RunnableConfig) -> dict:
    updated = apply_tailor_actions(state.get("resume_data") or {}, state.get("actions") or [])
    return {"resume_data": updated}


@observe_node("tailor", "persist")
async def persist(state: TailorState, config: RunnableConfig) -> dict:
    deps = _get_deps(config)
    stmt = select(Resume).where(
        Resume.id == state["resume_id"],
        Resume.user_id == deps.user.id,
    )
    result = await deps.db.execute(stmt)
    resume = result.scalar_one_or_none()
    if not resume:
        raise TailorWorkflowError(404, "Resume not found")

    resume.resume_data = dict(state.get("resume_data") or {})
    flag_modified(resume, "resume_data")
    resume.updated_at = datetime.now(timezone.utc)

    if state.get("is_platform_mode"):
        await deps.plan_service.deduct_tokens(
            int(state.get("cost") or settings.COST_TAILOR_RESUME),
            "Resume Tailoring",
        )

    await deps.db.commit()
    response = await deps.get_resume_by_id(state["resume_id"])
    return {"result_resume": response}


def build_tailor_graph():
    graph = StateGraph(TailorState)
    graph.add_node("input_guardrails", input_guardrails)
    graph.add_node("load_resume", load_resume)
    graph.add_node("check_balance", check_balance)
    graph.add_node("job_match", job_match)
    graph.add_node("plan_actions", plan_actions)
    graph.add_node("validate_actions", validate_actions)
    graph.add_node("quality_check", quality_check)
    graph.add_node("apply_actions", apply_actions)
    graph.add_node("persist", persist)

    graph.add_edge(START, "input_guardrails")
    graph.add_edge("input_guardrails", "load_resume")
    graph.add_edge("load_resume", "check_balance")
    graph.add_edge("check_balance", "job_match")
    graph.add_edge("job_match", "plan_actions")
    graph.add_edge("plan_actions", "validate_actions")
    graph.add_conditional_edges(
        "validate_actions",
        route_after_validate,
        {
            "plan_actions": "plan_actions",
            "quality_check": "quality_check",
        },
    )
    graph.add_edge("quality_check", "apply_actions")
    graph.add_edge("apply_actions", "persist")
    graph.add_edge("persist", END)
    return graph.compile()


_TAILOR_GRAPH = None


def get_tailor_graph():
    global _TAILOR_GRAPH
    if _TAILOR_GRAPH is None:
        _TAILOR_GRAPH = build_tailor_graph()
    return _TAILOR_GRAPH


async def run_tailor_resume(
    *,
    deps: TailorDeps,
    resume_id: str,
    body: TailorResumeRequest,
    is_platform_mode: bool,
) -> ResumeResponse:
    graph = get_tailor_graph()
    initial: TailorState = {
        "resume_id": resume_id,
        "job_title": body.job_title,
        "job_description": body.job_description,
        "tone": body.tone,
        "retry_count": 0,
        "validation_errors": [],
        "actions": [],
        "is_platform_mode": is_platform_mode,
        "cost": settings.COST_TAILOR_RESUME,
    }
    try:
        async with timed_ai_action(
            "tailor_resume",
            is_platform_mode=is_platform_mode,
            cost=settings.COST_TAILOR_RESUME,
        ) as meta:
            meta["resume_id"] = resume_id
            final_state = await graph.ainvoke(
                initial,
                config={"configurable": {"deps": deps}},
            )
    except TailorWorkflowError:
        raise
    except AIConfigurationError as exc:
        raise TailorWorkflowError(
            400,
            "AI configuration is invalid. Please check your AI configuration settings.",
        ) from exc
    except AIProviderError as exc:
        raise TailorWorkflowError(
            502,
            "AI connection failed. Please check your AI configuration settings and try again.",
        ) from exc

    result = final_state.get("result_resume")
    if result is None:
        raise TailorWorkflowError(500, "Tailoring failed. Please try again.")
    return result


def tailor_workflow_error_to_http(exc: TailorWorkflowError) -> HTTPException:
    return HTTPException(status_code=exc.status_code, detail=exc.detail)
