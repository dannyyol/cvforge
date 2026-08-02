"""Shared Pydantic schemas for structured LLM outputs."""

from __future__ import annotations

from typing import List, Literal

from pydantic import BaseModel, Field, field_validator


def _clamp_score(value: float) -> float:
    try:
        num = float(value)
    except (TypeError, ValueError):
        return 0.0
    return min(100.0, max(0.0, num))


# --- Job match ---


class JobMatchSuggestion(BaseModel):
    section: str = Field(description="Resume section to improve, e.g. Skills, Summary, Experience")
    suggestion: str = Field(description="Specific, actionable advice for that section")
    priority: Literal["high", "medium", "low"] = "medium"

    @field_validator("priority", mode="before")
    @classmethod
    def normalize_priority(cls, value: object) -> str:
        priority = str(value or "medium").strip().lower()
        if priority not in {"high", "medium", "low"}:
            return "medium"
        return priority


class JobMatchResult(BaseModel):
    match_score: float = Field(description="Overall fit score from 0 to 100")
    summary: str = Field(default="", description="1-2 sentence explanation of the score")
    matched_keywords: List[str] = Field(default_factory=list)
    missing_keywords: List[str] = Field(default_factory=list)
    suggestions: List[JobMatchSuggestion] = Field(default_factory=list)

    @field_validator("match_score", mode="before")
    @classmethod
    def clamp_match_score(cls, value: object) -> float:
        return _clamp_score(value)  # type: ignore[arg-type]

    def to_analyse_dict(self) -> dict:
        return {
            "match_score": _clamp_score(self.match_score),
            "summary": str(self.summary or "").strip(),
            "matched_keywords": [str(k).strip() for k in self.matched_keywords if str(k).strip()],
            "missing_keywords": [str(k).strip() for k in self.missing_keywords if str(k).strip()],
            "suggestions": [
                {
                    "section": s.section.strip(),
                    "suggestion": s.suggestion.strip(),
                    "priority": s.priority,
                }
                for s in self.suggestions
                if s.section.strip() and s.suggestion.strip()
            ],
        }


# --- Resume parse ---


class PersonalDetails(BaseModel):
    fullName: str = ""
    email: str = ""
    phone: str = ""
    address: str = ""
    jobTitle: str = ""
    website: str = ""
    linkedin: str = ""
    github: str = ""


class ProfessionalSummary(BaseModel):
    content: str = ""


class WorkExperienceItem(BaseModel):
    id: str = ""
    company: str = ""
    position: str = ""
    location: str = ""
    startDate: str = ""
    endDate: str = ""
    current: bool = False
    description: str = ""


class EducationItem(BaseModel):
    id: str = ""
    institution: str = ""
    degree: str = ""
    fieldOfStudy: str = ""
    startDate: str = ""
    endDate: str = ""
    current: bool = False
    description: str = ""


class SkillItem(BaseModel):
    id: str = ""
    name: str = ""
    items: List[str] = Field(default_factory=list)
    level: str = ""


class ProjectItem(BaseModel):
    id: str = ""
    name: str = ""
    description: str = ""
    technologies: List[str] = Field(default_factory=list)
    link: str = ""
    startDate: str = ""
    endDate: str = ""


class CertificationItem(BaseModel):
    id: str = ""
    name: str = ""
    issuer: str = ""
    issueDate: str = ""
    expiryDate: str = ""
    credentialId: str = ""
    link: str = ""


class AwardItem(BaseModel):
    id: str = ""
    title: str = ""
    issuer: str = ""
    date: str = ""
    description: str = ""


class PublicationItem(BaseModel):
    id: str = ""
    title: str = ""
    publisher: str = ""
    date: str = ""
    description: str = ""
    link: str = ""


class NamedDescriptionItem(BaseModel):
    id: str = ""
    name: str = ""
    description: str = ""
    date: str = ""
    location: str = ""
    url: str = ""


class WebsiteItem(BaseModel):
    id: str = ""
    name: str = ""
    url: str = ""
    description: str = ""
    date: str = ""
    location: str = ""


class ParsedResumeData(BaseModel):
    personalDetails: PersonalDetails = Field(default_factory=PersonalDetails)
    professionalSummary: ProfessionalSummary = Field(default_factory=ProfessionalSummary)
    workExperiences: List[WorkExperienceItem] = Field(default_factory=list)
    education: List[EducationItem] = Field(default_factory=list)
    skills: List[SkillItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    certifications: List[CertificationItem] = Field(default_factory=list)
    awards: List[AwardItem] = Field(default_factory=list)
    publications: List[PublicationItem] = Field(default_factory=list)
    languages: List[NamedDescriptionItem] = Field(default_factory=list)
    interests: List[NamedDescriptionItem] = Field(default_factory=list)
    websites: List[WebsiteItem] = Field(default_factory=list)
    references: List[NamedDescriptionItem] = Field(default_factory=list)


# --- Tailor actions ---
# Flat action item (not a discriminated Union): OpenAI json_schema rejects oneOf.


class TailorActionItem(BaseModel):
    type: Literal[
        "update_summary",
        "add_skill",
        "update_experience_description",
        "update_project_description",
        "add_project",
    ]
    content: str = ""
    name: str = ""
    category: str = ""
    experienceId: str = ""
    projectId: str = ""
    description: str = ""
    technologies: List[str] = Field(default_factory=list)
    link: str = ""

    def to_action_dict(self) -> dict:
        action_type = self.type
        if action_type == "update_summary":
            return {"type": action_type, "content": self.content}
        if action_type == "add_skill":
            return {"type": action_type, "name": self.name, "category": self.category}
        if action_type == "update_experience_description":
            return {
                "type": action_type,
                "experienceId": self.experienceId,
                "description": self.description,
            }
        if action_type == "update_project_description":
            return {
                "type": action_type,
                "projectId": self.projectId,
                "description": self.description,
            }
        return {
            "type": action_type,
            "name": self.name,
            "description": self.description,
            "technologies": list(self.technologies or []),
            "link": self.link,
        }


# Back-compat aliases used by tests / callers constructing typed actions.
UpdateSummaryAction = TailorActionItem
AddSkillAction = TailorActionItem
UpdateExperienceDescriptionAction = TailorActionItem
UpdateProjectDescriptionAction = TailorActionItem
AddProjectAction = TailorActionItem


class TailorActionsPlan(BaseModel):
    actions: List[TailorActionItem] = Field(default_factory=list)

    def to_action_dicts(self) -> List[dict]:
        return [action.to_action_dict() for action in self.actions]


# --- CV review ---


class SectionReview(BaseModel):
    name: str = ""
    score: float = 0.0
    strengths: List[str] = Field(default_factory=list)
    areas_to_improve: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)

    @field_validator("score", mode="before")
    @classmethod
    def clamp_section_score(cls, value: object) -> float:
        return _clamp_score(value)  # type: ignore[arg-type]

    def to_analyse_dict(self, fallback_name: str) -> dict:
        return {
            "name": str(self.name or fallback_name),
            "score": _clamp_score(self.score),
            "strengths": [str(s) for s in self.strengths],
            "areas_to_improve": [str(s) for s in self.areas_to_improve],
            "suggestions": [str(s) for s in self.suggestions],
        }


class ScoredSummaryBlock(BaseModel):
    score: float = 0.0
    summary: List[str] = Field(default_factory=list)

    @field_validator("score", mode="before")
    @classmethod
    def clamp_block_score(cls, value: object) -> float:
        return _clamp_score(value)  # type: ignore[arg-type]


class ContentReview(BaseModel):
    atsCompatibility: ScoredSummaryBlock = Field(default_factory=ScoredSummaryBlock)
    contentQuality: ScoredSummaryBlock = Field(default_factory=ScoredSummaryBlock)
    formattingAnalysis: ScoredSummaryBlock = Field(default_factory=ScoredSummaryBlock)

    def to_analyse_dict(self) -> dict:
        def _block(block: ScoredSummaryBlock) -> dict:
            return {
                "score": _clamp_score(block.score),
                "summary": [str(s) for s in block.summary],
            }

        return {
            "atsCompatibility": _block(self.atsCompatibility),
            "contentQuality": _block(self.contentQuality),
            "formattingAnalysis": _block(self.formattingAnalysis),
        }


class SmokeStructuredResult(BaseModel):
    score: float = Field(description="Numeric score from 0 to 100")
    summary: str = Field(description="Short summary of the result")
