import uuid
from typing import Any, Dict, Optional

from langchain_core.language_models.chat_models import BaseChatModel
from loguru import logger

from src.services.ai.llm.models import ainvoke_structured, build_chat_model
from src.services.ai.llm.schemas import ParsedResumeData


class AIResumeParser:
    @staticmethod
    def _build_prompt(text: str) -> str:
        return (
            "You are an expert Resume Parser. Extract structured data from the provided resume text.\n\n"
            "Instructions:\n"
            "1. Generate unique UUIDs for all 'id' fields when possible "
            "(empty ids will be filled later).\n"
            "2. If a field is missing in the text, return empty string or empty list.\n"
            "3. Extract all available sections. If a section like 'volunteering' is present "
            "but not in schema, put it in 'projects' or ignore it.\n"
            "4. For 'personalDetails', infer 'fullName' accurately (e.g. split across lines).\n"
            "5. Map languages, interests, websites, and references to the schema fields.\n"
            "6. skills.items should be individual skill names under an optional category name.\n\n"
            "Resume Text:\n"
            f'"""\n{text}\n"""'
        )

    @staticmethod
    async def parse_with_model(text: str, model: BaseChatModel) -> Dict[str, Any]:
        """Parse resume text using a LangChain chat model with structured output."""
        prompt = AIResumeParser._build_prompt(text)
        try:
            parsed = await ainvoke_structured(model, ParsedResumeData, prompt)
            parsed_data = parsed.model_dump()
            AIResumeParser._ensure_ids(parsed_data)
            AIResumeParser._normalize_data(parsed_data)
            return parsed_data
        except Exception as e:
            logger.error(f"AI Parsing failed: {str(e)}")
            raise

    @staticmethod
    async def parse_with_client(text: str, client: Any, model: str) -> Dict[str, Any]:
        """Deprecated: prefer ``parse_with_model``. Kept for transitional callers."""
        raise TypeError(
            "parse_with_client no longer accepts AsyncLLMClient. "
            "Use AIResumeParser.parse_with_model(text, chat_model) instead."
        )

    @staticmethod
    async def parse_with_ai(
        text: str,
        provider: str,
        api_key: Optional[str],
        base_url: str,
        model: str,
    ) -> Dict[str, Any]:
        """Legacy wrapper for parsing resume text using provider credentials."""
        chat_model = build_chat_model(
            provider=provider,
            model_id=model,
            base_url=base_url,
            api_key=api_key,
        )
        return await AIResumeParser.parse_with_model(text, chat_model)

    @staticmethod
    def _normalize_data(data: Dict[str, Any]):
        """Ensures all required fields are present with default values."""

        if "education" in data and isinstance(data["education"], list):
            for item in data["education"]:
                if isinstance(item, dict):
                    item.setdefault("institution", "")
                    item.setdefault("degree", "")
                    item.setdefault("fieldOfStudy", "")
                    item.setdefault("startDate", "")
                    item.setdefault("endDate", "")
                    item.setdefault("current", False)
                    item.setdefault("description", "")

        if "workExperiences" in data and isinstance(data["workExperiences"], list):
            for item in data["workExperiences"]:
                if isinstance(item, dict):
                    item.setdefault("company", "")
                    item.setdefault("position", "")
                    item.setdefault("location", "")
                    item.setdefault("startDate", "")
                    item.setdefault("endDate", "")
                    item.setdefault("current", False)
                    item.setdefault("description", "")

        if "skills" in data and isinstance(data["skills"], list):
            from src.utils.skills import normalize_skills

            data["skills"] = normalize_skills(data["skills"])

        if "projects" in data and isinstance(data["projects"], list):
            for item in data["projects"]:
                if isinstance(item, dict):
                    item.setdefault("name", "")
                    item.setdefault("description", "")
                    item.setdefault("technologies", [])
                    item.setdefault("link", "")
                    item.setdefault("startDate", "")
                    item.setdefault("endDate", "")

        if "certifications" in data and isinstance(data["certifications"], list):
            for item in data["certifications"]:
                if isinstance(item, dict):
                    item.setdefault("name", "")
                    item.setdefault("issuer", "")
                    item.setdefault("issueDate", "")
                    item.setdefault("link", "")

        if "awards" in data and isinstance(data["awards"], list):
            for item in data["awards"]:
                if isinstance(item, dict):
                    item.setdefault("title", "")
                    item.setdefault("issuer", "")
                    item.setdefault("date", "")
                    item.setdefault("description", "")

        if "publications" in data and isinstance(data["publications"], list):
            for item in data["publications"]:
                if isinstance(item, dict):
                    item.setdefault("title", "")
                    item.setdefault("publisher", "")
                    item.setdefault("date", "")
                    item.setdefault("description", "")
                    item.setdefault("link", "")

        custom_lists = ["languages", "interests", "websites", "references", "volunteering", "custom"]
        for field in custom_lists:
            if field in data and isinstance(data[field], list):
                for item in data[field]:
                    if isinstance(item, dict):
                        item.setdefault("name", "")
                        item.setdefault("description", "")
                        item.setdefault("date", "")
                        item.setdefault("location", "")
                        item.setdefault("url", "")

    @staticmethod
    def _ensure_ids(data: Dict[str, Any]):
        """Ensures all list items have an ID."""
        list_fields = [
            "workExperiences", "education", "skills", "projects",
            "certifications", "awards", "publications",
            "languages", "interests", "websites", "references",
        ]

        for field in list_fields:
            if field in data and isinstance(data[field], list):
                for item in data[field]:
                    if isinstance(item, dict) and (not item.get("id") or item["id"] == "generate-uuid"):
                        item["id"] = str(uuid.uuid4())
