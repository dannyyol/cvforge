"""Pure helpers for validating and applying resume tailor actions."""

from __future__ import annotations

import copy
import uuid
from typing import Any, Dict, List, Sequence, Set, Tuple

from src.utils.html_sanitizer import sanitize_rich_text_html, sanitize_resume_data_inplace
from src.utils.skills import collect_skill_item_names, normalize_skills

MAX_ADD_SKILLS = 8
MAX_ADD_PROJECTS = 2


def collect_allowed_experience_ids(resume_data: dict) -> Set[str]:
    ids: Set[str] = set()
    raw = resume_data.get("workExperiences")
    if not isinstance(raw, list):
        return ids
    for item in raw:
        if isinstance(item, dict):
            eid = str(item.get("id", "")).strip()
            if eid:
                ids.add(eid)
    return ids


def collect_allowed_project_ids(resume_data: dict) -> Set[str]:
    ids: Set[str] = set()
    raw = resume_data.get("projects")
    if not isinstance(raw, list):
        return ids
    for item in raw:
        if isinstance(item, dict):
            pid = str(item.get("id", "")).strip()
            if pid:
                ids.add(pid)
    return ids


def build_work_experiences_context(resume_data: dict) -> List[dict]:
    context: List[dict] = []
    raw = resume_data.get("workExperiences")
    if not isinstance(raw, list):
        return context
    for item in raw:
        if not isinstance(item, dict):
            continue
        wid = str(item.get("id", "")).strip()
        if not wid:
            continue
        context.append(
            {
                "id": wid,
                "position": str(item.get("position", "")).strip(),
                "company": str(item.get("company", "")).strip(),
                "description": str(item.get("description", "")).strip(),
            }
        )
    return context


def build_projects_context(resume_data: dict) -> List[dict]:
    context: List[dict] = []
    raw = resume_data.get("projects")
    if not isinstance(raw, list):
        return context
    for item in raw:
        if not isinstance(item, dict):
            continue
        pid = str(item.get("id", "")).strip()
        if not pid:
            continue
        context.append(
            {
                "id": pid,
                "name": str(item.get("name", "")).strip(),
                "description": str(item.get("description", "")).strip(),
                "technologies": item.get("technologies", []),
                "link": str(item.get("link", "")).strip(),
            }
        )
    return context


def validate_tailor_actions(
    actions: Sequence[dict],
    resume_data: dict,
) -> Tuple[List[dict], List[str]]:
    """Return ``(valid_actions, validation_errors)``.

    Invalid actions are excluded from the valid list. Unknown experience/project
    ids and empty required fields produce validation errors (used for re-planning).
    """
    allowed_exp_ids = collect_allowed_experience_ids(resume_data)
    allowed_project_ids = collect_allowed_project_ids(resume_data)

    existing_skill_names: Set[str] = set()
    if isinstance(resume_data.get("skills"), list):
        existing_skill_names = collect_skill_item_names(resume_data["skills"])

    valid: List[dict] = []
    errors: List[str] = []
    add_skill_count = 0
    add_project_count = 0

    for index, action in enumerate(actions):
        if not isinstance(action, dict):
            errors.append(f"actions[{index}] is not an object")
            continue

        action_type = str(action.get("type", "")).strip()
        label = f"actions[{index}] ({action_type or 'unknown'})"

        if action_type == "update_summary":
            content = str(action.get("content", "")).strip()
            if not content:
                errors.append(f"{label}: content is required")
                continue
            valid.append(action)
            continue

        if action_type == "add_skill":
            name = str(action.get("name", "")).strip()
            if not name:
                errors.append(f"{label}: name is required")
                continue
            if name.lower() in existing_skill_names:
                # Harmless duplicate — drop quietly, not a replan error.
                continue
            add_skill_count += 1
            if add_skill_count > MAX_ADD_SKILLS:
                errors.append(f"{label}: too many add_skill actions (max {MAX_ADD_SKILLS})")
                continue
            valid.append(action)
            existing_skill_names.add(name.lower())
            continue

        if action_type == "update_experience_description":
            eid = str(action.get("experienceId", "")).strip()
            desc = str(action.get("description", "")).strip()
            if not eid:
                errors.append(f"{label}: experienceId is required")
                continue
            if eid not in allowed_exp_ids:
                errors.append(f"{label}: experienceId '{eid}' is not an existing experience id")
                continue
            if not desc:
                errors.append(f"{label}: description is required")
                continue
            valid.append(action)
            continue

        if action_type == "update_project_description":
            pid = str(action.get("projectId", "")).strip()
            desc = str(action.get("description", "")).strip()
            if not pid:
                errors.append(f"{label}: projectId is required")
                continue
            if pid not in allowed_project_ids:
                errors.append(f"{label}: projectId '{pid}' is not an existing project id")
                continue
            if not desc:
                errors.append(f"{label}: description is required")
                continue
            valid.append(action)
            continue

        if action_type == "add_project":
            name = str(action.get("name", "")).strip()
            desc = str(action.get("description", "")).strip()
            if not name or not desc:
                errors.append(f"{label}: name and description are required")
                continue
            add_project_count += 1
            if add_project_count > MAX_ADD_PROJECTS:
                errors.append(f"{label}: too many add_project actions (max {MAX_ADD_PROJECTS})")
                continue
            valid.append(action)
            continue

        errors.append(f"{label}: unsupported action type")

    return valid, errors


def apply_tailor_actions(resume_data: dict, actions: Sequence[dict]) -> dict:
    """Apply validated tailor actions and return a new resume_data dict."""
    rd: Dict[str, Any] = copy.deepcopy(resume_data) if isinstance(resume_data, dict) else {}

    def _set_section_visible(section_type: str) -> None:
        sections = rd.get("sections")
        if not isinstance(sections, list):
            return
        for item in sections:
            if not isinstance(item, dict):
                continue
            if str(item.get("type", "")).strip().lower() == section_type.lower():
                item["is_visible"] = True
                item["isVisible"] = True
                return

    if "professionalSummary" not in rd or not isinstance(rd.get("professionalSummary"), dict):
        rd["professionalSummary"] = {}
    if "skills" not in rd or not isinstance(rd.get("skills"), list):
        rd["skills"] = []
    if "projects" not in rd or not isinstance(rd.get("projects"), list):
        rd["projects"] = []

    existing_skill_names: Set[str] = set()
    if isinstance(rd.get("skills"), list):
        rd["skills"] = normalize_skills(rd["skills"])
        existing_skill_names = collect_skill_item_names(rd["skills"])

    exp_by_id: Dict[str, dict] = {}
    if isinstance(rd.get("workExperiences"), list):
        for exp in rd["workExperiences"]:
            if isinstance(exp, dict):
                eid = str(exp.get("id", "")).strip()
                if eid:
                    exp_by_id[eid] = exp

    project_by_id: Dict[str, dict] = {}
    if isinstance(rd.get("projects"), list):
        for proj in rd["projects"]:
            if isinstance(proj, dict):
                pid = str(proj.get("id", "")).strip()
                if pid:
                    project_by_id[pid] = proj

    for action in actions:
        if not isinstance(action, dict):
            continue
        action_type = str(action.get("type", "")).strip()

        if action_type == "update_summary":
            content = sanitize_rich_text_html(str(action.get("content", "")).strip())
            if content:
                rd["professionalSummary"]["content"] = content
            continue

        if action_type == "add_skill":
            name = str(action.get("name", "")).strip()
            if not name or name.lower() in existing_skill_names:
                continue
            category = str(action.get("category", "")).strip()
            skills_list = normalize_skills(rd.get("skills") or [])
            target = None
            if category:
                for skill in skills_list:
                    if str(skill.get("name", "")).strip().lower() == category.lower():
                        target = skill
                        break
            if target is None and not category:
                for skill in skills_list:
                    if not str(skill.get("name", "")).strip():
                        target = skill
                        break
            if target is not None:
                items = list(target.get("items") or [])
                items.append(name)
                target["items"] = items
            else:
                skills_list.append(
                    {
                        "id": str(uuid.uuid4()),
                        "name": category,
                        "items": [name],
                        "level": "",
                    }
                )
            rd["skills"] = skills_list
            existing_skill_names.add(name.lower())
            _set_section_visible("skills")
            continue

        if action_type == "update_experience_description":
            eid = str(action.get("experienceId", "")).strip()
            desc = sanitize_rich_text_html(str(action.get("description", "")).strip())
            if eid and desc and eid in exp_by_id:
                exp_by_id[eid]["description"] = desc
                _set_section_visible("experience")
            continue

        if action_type == "update_project_description":
            pid = str(action.get("projectId", "")).strip()
            desc = sanitize_rich_text_html(str(action.get("description", "")).strip())
            if pid and desc and pid in project_by_id:
                project_by_id[pid]["description"] = desc
                _set_section_visible("projects")
            continue

        if action_type == "add_project":
            name = str(action.get("name", "")).strip()
            desc = sanitize_rich_text_html(str(action.get("description", "")).strip())
            if not name or not desc:
                continue
            technologies_raw = action.get("technologies", [])
            technologies: List[str] = []
            if isinstance(technologies_raw, list):
                technologies = [str(x).strip() for x in technologies_raw if str(x).strip()]
            link = str(action.get("link", "")).strip()
            rd["projects"].append(
                {
                    "id": str(uuid.uuid4()),
                    "name": name,
                    "description": desc,
                    "technologies": technologies,
                    "link": link,
                    "startDate": "",
                    "endDate": "",
                }
            )
            _set_section_visible("projects")
            continue

    sanitize_resume_data_inplace(rd)
    return rd


def build_plan_actions_prompt(
    *,
    tone: str,
    job_title: str,
    job_description: str,
    suggestions: list,
    missing_keywords: list,
    resume_text: str,
    existing_skill_names: Sequence[str],
    work_experiences_context: list,
    projects_context: list,
    validation_errors: Sequence[str] | None = None,
) -> str:
    retry_block = ""
    if validation_errors:
        joined = "\n".join(f"- {err}" for err in validation_errors)
        retry_block = (
            "\nPrevious action plan failed validation. Fix these issues and only use "
            "allowed experience/project ids:\n"
            f"{joined}\n"
        )

    return (
        "You are an expert resume writer.\n"
        "Generate a machine-applicable list of actions that apply the job-match suggestions to the resume data.\n\n"
        "Hard rules:\n"
        "- Do not fabricate experience, projects, employers, dates, or achievements.\n"
        "- Only update existing experiences/projects by using an existing id from the provided lists.\n"
        "- You may add missing keywords as Skills, but keep the level conservative (e.g. \"Familiar\").\n"
        "- Keep output concise and ATS-friendly.\n"
        "- Action types must be one of: update_summary, add_skill, "
        "update_experience_description, update_project_description, add_project.\n"
        f"{retry_block}\n"
        f"Tone: {tone}\n"
        f"Role: {job_title}\n\n"
        "Job Description:\n"
        f'"""\n{job_description}\n"""\n\n'
        "Job Match Suggestions:\n"
        f"{suggestions}\n\n"
        "Missing Keywords:\n"
        f"{missing_keywords}\n\n"
        "Resume (plain text):\n"
        f'"""\n{resume_text}\n"""\n\n'
        "Existing Skills (names only):\n"
        f"{sorted(existing_skill_names)}\n\n"
        "Work Experiences (allowed ids):\n"
        f"{work_experiences_context}\n\n"
        "Projects (allowed ids):\n"
        f"{projects_context}\n"
    )
