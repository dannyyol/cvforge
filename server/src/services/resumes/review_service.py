from typing import Dict, List, Optional

from langchain_core.language_models.chat_models import BaseChatModel
from loguru import logger

from src.services.ai.ai_clients_service import AIConfigurationError, AIProviderError
from src.services.ai.llm.models import ainvoke_structured
from src.services.ai.llm.schemas import ContentReview, SectionReview
from src.services.ai.workflows.review_merge import (
    assemble_section_base,
    soft_failed_section,
    weighted_section_score,
)


class CVReviewConfig:
    def __init__(self, active_model_id: str, provider: str, base_url: str, api_key: Optional[str] = None, model_id_map: Optional[str] = None):
        self.active_model_id = active_model_id
        self.provider = provider
        self.base_url = base_url
        self.api_key = api_key
        self.model_name = model_id_map or active_model_id


class PromptBuilder:
    @staticmethod
    def compose_section_prompt(name: str, content: str) -> str:
        return (
            f"You are a CV reviewer. Analyze the '{name}' section below and provide feedback.\n\n"
            "Guidelines:\n"
            "- Score based on relevance, clarity, and impact (0-100)\n"
            "- Strengths: what works well\n"
            "- Areas to improve: specific weaknesses\n"
            "- Suggestions: actionable improvements\n"
            f"- Set name to exactly '{name}'\n\n"
            f"Section content:\n\"\"\"\n{content}\n\"\"\"\n"
        )

    @staticmethod
    def compose_content_analysis_prompt(content: str) -> str:
        return (
            "You are a CV reviewer. In ONE pass, evaluate the resume for:\n"
            "- ATS Compatibility\n"
            "- Content Quality\n"
            "- Formatting\n\n"
            "Guidelines:\n"
            "- Scores are 0-100\n"
            "- ATS: section headings, simple formatting, keyword use, clear titles\n"
            "- Content: measurable outcomes, specificity, coverage of key sections, action verbs\n"
            "- Formatting: consistency in headings, bullets, whitespace, punctuation, date ranges\n"
            "- Provide concise bullet-style strings for each summary\n\n"
            "Resume to analyze:\n"
            f"\"\"\"\n{content}\n\"\"\"\n"
        )


class SectionAnalyzer:
    def __init__(self, model: BaseChatModel):
        self.model = model

    async def analyze_section(self, name: str, content: str, model: str = "") -> dict:
        try:
            prompt = PromptBuilder.compose_section_prompt(name, content)
            result = await ainvoke_structured(self.model, SectionReview, prompt)
            return result.to_analyse_dict(fallback_name=name)
        except (AIConfigurationError, AIProviderError):
            raise
        except Exception as exc:
            logger.warning("Section analysis failed for '{}': {}", name, str(exc))
            return soft_failed_section(name, "Section analysis unavailable")


class ResumeProcessor:
    @staticmethod
    def _join_nonempty(parts):
        return "\n".join([p for p in parts if p and str(p).strip()])
    @staticmethod
    def flatten_resume_sections(sections_payload: dict) -> Dict[str, str]:
        sections_payload = sections_payload or {}
        prof = sections_payload.get("professionalSummary") or {}
        summary = prof.get("content") or ""
        exp_items = sections_payload.get("workExperiences") or []
        exp_parts: List[str] = []
        for item in exp_items:
            title = item.get("position", "")
            company = item.get("company", "")
            location = item.get("location", "")
            start = item.get("startDate", "")
            end = item.get("endDate", "")
            current = item.get("current", False)
            date_range = f"{start}–{'Present' if current else end}".strip("–")
            header = ", ".join([p for p in [title, company] if p])
            tail = " — ".join([p for p in [location, date_range] if p])
            line1 = " — ".join([p for p in [header, tail] if p])
            desc = item.get("description", "")
            exp_parts.append(ResumeProcessor._join_nonempty([line1, desc]).strip())
        experience = "\n\n".join([p for p in exp_parts if p])
        edu_items = sections_payload.get("education") or []
        edu_parts: List[str] = []
        for item in edu_items:
            degree = item.get("degree", "")
            field = item.get("fieldOfStudy", "")
            inst = item.get("institution", "")
            start = item.get("startDate", "")
            end = item.get("endDate", "")
            line = ", ".join([p for p in [degree, field] if p])
            tail = " — ".join([p for p in [inst, f"{start}–{end}".strip('–')] if p])
            edu_parts.append(ResumeProcessor._join_nonempty([" ".join([line, tail]).strip()]))
        education = "\n\n".join([p for p in edu_parts if p])
        skill_items = sections_payload.get("skills") or []
        from src.utils.skills import flatten_skills_text

        skills = flatten_skills_text(skill_items)
        proj_items = sections_payload.get("projects") or []
        proj_parts: List[str] = []
        for item in proj_items:
            title = item.get("name", "")
            desc = item.get("description", "")
            start = item.get("startDate", "")
            end = item.get("endDate", "")
            url = item.get("link", "")
            line = " — ".join([p for p in [title, desc] if p])
            tail = " ".join([p for p in [f"({start}–{end})".strip('()–'), url] if p])
            proj_parts.append(ResumeProcessor._join_nonempty([line, tail]).strip())
        projects = "\n\n".join([p for p in proj_parts if p])
        cert_items = sections_payload.get("certifications") or []
        cert_parts: List[str] = []
        for item in cert_items:
            name = item.get("name", "")
            issuer = item.get("issuer", "")
            issue_date = item.get("issueDate", "")
            expiry_date = item.get("expiryDate", "")
            line = " — ".join([p for p in [name, issuer] if p])
            tail = f"{issue_date}–{expiry_date}".strip("–")
            cert_parts.append(ResumeProcessor._join_nonempty([line, tail]).strip())
        certifications = "\n\n".join([p for p in cert_parts if p])
        lang_items = sections_payload.get("languages") or []
        lang_parts: List[str] = []
        for item in lang_items:
            language = item.get("language", "")
            proficiency = item.get("proficiency", "")
            entry = " — ".join([p for p in [language, proficiency] if p]).strip()
            if entry:
                lang_parts.append(entry)
        languages = ", ".join([p for p in lang_parts if p])
        award_items = sections_payload.get("awards") or []
        award_parts: List[str] = []
        for item in award_items:
            title = item.get("title", "")
            issuer = item.get("issuer", "")
            year = item.get("date", "")
            description = item.get("description", "")
            line = " — ".join([p for p in [title, issuer] if p])
            tail = " ".join([p for p in [year, description] if p])
            award_parts.append(ResumeProcessor._join_nonempty([line, tail]).strip())
        awards = "\n\n".join([p for p in award_parts if p])
        pub_items = sections_payload.get("publications") or []
        pub_parts: List[str] = []
        for item in pub_items:
            title = item.get("title", "")
            publisher = item.get("publisher", "")
            year = item.get("date", "")
            raw_url = item.get("link", "")
            url = str(raw_url).replace("`", "").strip()
            line = " — ".join([p for p in [title, publisher] if p])
            tail = " ".join([p for p in [f"({year})".strip('()'), url] if p])
            pub_parts.append(ResumeProcessor._join_nonempty([line, tail]).strip())
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
        
    @staticmethod
    def build_resume_text_from_nested(sections_payload: dict) -> str:
        sections_payload = sections_payload or {}
        flat = ResumeProcessor.flatten_resume_sections(sections_payload)
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

class ContentAnalyzer:
    def __init__(self, model: BaseChatModel):
        self.model = model

    async def analyze_resume_content(self, resume_text: str, model: str = "") -> dict:
        try:
            prompt = PromptBuilder.compose_content_analysis_prompt(resume_text)
            result = await ainvoke_structured(self.model, ContentReview, prompt)
            return result.to_analyse_dict()
        except (AIConfigurationError, AIProviderError):
            raise
        except Exception as exc:
            logger.warning("Combined analysis failed; falling back to separate calls: {}", str(exc))
            from src.services.ai.workflows.review_merge import empty_content_review

            return empty_content_review()


class CVReviewService:
    def __init__(self, model: BaseChatModel, config: CVReviewConfig):
        self.model = model
        self.config = config
        self.section_analyzer = SectionAnalyzer(model)
        self.content_analyzer = ContentAnalyzer(model)

    def _weighted_section_score(self, sections: List[dict]) -> float:
        return weighted_section_score(sections)

    async def review_cv_from_sections(self, sections: Dict[str, str], model: Optional[str] = None) -> dict:
        model = model or self.config.model_name
        
        analyzed: List[dict] = []
        for name in sections:
            if name in sections and sections[name].strip():
                analyzed.append(await self.section_analyzer.analyze_section(name, sections[name], model))
        if not analyzed:
            analyzed.append(await self.section_analyzer.analyze_section("Summary", "\n".join(sections.values()), model))
        return assemble_section_base(analyzed)

    async def review_cv_payload(self, payload: dict, is_platform_mode: Optional[bool] = None) -> dict:
        from src.services.ai.workflows.review import run_cv_review

        return await run_cv_review(
            chat_model=self.model,
            payload=payload,
            is_platform_mode=is_platform_mode,
        )

def create_cv_review_service(model: BaseChatModel, model_id: str) -> CVReviewService:
    config = CVReviewConfig(
        active_model_id="dynamic",
        provider="dynamic",
        base_url="",
        api_key="",
        model_id_map=model_id
    )
    return CVReviewService(model, config)
