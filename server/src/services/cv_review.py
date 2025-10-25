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

    # Languages
    lang_items = sections_payload.get("languages") or []
    lang_parts: List[str] = []
    for item in lang_items:
        language = item.get("language", "")
        proficiency = item.get("proficiency", "")
        entry = " — ".join([p for p in [language, proficiency] if p]).strip()
        if entry:
            lang_parts.append(entry)
    languages = ", ".join([p for p in lang_parts if p])

    # Awards
    award_items = sections_payload.get("awards") or []
    award_parts: List[str] = []
    for item in award_items:
        title = item.get("title", "")
        issuer = item.get("issuer", "")
        year = item.get("year", "")
        description = item.get("description", "")
        line = " — ".join([p for p in [title, issuer] if p])
        tail = " ".join([p for p in [year, description] if p])
        award_parts.append(_join_nonempty([line, tail]).strip())
    awards = "\n\n".join([p for p in award_parts if p])

    # Publications
    pub_items = sections_payload.get("publications") or []
    pub_parts: List[str] = []
    for item in pub_items:
        title = item.get("title", "")
        publisher = item.get("publisher", "")
        year = item.get("year", "")
        raw_url = item.get("url", "")
        url = str(raw_url).replace("`", "").strip()
        line = " — ".join([p for p in [title, publisher] if p])
        tail = " ".join([p for p in [f"({year})".strip('()'), url] if p])
        pub_parts.append(_join_nonempty([line, tail]).strip())
    publications = "\n\n".join([p for p in pub_parts if p])

    result: Dict[str, str] = {}
    if summary: result["Summary"] = summary
    if experience: result["Experience"] = experience
    if education: result["Education"] = education
    if skills: result["Skills"] = skills
    if projects: result["Projects"] = projects
    if certifications: result["Certifications"] = certifications
    if publications: result["Publications"] = publications
    if awards: result["Awards"] = awards
    if languages: result["Languages"] = languages

    return result

def _build_resume_text_from_nested(sections_payload: dict) -> str:
    sections_payload = sections_payload or {}
    flat = flatten_resume_sections(sections_payload)
    order = ["Summary", "Experience", "Education", "Skills", "Projects", "Certifications", "Publications", "Awards", "Languages"]

    lines: List[str] = []
    for name in order:
        content = flat.get(name, "").strip()
        if content:
            lines.append(f"{name}\n{content}")

    for name, content in flat.items():
        if name not in order and content.strip():
            lines.append(f"{name}\n{content.strip()}")

    return "\n\n".join(lines).strip()

def review_cv_from_sections(sections: Dict[str, str], model: Optional[str] = None) -> dict:
    model = model or DEFAULT_MODEL
    analyzed: List[dict] = []
    for name in sections:
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

    overall = round(sum(s["score"] for s in final_sections) / len(final_sections), 1) if final_sections else 0.0

    return {
        "overall_score": overall,
        "strengths": sorted({s.strip() for s in strengths if s.strip()}),
        "areas_to_improve": sorted({a.strip() for a in improvements if a.strip()}),
        "sections": final_sections,
    }


def review_cv_payload(payload: dict) -> dict:
    sections_payload = (payload or {}).get("sections") or {}
    model = (payload or {}).get("model") or DEFAULT_MODEL
    resume_text_full = _build_resume_text_from_nested(sections_payload)

    combined = _analyze_resume_content(resume_text_full or "", model)
    ats = combined.get("atsCompatibility", {"score": 0.0, "summary": []})
    content_quality = combined.get("contentQuality", {"score": 0.0, "summary": []})
    fmt_analysis = combined.get("formattingAnalysis", {"score": 0.0, "summary": []})

    sections = flatten_resume_sections(sections_payload)
    base = review_cv_from_sections(sections, model=model)

    base["atsCompatibility"] = ats
    base["contentQuality"] = content_quality
    base["formattingAnalysis"] = fmt_analysis

    return base

def _compose_content_analysis_prompt(content: str) -> str:
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

def _analyze_resume_content(resume_text: str, model: str) -> dict:
    try:
        response_text = _api_call(_compose_content_analysis_prompt(resume_text), model=model)
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