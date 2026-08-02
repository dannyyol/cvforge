from loguru import logger
from langchain_core.language_models.chat_models import BaseChatModel

from src.services.ai.guardrails import enforce_safe_user_inputs
from src.services.ai.llm.models import ainvoke_structured
from src.services.ai.llm.schemas import JobMatchResult


class JobMatchPromptBuilder:
    @staticmethod
    def build_prompt(job_title: str, job_description: str, resume_text: str) -> str:
        return (
            "You are an expert career coach and ATS specialist.\n"
            "Compare the resume below against the job description and return a detailed match analysis.\n\n"
            "Rules:\n"
            "- match_score must reflect how well the resume satisfies the role requirements (0-100)\n"
            "- matched_keywords: list individual terms found in BOTH the resume and JD; "
            "not phrases longer than 3 words\n"
            "- missing_keywords: only include JD terms that genuinely matter for this role "
            "and are absent from the resume\n"
            "- suggestions: 3-5 items ordered by priority descending; be specific, not generic\n"
            "- priority must be one of: high, medium, low\n"
            "- Do NOT fabricate experience — only suggest adding things the candidate may genuinely have\n\n"
            f"Job Title: {job_title}\n\n"
            "Job Description:\n"
            f'"""\n{job_description}\n"""\n\n'
            "Resume:\n"
            f'"""\n{resume_text}\n"""'
        )


class JobMatchService:
    def __init__(self, model: BaseChatModel):
        self._model = model

    async def analyse(
        self,
        job_title: str,
        job_description: str,
        resume_text: str,
    ) -> dict:
        enforce_safe_user_inputs(job_title, job_description)
        prompt = JobMatchPromptBuilder.build_prompt(job_title, job_description, resume_text)

        try:
            result = await ainvoke_structured(self._model, JobMatchResult, prompt)
        except Exception as exc:
            logger.error(f"JobMatchService: AI call failed — {exc}")
            raise

        return result.to_analyse_dict()
