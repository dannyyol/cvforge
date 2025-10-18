import os
import re
import json
from typing import Dict, List, Tuple, Optional
import requests

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


def _call_ollama(prompt: str, model: str) -> str:
    url = f"{OLLAMA_URL}/api/generate"
    payload = {"model": model, "prompt": prompt, "stream": False}
    resp = requests.post(url, json=payload, timeout=60)
    resp.raise_for_status()
    data = resp.json()
    return data.get("response", "")


# module functions around ATS analysis and payload flow

def _analyze_section(name: str, content: str, model: str) -> dict:
    try:
        response_text = _call_ollama(_compose_section_prompt(name, content), model=model)
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

def _compose_ats_prompt(content: str) -> str:
    return (
        "You are an ATS (Applicant Tracking System) compliance evaluator.\n\n"
        "Analyze the full resume text and return ONLY valid JSON with this structure:\n"
        "{\n"
        '  "atsCompatibility": {\n'
        '    "score": number,  // 0-100\n'
        '    "summary": [string]\n'
        "  }\n"
        "}\n\n"
        "Focus ONLY on ATS-related criteria:\n"
        "- Standard section headings\n"
        "- Simple, ATS-friendly formatting (no graphics or complex tables)\n"
        "- Use of relevant industry keywords\n"
        "- Clarity and specificity of job titles\n\n"
        "Provide the summary as concise bullet-style strings, each describing a specific ATS observation.\n\n"
        "Example summary:\n"
        '["Standard section headings used", '
        '"Simple, ATS-friendly formatting", '
        '"No graphics or complex tables", '
        '"Some industry keywords missing", '
        '"Could benefit from more specific job titles"]\n\n'
        "Resume to analyze:\n"
        f"\"\"\"\n{content}\n\"\"\"\n"
    )


def _analyze_ats(resume_text: str, model: str) -> dict:
    try:
        response_text = _call_ollama(_compose_ats_prompt(resume_text), model=model)
        parsed = _extract_json(response_text) or {}
        data = parsed.get("atsCompatibility", parsed) or {}
        return {
            "score": _safe_number(data.get("score", 0)),
            "summary": list(map(str, data.get("summary", []))),
        }
    except Exception:
        return {
            "score": 0.0,
            "summary": [],
        }


def _build_resume_text_from_nested(sections_payload: dict) -> str:
    sections_payload = sections_payload or {}
    flat = flatten_resume_sections(sections_payload)
    lines: List[str] = []
    for name in sections_payload:
        content = flat.get(name, "").strip()
        if content:
            lines.append(f"{name}\n{content}")
    return "\n\n".join(lines).strip()


def review_cv(resume_text: str, model: Optional[str] = None) -> dict:
    sections = _parse_sections(resume_text or "")
    base = review_cv_from_sections(sections, model=model)
    ats = _analyze_ats(resume_text or "", (model or DEFAULT_MODEL))
    base["atsCompatibility"] = ats
    return base


def review_cv_from_sections(sections: Dict[str, str], model: Optional[str] = None) -> dict:
    model = model or DEFAULT_MODEL
    analyzed: List[dict] = []
    for name in sections: #["Summary", "Experience", "Education", "Skills", "Projects", "Certifications"]:
        if name in sections and sections[name].strip():
            analyzed.append(_analyze_section(name, sections[name], model))

    if not analyzed:
        analyzed.append(_analyze_section("Summary", "\n".join(sections.values()), model))

    cat_totals = {"ATS Compatibility": 0.0, "Content Quality": 0.0, "Formatting": 0.0}
    cat_counts = {"ATS Compatibility": 0, "Content Quality": 0, "Formatting": 0}
    strengths: List[str] = []
    improvements: List[str] = []
    final_sections: List[dict] = []

    for sec in analyzed:
        ss = sec.get("section_scores", {})
        for k in cat_totals.keys():
            cat_totals[k] += _safe_number(ss.get(k, 0), 0)
            cat_counts[k] += 1

        final_sections.append(
            {"name": sec["name"], "score": _safe_number(sec["score"], 0), "suggestions": sec.get("suggestions", [])}
        )
        strengths.extend(sec.get("strengths", []))
        improvements.extend(sec.get("areas_to_improve", []))

    categories = {
        k: round(cat_totals[k] / cat_counts[k], 1) if cat_counts[k] > 0 else 0.0 for k in cat_totals.keys()
    }
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
    # Build resume text first, then analyze ATS compatibility
    resume_text_full = _build_resume_text_from_nested(sections_payload)
    ats = _analyze_ats(resume_text_full, model)
    # Then flatten and aggregate
    sections = flatten_resume_sections(sections_payload)
    base = review_cv_from_sections(sections, model=model)
    base["atsCompatibility"] = ats
    return base


if __name__ == "__main__":
    sample_resume = """
    Jane Doe
    Email: jane.doe@example.com | LinkedIn: linkedin.com/in/janedoe

    Summary
    Product-focused software engineer with 6+ years building scalable web apps.

    Experience
    Senior Software Engineer, Acme Corp (2021–Present)
    - Led migration to microservices; reduced deployment time by 40%.
    Software Engineer, Beta Inc (2018–2021)
    - Built real-time analytics dashboard used by 200+ clients.

    Education
    B.S. in Computer Science, University of Somewhere, 2018

    Skills
    Python, FastAPI, React, TypeScript, AWS, Docker, PostgreSQL, CI/CD

    Projects
    Portfolio site, internal release management tool, OSS contributions

    Certifications
    AWS Certified Developer, Scrum Master
    """
    result = review_cv(sample_resume)
    print(json.dumps(result, indent=2))