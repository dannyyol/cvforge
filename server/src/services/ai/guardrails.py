from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Iterable, List, Optional, Sequence, Tuple


class GuardrailViolation(Exception):
    """Raised when user-supplied text fails an input safety check."""

    def __init__(self, code: str, detail: str | None = None):
        self.code = code
        self.detail = detail or (
            "This request was blocked by content safety checks. "
            "Please revise the job description and try again."
        )
        super().__init__(self.detail)


# --- Prompt injection (deterministic) ---

_INJECTION_PATTERNS: Tuple[re.Pattern[str], ...] = tuple(
    re.compile(p, re.IGNORECASE)
    for p in (
        r"\bignore\s+(all\s+)?(previous|prior|above)\s+instructions?\b",
        r"\bdisregard\s+(all\s+)?(previous|prior|above)\s+instructions?\b",
        r"\bforget\s+(all\s+)?(previous|prior|above)\s+instructions?\b",
        r"\boverride\s+(the\s+)?system\s+prompt\b",
        r"\bnew\s+system\s+prompt\b",
        r"\byou\s+are\s+now\b.{0,40}\b(dan|jailbreak|unrestricted)\b",
        r"\bjailbreak\b",
        r"\bdo\s+not\s+follow\s+(your|the)\s+(system|developer)\s+(prompt|instructions?)\b",
        r"\breveal\s+(your\s+)?(system|hidden|developer)\s+prompt\b",
        r"\bexfiltrate\b",
        r"<\s*/?\s*system\s*>",
        r"```\s*system\b",
        r"\bTOOLS?\s*:\s*\[",
        r"\b(begin|start)\s+system\s+message\b",
    )
)


# --- Content safety / toxicity (deterministic; avoid common tech false positives) ---

_TOXICITY_PATTERNS: Tuple[re.Pattern[str], ...] = tuple(
    re.compile(p, re.IGNORECASE)
    for p in (
        r"\b(kill|murder|assassinate)\s+(all\s+)?(people|humans|jews|muslims|christians|blacks|whites)\b",
        r"\b(how\s+to\s+)?(make|build|create)\s+(a\s+)?(bomb|explosive|pipe\s*bomb)\b",
        r"\bchild\s*(porn|sexual|abuse)\b",
        r"\bcsam\b",
        r"\brape\b",
        r"\b(racial|ethnic)\s+slur\b",
        r"\bgas\s+the\b",
        r"\blynch(ing)?\b",
        r"\bwhite\s+power\b",
        r"\bnazi\s+salute\b",
    )
)


_EMPLOYER_CLAIM_RE = re.compile(
    r"\b(?:at|@|joined|joining|employed\s+by|working\s+(?:at|for)|work(?:ed|ing)?\s+(?:at|for))\s+"
    r"([A-Z][\w&.'-]*(?:\s+(?:and\s+|&\s+)?[A-Z][\w&.'-]*){0,4})",
)


@dataclass(frozen=True)
class GuardrailFinding:
    code: str
    detail: str
    matched: str = ""


def _scan_patterns(text: str, patterns: Sequence[re.Pattern[str]], code: str) -> Optional[GuardrailFinding]:
    if not text or not text.strip():
        return None
    for pattern in patterns:
        match = pattern.search(text)
        if match:
            return GuardrailFinding(code=code, detail=code, matched=match.group(0)[:80])
    return None


def find_prompt_injection(text: str) -> Optional[GuardrailFinding]:
    return _scan_patterns(text, _INJECTION_PATTERNS, "prompt_injection")


def find_toxicity(text: str) -> Optional[GuardrailFinding]:
    return _scan_patterns(text, _TOXICITY_PATTERNS, "content_safety")


def scan_user_text(*parts: Optional[str]) -> Optional[GuardrailFinding]:
    """Scan untrusted user-supplied fields (job title / description)."""
    for part in parts:
        if not part:
            continue
        finding = find_prompt_injection(part) or find_toxicity(part)
        if finding:
            return finding
    return None


def enforce_safe_user_inputs(*parts: Optional[str]) -> None:
    """Raise ``GuardrailViolation`` if any untrusted input fails safety checks."""
    finding = scan_user_text(*parts)
    if finding:
        raise GuardrailViolation(finding.code)


def collect_resume_employers(resume_data: dict) -> set[str]:
    employers: set[str] = set()
    experiences = resume_data.get("workExperiences")
    if not isinstance(experiences, list):
        return employers
    for item in experiences:
        if not isinstance(item, dict):
            continue
        company = str(item.get("company") or "").strip()
        if company:
            employers.add(company.casefold())
    return employers


def _experience_company(resume_data: dict, experience_id: str) -> str:
    experiences = resume_data.get("workExperiences")
    if not isinstance(experiences, list):
        return ""
    for item in experiences:
        if not isinstance(item, dict):
            continue
        if str(item.get("id") or "").strip() == experience_id:
            return str(item.get("company") or "").strip()
    return ""


def _claimed_employers(text: str) -> List[str]:
    return [m.group(1).strip() for m in _EMPLOYER_CLAIM_RE.finditer(text or "")]


def _is_known_employer(name: str, known: Iterable[str], *, current: str = "") -> bool:
    needle = name.casefold().strip()
    if not needle:
        return True
    if current and needle == current.casefold():
        return True
    known_cf = {k.casefold() for k in known}
    if needle in known_cf:
        return True
    # Allow short tokens / generic phrases that are not employers.
    if len(needle) < 3 or needle in {"the", "a", "an", "my", "our", "this", "that", "company", "team"}:
        return True
    # Prefix / containment match
    for employer in known_cf:
        if needle in employer or employer in needle:
            return True
    return False


def find_invented_employers(
    text: str,
    resume_data: dict,
    *,
    current_company: str = "",
) -> List[str]:
    known = collect_resume_employers(resume_data)
    invented: List[str] = []
    for claim in _claimed_employers(text):
        if not _is_known_employer(claim, known, current=current_company):
            invented.append(claim)
    return invented


def assess_tailor_action_quality(
    actions: Sequence[dict],
    resume_data: dict,
) -> Tuple[List[dict], List[str]]:
    """Drop actions that fail toxicity / invented-employer heuristics.

    Structural ID validation remains in ``validate_tailor_actions``.
    """
    kept: List[dict] = []
    warnings: List[str] = []

    for index, action in enumerate(actions):
        if not isinstance(action, dict):
            warnings.append(f"actions[{index}]: dropped non-object action")
            continue

        action_type = str(action.get("type") or "").strip()
        label = f"actions[{index}] ({action_type or 'unknown'})"
        text_fields: List[str] = []

        if action_type == "update_summary":
            text_fields = [str(action.get("content") or "")]
        elif action_type in ("update_experience_description", "update_project_description"):
            text_fields = [str(action.get("description") or "")]
        elif action_type == "add_project":
            text_fields = [
                str(action.get("name") or ""),
                str(action.get("description") or ""),
            ]
        elif action_type == "add_skill":
            text_fields = [str(action.get("name") or "")]

        joined = "\n".join(text_fields)
        safety = scan_user_text(joined)
        if safety:
            warnings.append(f"{label}: dropped ({safety.code})")
            continue

        current_company = ""
        if action_type == "update_experience_description":
            current_company = _experience_company(
                resume_data,
                str(action.get("experienceId") or "").strip(),
            )

        # Summary + experience descriptions must not invent new employers.
        if action_type in ("update_summary", "update_experience_description"):
            invented = find_invented_employers(
                joined,
                resume_data,
                current_company=current_company,
            )
            if invented:
                warnings.append(
                    f"{label}: dropped invented employer claim(s): {', '.join(invented[:3])}"
                )
                continue

        kept.append(action)

    return kept, warnings
