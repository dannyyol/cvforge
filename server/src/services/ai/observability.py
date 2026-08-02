"""AI observability: LangSmith tracing, structured logs, PII redaction, PAYG costs."""

from __future__ import annotations

import os
import re
import time
from contextlib import asynccontextmanager, contextmanager
from functools import wraps
from typing import Any, AsyncIterator, Awaitable, Callable, Dict, Iterator, Optional, TypeVar

from loguru import logger

from src.config import get_settings

F = TypeVar("F", bound=Callable[..., Awaitable[Any]])

# Flat PAYG product actions → existing COST_* settings (not metered token billing).
PRODUCT_ACTIONS = (
    "cv_review",
    "generate_cover_letter",
    "tailor_resume",
    "parse_resume",
    "job_match",
)

_EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
_PHONE_RE = re.compile(
    r"(?<!\w)(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)\d{3,4}[\s.-]?\d{3,4}(?!\w)"
)
_URL_WITH_QUERY_RE = re.compile(r"https?://[^\s]+", re.IGNORECASE)


def get_product_action_cost(action: str) -> int:
    """Map a product action to the flat ``COST_*`` token price."""
    settings = get_settings()
    mapping = {
        "cv_review": settings.COST_CV_REVIEW,
        "generate_cover_letter": settings.COST_GENERATE_COVER_LETTER,
        "tailor_resume": settings.COST_TAILOR_RESUME,
        "parse_resume": settings.COST_PARSE_RESUME,
        "job_match": settings.COST_JOB_MATCH,
    }
    if action not in mapping:
        raise ValueError(f"Unknown product action: {action}")
    return int(mapping[action])


def redact_pii(text: str) -> str:
    """Redact common PII from text before logging or tracing."""
    if not text:
        return text
    redacted = _EMAIL_RE.sub("[REDACTED_EMAIL]", text)
    redacted = _PHONE_RE.sub("[REDACTED_PHONE]", redacted)
    redacted = _URL_WITH_QUERY_RE.sub("[REDACTED_URL]", redacted)
    return redacted


def maybe_redact_for_logs(text: str, *, max_chars: int = 500) -> str:
    """Return a log-safe snippet; always redact when not DEBUG or when prompts disabled."""
    settings = get_settings()
    if not text:
        return ""
    if not settings.AI_LOG_PROMPTS:
        return f"[prompt omitted len={len(text)}]"
    snippet = text if len(text) <= max_chars else text[:max_chars] + "…"
    if settings.DEBUG:
        return redact_pii(snippet)
    return redact_pii(snippet)


def configure_ai_observability() -> Dict[str, Any]:
    """Apply LangSmith env configuration from app settings. Safe to call at startup."""
    settings = get_settings()
    status: Dict[str, Any] = {
        "langsmith_tracing": False,
        "project": settings.LANGSMITH_PROJECT,
        "hide_inputs": False,
    }

    if settings.LANGSMITH_TRACING and settings.LANGSMITH_API_KEY:
        os.environ["LANGSMITH_TRACING"] = "true"
        os.environ["LANGSMITH_API_KEY"] = settings.LANGSMITH_API_KEY
        os.environ["LANGSMITH_PROJECT"] = settings.LANGSMITH_PROJECT
        if settings.LANGSMITH_ENDPOINT:
            os.environ["LANGSMITH_ENDPOINT"] = settings.LANGSMITH_ENDPOINT
        # Production: hide prompt/resume payloads from LangSmith by default.
        if not settings.DEBUG:
            os.environ["LANGSMITH_HIDE_INPUTS"] = "true"
            status["hide_inputs"] = True
        status["langsmith_tracing"] = True
        logger.info(
            "AI observability: LangSmith tracing enabled project={} hide_inputs={}",
            settings.LANGSMITH_PROJECT,
            status["hide_inputs"],
        )
    else:
        os.environ["LANGSMITH_TRACING"] = "false"
        logger.info("AI observability: LangSmith tracing disabled")

    return status


def log_ai_action(
    *,
    action: str,
    status: str,
    latency_ms: float,
    is_platform_mode: Optional[bool] = None,
    cost: Optional[int] = None,
    extra: Optional[Dict[str, Any]] = None,
) -> None:
    """Structured log for a product-level AI action (flat COST_* billing)."""
    payload: Dict[str, Any] = {
        "event": "ai_action",
        "action": action,
        "status": status,
        "latency_ms": round(latency_ms, 1),
    }
    if is_platform_mode is not None:
        payload["is_platform_mode"] = is_platform_mode
        if is_platform_mode:
            payload["cost_tokens"] = (
                cost if cost is not None else get_product_action_cost(action)
            )
        else:
            payload["cost_tokens"] = 0
    elif cost is not None:
        payload["cost_tokens"] = cost
    if extra:
        payload["extra"] = extra
    logger.info("ai_action {}", payload)


def log_ai_node(
    *,
    workflow: str,
    node: str,
    status: str,
    latency_ms: float,
    extra: Optional[Dict[str, Any]] = None,
) -> None:
    payload: Dict[str, Any] = {
        "event": "ai_node",
        "workflow": workflow,
        "node": node,
        "status": status,
        "latency_ms": round(latency_ms, 1),
    }
    if extra:
        payload["extra"] = extra
    logger.info("ai_node {}", payload)


@contextmanager
def timed_span(name: str) -> Iterator[Dict[str, Any]]:
    meta: Dict[str, Any] = {"name": name}
    start = time.perf_counter()
    try:
        yield meta
        meta["status"] = "ok"
    except Exception:
        meta["status"] = "error"
        raise
    finally:
        meta["latency_ms"] = (time.perf_counter() - start) * 1000.0


@asynccontextmanager
async def timed_ai_action(
    action: str,
    *,
    is_platform_mode: Optional[bool] = None,
    cost: Optional[int] = None,
) -> AsyncIterator[Dict[str, Any]]:
    meta: Dict[str, Any] = {}
    start = time.perf_counter()
    status = "ok"
    try:
        yield meta
    except Exception:
        status = "error"
        raise
    finally:
        log_ai_action(
            action=action,
            status=status,
            latency_ms=(time.perf_counter() - start) * 1000.0,
            is_platform_mode=is_platform_mode,
            cost=cost,
            extra=meta or None,
        )


def observe_node(workflow: str, node: str) -> Callable[[F], F]:
    """Decorator for async LangGraph nodes: logs latency + status."""

    def decorator(fn: F) -> F:
        @wraps(fn)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            start = time.perf_counter()
            status = "ok"
            try:
                return await fn(*args, **kwargs)
            except Exception:
                status = "error"
                raise
            finally:
                log_ai_node(
                    workflow=workflow,
                    node=node,
                    status=status,
                    latency_ms=(time.perf_counter() - start) * 1000.0,
                )

        return wrapper  # type: ignore[return-value]

    return decorator
