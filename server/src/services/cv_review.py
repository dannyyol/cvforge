import os
import re
import json
from typing import Dict, List, Tuple, Optional
import requests
from loguru import logger

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
DEFAULT_MODEL = os.getenv("OLLAMA_MODEL", "gemma3:4b")


def _strip_code_fences(text: str) -> str:
    return re.sub(r"```(?:json)?\s*|\s*```", "", text, flags=re.IGNORECASE).strip()


def _extract_json(text: str) -> Optional[dict]:
    text = _strip_code_fences(text)
    start = text.find("{")
    if start == -1:
        return None
    stack = 0
    end = None
    for i in range(start, len(text)):
        ch = text[i]
        if ch == "{":
            stack += 1
        elif ch == "}":
            stack -= 1
            if stack == 0:
                end = i + 1
                break
    if end is None:
        return None
    try:
        return json.loads(text[start:end])
    except json.JSONDecodeError:
        return None


def _safe_number(value, default: float = 0.0) -> float:
    try:
        num = float(value)
        if num < 0:
            return 0.0
        if num > 100:
            return 100.0
        return num
    except Exception:
        return default


def _normalize_whitespace(text: str) -> str:
    return re.sub(r"[ \t]+", " ", text.replace("\r\n", "\n")).strip()


def _section_patterns() -> List[Tuple[str, str]]:
    return [
        ("Summary", r"(?im)^\s*(summary|objective|professional summary)\s*:?\s*$"),
        ("Experience", r"(?im)^\s*(experience|work experience|employment history|professional experience)\s*:?\s*$"),
        ("Education", r"(?im)^\s*(education|academic background)\s*:?\s*$"),
        ("Skills", r"(?im)^\s*(skills|technical skills|skills & competencies|core competencies)\s*:?\s*$"),
        ("Projects", r"(?im)^\s*(projects|key projects|selected projects)\s*:?\s*$"),
        ("Certifications", r"(?im)^\s*(certifications|licenses|certificates)\s*:?\s*$"),
    ]


def _parse_sections(resume_text: str) -> Dict[str, str]:
    text = _normalize_whitespace(resume_text)
    indices: List[Tuple[int, str]] = []
    for canon, pattern in _section_patterns():
        for m in re.finditer(pattern, text):
            indices.append((m.start(), canon))
    indices.sort(key=lambda x: x[0])

    if not indices:
        return {"Summary": text}

    sections: Dict[str, str] = {}
    for i, (start_idx, name) in enumerate(indices):
        end_idx = indices[i + 1][0] if i + 1 < len(indices) else len(text)
        chunk = text[start_idx:end_idx]
        chunk = re.sub(r"(?im)^\s*.+?\n", "", chunk, count=1).strip()
        if chunk:
            if name in sections:
                sections[name] += "\n\n" + chunk
            else:
                sections[name] = chunk

    return sections or {"Summary": text}


def _compose_section_prompt(name: str, content: str) -> str:
    return (
        "You are a CV reviewer. Analyze the resume section below.\n"
        f"Section Name: {name}\n\n"
        "Return ONLY valid JSON with exactly these keys:\n"
        '{\n'
        '  "name": string,\n'
        '  "score": number,  // 0-100\n'
        '  "suggestions": [string],\n'
        '  "section_scores": {\n'
        '    "ATS Compatibility": number,  // 0-100\n'
        '    "Content Quality": number,    // 0-100\n'
        '    "Formatting": number          // 0-100\n'
        '  },\n'
        '  "strengths": [string],\n'
        '  "areas_to_improve": [string]\n'
        '}\n\n'
        "Keep suggestions concise and actionable. Do not include any commentary outside the JSON.\n\n"
        "Section Content:\n"
        f"\"\"\"\n{content}\n\"\"\"\n"
    )


def _api_call(prompt: str, model: str) -> str:
    url = f"{OLLAMA_URL}/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.2,
            "num_predict": int(os.getenv("OLLAMA_NUM_PREDICT", "256")),
        },
    }
    try:
        resp = requests.post(url, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data.get("response", "")
    except requests.RequestException as exc:
        logger.exception(
            "Ollama request failed: url={} model={} status_code={} error={}",
            url,
            model,
            getattr(getattr(exc, "response", None), "status_code", None),
            str(exc),
        )
        raise
    except Exception as exc:
        logger.exception("Unexpected error calling Ollama: url={} model={} error={}", url, model, str(exc))
        raise


def _analyze_section(name: str, content: str, model: str) -> dict:
    try:
        response_text = _api_call(_compose_section_prompt(name, content), model=model)
        parsed = _extract_json(response_text) or {}
    except Exception:
        parsed = {}

    section_scores = parsed.get("section_scores", {})
    return {
        "name": parsed.get("name", name),
        "score": _safe_number(parsed.get("score", 0)),
        "suggestions": list(map(str, parsed.get("suggestions", []))),
        "section_scores": {
            "ATS Compatibility": _safe_number(section_scores.get("ATS Compatibility", 0)),
            "Content Quality": _safe_number(section_scores.get("Content Quality", 0)),
            "Formatting": _safe_number(section_scores.get("Formatting", 0)),
        },
        "strengths": list(map(str, parsed.get("strengths", []))),
        "areas_to_improve": list(map(str, parsed.get("areas_to_improve", []))),
    }


def flatten_resume_sections(sections_payload: dict) -> Dict[str, str]:
    sections_payload = sections_payload or {}

    def _join_nonempty(parts):
        return "\n".join([p for p in parts if p and str(p).strip()])

    # Summary
    summary = ""
    prof = sections_payload.get("professionalSummary") or {}
    summary = prof.get("content") or ""

    # Experience
    exp_items = sections_payload.get("workExperience") or []
    exp_parts: List[str] = []
    for item in exp_items:
        title = item.get("job_title", "")
        company = item.get("company", "")
        location = item.get("location", "")
        start = item.get("start_date", "")
        end = item.get("end_date", "")
        current = item.get("current", False)
        date_range = f"{start}–{'Present' if current else end}".strip("–")
        header = ", ".join([p for p in [title, company] if p])
        tail = " — ".join([p for p in [location, date_range] if p])
        line1 = " — ".join([p for p in [header, tail] if p])
        desc = item.get("description", "")
        exp_parts.append(_join_nonempty([line1, desc]).strip())
    experience = "\n\n".join([p for p in exp_parts if p])

    # Education
    edu_items = sections_payload.get("education") or []
    edu_parts: List[str] = []
    for item in edu_items:
        degree = item.get("degree", "")
        field = item.get("field_of_study", "")
        inst = item.get("institution", "")
        start = item.get("start_date", "")
        end = item.get("end_date", "")
        line = ", ".join([p for p in [degree, field] if p])
        tail = " — ".join([p for p in [inst, f"{start}–{end}".strip('–')] if p])
        edu_parts.append(_join_nonempty([" ".join([line, tail]).strip()]))
    education = "\n\n".join([p for p in edu_parts if p])

    # Skills
    skill_items = sections_payload.get("skills") or []
    skills = ", ".join([s.get("name", "") + (f" ({s.get('level')})" if s.get("level") else "") for s in skill_items if s.get("name")])

    # Projects
    proj_items = sections_payload.get("projects") or []
    proj_parts: List[str] = []
    for item in proj_items:
        title = item.get("title", "")
        desc = item.get("description", "")
        start = item.get("start_date", "")
        end = item.get("end_date", "")
        url = item.get("url", "")
        line = " — ".join([p for p in [title, desc] if p])
        tail = " ".join([p for p in [f"({start}–{end})".strip('()–'), url] if p])
        proj_parts.append(_join_nonempty([line, tail]).strip())
    projects = "\n\n".join([p for p in proj_parts if p])

    # Certifications
    cert_items = sections_payload.get("certifications") or []
    cert_parts: List[str] = []
    for item in cert_items:
        name = item.get("name", "")
        issuer = item.get("issuer", "")
        issue_date = item.get("issue_date", "")
        expiry_date = item.get("expiry_date", "")
        line = " — ".join([p for p in [name, issuer] if p])
        tail = f"{issue_date}–{expiry_date}".strip("–")
        cert_parts.append(_join_nonempty([line, tail]).strip())
    certifications = "\n\n".join([p for p in cert_parts if p])

    result: Dict[str, str] = {}
    if summary: result["Summary"] = summary
    if experience: result["Experience"] = experience
    if education: result["Education"] = education
    if skills: result["Skills"] = skills
    if projects: result["Projects"] = projects
    if certifications: result["Certifications"] = certifications

    return result

def _build_resume_text_from_nested(sections_payload: dict) -> str:
    sections_payload = sections_payload or {}
    flat = flatten_resume_sections(sections_payload)
    order = ["Summary", "Experience", "Education", "Skills", "Projects", "Certifications"]

    lines: List[str] = []
    # First, add known sections in a stable order
    for name in order:
        content = flat.get(name, "").strip()
        if content:
            lines.append(f"{name}\n{content}")

    # Then, add any additional sections not covered above
    for name, content in flat.items():
        if name not in order and content.strip():
            lines.append(f"{name}\n{content.strip()}")

    return "\n\n".join(lines).strip()


def review_cv(resume_text: str, model: Optional[str] = None) -> dict:
    sections = _parse_sections(resume_text or "")
    base = review_cv_from_sections(sections, model=model)

    combined = _analyze_resume_combined(resume_text or "", (model or DEFAULT_MODEL))
    ats = combined.get("atsCompatibility", {"score": 0.0, "summary": []})
    content_quality = combined.get("contentQuality", {"score": 0.0, "summary": []})
    fmt_analysis = combined.get("formattingAnalysis", {"score": 0.0, "summary": []})

    base["atsCompatibility"] = ats
    base["contentQuality"] = content_quality
    base["formattingAnalysis"] = fmt_analysis

    return base


def review_cv_from_sections(sections: Dict[str, str], model: Optional[str] = None) -> dict:
    model = model or DEFAULT_MODEL
    analyzed: List[dict] = []
    for name in sections: #["Summary", "Experience", "Education", "Skills", "Projects", "Certifications"]:
        if name in sections and sections[name].strip():
            analyzed.append(_analyze_section(name, sections[name], model))

    if not analyzed:
        analyzed.append(_analyze_section("Summary", "\n".join(sections.values()), model))

    strengths: List[str] = []
    improvements: List[str] = []
    final_sections: List[dict] = []

    for sec in analyzed:
        final_sections.append(
            {"name": sec["name"], "score": _safe_number(sec["score"], 0), "suggestions": sec.get("suggestions", [])}
        )
        strengths.extend(sec.get("strengths", []))
        improvements.extend(sec.get("areas_to_improve", []))

    categories = _compute_categories(analyzed)
    overall = round(sum(s["score"] for s in final_sections) / len(final_sections), 1) if final_sections else 0.0

    return {
        "overall_score": overall,
        "categories": categories,
        "strengths": sorted({s.strip() for s in strengths if s.strip()}),
        "areas_to_improve": sorted({a.strip() for a in improvements if a.strip()}),
        "sections": final_sections,
    }


def review_cv_payload(payload: dict) -> dict:
    sections_payload = (payload or {}).get("sections") or {}
    model = (payload or {}).get("model") or DEFAULT_MODEL
    resume_text_full = _build_resume_text_from_nested(sections_payload)

    combined = _analyze_resume_combined(resume_text_full or "", model)
    ats = combined.get("atsCompatibility", {"score": 0.0, "summary": []})
    content_quality = combined.get("contentQuality", {"score": 0.0, "summary": []})
    fmt_analysis = combined.get("formattingAnalysis", {"score": 0.0, "summary": []})

    sections = flatten_resume_sections(sections_payload)
    base = review_cv_from_sections(sections, model=model)

    base["atsCompatibility"] = ats
    base["contentQuality"] = content_quality
    base["formattingAnalysis"] = fmt_analysis

    return base


# module helpers for improved category scoring
def _canonical_section_name(name: str) -> str:
    n = (name or "").lower()
    if "experience" in n: return "Experience"
    if "summary" in n or "objective" in n: return "Summary"
    if "education" in n: return "Education"
    if "skill" in n: return "Skills"
    if "project" in n: return "Projects"
    if "cert" in n or "license" in n: return "Certifications"
    return (name or "Summary")


def _weighted_category_score(analyzed_sections: List[dict], key: str, weights_map: Dict[str, float]) -> float:
    total = 0.0
    denom = 0.0
    for sec in analyzed_sections:
        name = _canonical_section_name(sec.get("name", ""))
        score_val = _safe_number(sec.get("section_scores", {}).get(key, 0), 0)
        w = weights_map.get(name, 0.1)
        if score_val > 0 and w > 0:
            total += score_val * w
            denom += w
    return round(total / denom, 1) if denom > 0 else 0.0


def _compute_categories(analyzed_sections: List[dict]) -> Dict[str, float]:
    # Emphasize Experience and Summary for content, and spread formatting across sections
    weights_content = {
        "Summary": 0.2, "Experience": 0.4, "Education": 0.15, "Skills": 0.15, "Projects": 0.1, "Certifications": 0.0
    }
    weights_formatting = {
        "Summary": 0.15, "Experience": 0.35, "Education": 0.15, "Skills": 0.15, "Projects": 0.1, "Certifications": 0.1
    }
    weights_ats = {
        "Summary": 0.2, "Experience": 0.4, "Education": 0.1, "Skills": 0.15, "Projects": 0.1, "Certifications": 0.05
    }
    return {
        "ATS Compatibility": _weighted_category_score(analyzed_sections, "ATS Compatibility", weights_ats),
        "Content Quality": _weighted_category_score(analyzed_sections, "Content Quality", weights_content),
        "Formatting": _weighted_category_score(analyzed_sections, "Formatting", weights_formatting),
    }


def _derive_formatting_adjustment(text: str) -> float:
    text = text or ""
    lines = text.splitlines()
    if not lines:
        return 0.0
    bullet_lines = sum(1 for l in lines if re.match(r"^\s*[-*•·]", l))
    long_lines = sum(1 for l in lines if len(l) > 120)
    total_lines = len(lines)
    bullet_ratio = bullet_lines / max(1, total_lines)
    long_ratio = long_lines / max(1, total_lines)
    table_ratio = text.count("|") / max(1, len(text))

    delta = 0.0
    if bullet_ratio >= 0.3:
        delta += 3.0
    elif bullet_ratio >= 0.1:
        delta += 1.5

    if long_ratio > 0.3:
        delta -= 5.0
    elif long_ratio > 0.1:
        delta -= 2.0

    if table_ratio > 0.02:
        delta -= 4.0

    return max(-10.0, min(10.0, delta))


def _derive_content_quality_adjustment(text: str) -> float:
    text = text or ""
    tokens_count = len(re.findall(r"\w+", text))
    metrics_count = len(re.findall(r"\b\d+(?:\.\d+)?%?\b", text))
    verbs_count = len(re.findall(
        r"\b(led|managed|designed|built|implemented|improved|reduced|increased|optimized|developed|launched|delivered)\b",
        text, flags=re.IGNORECASE
    ))

    delta = 0.0
    if metrics_count >= 5:
        delta += 3.0
    elif metrics_count >= 2:
        delta += 1.5

    if verbs_count >= 6:
        delta += 2.0
    elif verbs_count >= 3:
        delta += 1.0

    if tokens_count < 150:
        delta -= 1.0

    return max(-8.0, min(8.0, delta))


# module-level functions (new)
def _compose_combined_analysis_prompt(content: str) -> str:
    return (
        "You are a CV reviewer. In ONE pass, evaluate the resume for:\n"
        "- ATS Compatibility\n"
        "- Content Quality\n"
        "- Formatting\n\n"
        "Return ONLY valid JSON with exactly this structure:\n"
        "{\n"
        '  "atsCompatibility": {\n'
        '    "score": number,  // 0-100\n'
        '    "summary": [string]\n'
        "  },\n"
        '  "contentQuality": {\n'
        '    "score": number,  // 0-100\n'
        '    "summary": [string]\n'
        "  },\n"
        '  "formattingAnalysis": {\n'
        '    "score": number,  // 0-100\n'
        '    "summary": [string]\n'
        "  }\n"
        "}\n\n"
        "Guidelines:\n"
        "- ATS: section headings, simple formatting, keyword use, clear titles\n"
        "- Content: measurable outcomes, specificity, coverage of key sections, action verbs\n"
        "- Formatting: consistency in headings, bullets, whitespace, punctuation, date ranges\n\n"
        "Provide concise bullet-style strings for each summary. Do NOT include any text outside the JSON.\n\n"
        "Resume to analyze:\n"
        f"\"\"\"\n{content}\n\"\"\"\n"
    )

def _analyze_resume_combined(resume_text: str, model: str) -> dict:
    try:
        response_text = _api_call(_compose_combined_analysis_prompt(resume_text), model=model)
        parsed = _extract_json(response_text) or {}
        ats = parsed.get("atsCompatibility", {}) or {}
        cq = parsed.get("contentQuality", {}) or {}
        fmt = parsed.get("formattingAnalysis", {}) or {}
        return {
            "atsCompatibility": {
                "score": _safe_number(ats.get("score", 0)),
                "summary": list(map(str, ats.get("summary", []))),
            },
            "contentQuality": {
                "score": _safe_number(cq.get("score", 0)),
                "summary": list(map(str, cq.get("summary", []))),
            },
            "formattingAnalysis": {
                "score": _safe_number(fmt.get("score", 0)),
                "summary": list(map(str, fmt.get("summary", []))),
            },
        }
    except Exception as exc:
        logger.warning("Combined analysis failed; falling back to separate calls: {}", str(exc))