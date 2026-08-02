"""Pure helpers for CV review scoring and response assembly."""

from __future__ import annotations

from typing import Dict, List

from src.services.ai.ai_clients_service import TextProcessor

SECTION_WEIGHTS = {
    "Summary": 0.10,
    "Experience": 0.35,
    "Education": 0.15,
    "Skills": 0.20,
    "Projects": 0.10,
}
DEFAULT_SECTION_WEIGHT = 0.10


def weighted_section_score(sections: List[dict]) -> float:
    total_w = 0.0
    accum = 0.0
    for section in sections:
        name = str(section.get("name", "")).strip()
        score = TextProcessor.safe_number(section.get("score", 0), 0.0)
        weight = SECTION_WEIGHTS.get(name, DEFAULT_SECTION_WEIGHT)
        accum += score * weight
        total_w += weight
    return round(accum / total_w, 1) if total_w > 0 else 0.0


def soft_failed_section(name: str, note: str = "Section analysis unavailable") -> dict:
    return {
        "name": name,
        "score": 0.0,
        "strengths": [],
        "areas_to_improve": [note] if note else [],
        "suggestions": [note] if note else [],
    }


def empty_content_review() -> dict:
    return {
        "atsCompatibility": {"score": 0.0, "summary": []},
        "contentQuality": {"score": 0.0, "summary": []},
        "formattingAnalysis": {"score": 0.0, "summary": []},
    }


def assemble_section_base(analyzed: List[dict]) -> dict:
    strengths: List[str] = []
    improvements: List[str] = []
    final_sections: List[dict] = []
    for sec in analyzed:
        final_sections.append(
            {
                "name": sec.get("name", ""),
                "score": TextProcessor.safe_number(sec.get("score", 0), 0),
                "suggestions": sec.get("suggestions", []),
            }
        )
        strengths.extend(sec.get("strengths", []) or [])
        improvements.extend(sec.get("areas_to_improve", []) or [])

    return {
        "overall_score": weighted_section_score(final_sections),
        "strengths": sorted({str(s).strip() for s in strengths if str(s).strip()}),
        "areas_to_improve": sorted({str(a).strip() for a in improvements if str(a).strip()}),
        "sections": final_sections,
    }


def merge_review_scores(
    *,
    section_results: List[dict],
    content_review: dict,
    flat_sections: Dict[str, str],
) -> dict:
    """Merge section + content analyses into the public review payload."""
    base = assemble_section_base(section_results)
    ats = (content_review or {}).get("atsCompatibility") or {"score": 0.0, "summary": []}
    content_quality = (content_review or {}).get("contentQuality") or {"score": 0.0, "summary": []}
    fmt_analysis = (content_review or {}).get("formattingAnalysis") or {"score": 0.0, "summary": []}

    section_overall = TextProcessor.safe_number(base.get("overall_score", 0.0), 0.0)
    ats_score = TextProcessor.safe_number(ats.get("score", 0.0), 0.0)
    cq_score = TextProcessor.safe_number(content_quality.get("score", 0.0), 0.0)
    fmt_score = TextProcessor.safe_number(fmt_analysis.get("score", 0.0), 0.0)

    dim_blend = (0.25 * ats_score) + (0.50 * cq_score) + (0.25 * fmt_score)
    penalty = 0.0
    if not flat_sections.get("Experience"):
        penalty += 8.0
    if not flat_sections.get("Skills"):
        penalty += 5.0
    if not flat_sections.get("Education"):
        penalty += 4.0

    final_overall = max(
        0.0,
        min(100.0, round((0.60 * section_overall) + (0.40 * dim_blend) - penalty, 1)),
    )

    base["overall_score"] = final_overall
    base["atsCompatibility"] = ats
    base["contentQuality"] = content_quality
    base["formattingAnalysis"] = fmt_analysis
    return base


def is_empty_review(result: dict) -> bool:
    ats = result.get("atsCompatibility") or {}
    content_quality = result.get("contentQuality") or {}
    fmt_analysis = result.get("formattingAnalysis") or {}
    return (
        TextProcessor.safe_number(result.get("overall_score", 0), 0.0) <= 0
        and not result.get("strengths")
        and not result.get("areas_to_improve")
        and all(
            TextProcessor.safe_number(s.get("score", 0), 0.0) <= 0 and not s.get("suggestions")
            for s in (result.get("sections") or [])
        )
        and TextProcessor.safe_number(ats.get("score", 0), 0.0) <= 0
        and not ats.get("summary")
        and TextProcessor.safe_number(content_quality.get("score", 0), 0.0) <= 0
        and not content_quality.get("summary")
        and TextProcessor.safe_number(fmt_analysis.get("score", 0), 0.0) <= 0
        and not fmt_analysis.get("summary")
    )
