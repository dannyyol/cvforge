from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from typing import Any, Dict
from uuid import uuid4
import time
import httpx

from ...config import get_settings

router = APIRouter()

_STORE: Dict[str, Dict[str, Any]] = {}

def _put_token(token: str, data: Dict[str, Any]) -> None:
    settings = get_settings()
    _STORE[token] = {
        "data": data,
        "expires": time.time() + int(settings.TOKEN_TTL_SECONDS),
    }

def _get_token(token: str) -> Dict[str, Any]:
    entry = _STORE.get(token)
    if not entry:
        raise HTTPException(status_code=404, detail="Not found")
    if time.time() > entry["expires"]:
        _STORE.pop(token, None)
        raise HTTPException(status_code=410, detail="Expired")
    return entry["data"]

@router.get("/cv-data/{token}")
def get_cv_data(token: str) -> Dict[str, Any]:
    return _get_token(token)

@router.post("/export-pdf")
async def export_pdf(payload: Dict[str, Any]):
    try:
        template = payload.get("template")
        data = payload.get("data")
        if not template or not data:
            raise HTTPException(status_code=400, detail="Missing template or data")

        token = uuid4().hex
        _put_token(token, data)

        settings = get_settings()
        preview_url = f"{settings.CLIENT_BASE_URL}/preview?template={template}&token={token}"

        async with httpx.AsyncClient(timeout=60) as client:
            res = await client.post(
                f"{settings.PDF_SERVICE_URL}/generate-pdf",
                json={
                    "url": preview_url,
                    "pdfOptions": {
                        "format": "A4",
                        "printBackground": True,
                        # "margin": {"top": "10mm", "right": "0mm", "bottom": "0mm", "left": "0mm"},
                    },
                    "emulateMedia": "screen",
                    "waitUntil": "networkidle0",
                },
            )
            if res.status_code != 200:
                raise HTTPException(status_code=502, detail="PDF service error")
            pdf_bytes = res.content
        headers = {"Content-Disposition": "attachment; filename=cv.pdf"}
        return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Export failed")

