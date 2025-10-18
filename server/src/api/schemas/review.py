from typing import List, Dict, Optional, Any
from pydantic import BaseModel


class CVReviewRequest(BaseModel):
    resume_text: str
    model: Optional[str] = None  # Optional override; defaults to env OLLAMA_MODEL


class CVSection(BaseModel):
    name: str
    score: float
    suggestions: List[str] = []


class ATSCompatibility(BaseModel):
    score: float
    summary: List[str] = []


class CVReviewResponse(BaseModel):
    overall_score: float
    categories: Dict[str, float]
    strengths: List[str]
    areas_to_improve: List[str]
    sections: List[CVSection]
    atsCompatibility: ATSCompatibility


class CVReviewRequestFlexible(BaseModel):
    resume_text: Optional[str] = None
    resume: Optional[Dict[str, Any]] = None
    sections: Optional[Dict[str, Any]] = None
    model: Optional[str] = None