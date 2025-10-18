from fastapi import APIRouter, HTTPException
from ..schemas.review import CVReviewRequest, CVReviewResponse
from typing import Any, Dict
from ...services.cv_review import review_cv, review_cv_payload

router = APIRouter()

@router.post("/review")
def review_resume(payload: Dict[str, Any]):
    try:
        if payload.get("sections"):
            return review_cv_payload(payload)

        resume_text = payload.get("resume_text")
        if resume_text:
            return review_cv(resume_text)

        raise HTTPException(status_code=400, detail="Provide 'sections' or 'resume_text'.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Review failed: {str(e)}")