from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from typing import Any, Dict
from uuid import uuid4
import time

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
        try:
            from playwright.async_api import async_playwright

            async with async_playwright() as p:
                browser = await p.chromium.launch(args=[
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                ])
                context = await browser.new_context()
                page = await context.new_page()
                await page.emulate_media(media="screen")
                await page.goto(preview_url, wait_until="networkidle")
                await page.evaluate("""
                    () => new Promise((resolve) => {
                        try {
                            if (document.fonts && document.fonts.ready) {
                                document.fonts.ready.then(() => resolve(null)).catch(() => resolve(null));
                            } else {
                                resolve(null);
                            }
                        } catch { resolve(null); }
                    })
                """)
                pdf_bytes = await page.pdf(
                    format="A4",
                    print_background=True,
                    prefer_css_page_size=True,
                    margin={"top": "0px"},
                )
                await browser.close()
            headers = {"Content-Disposition": "attachment; filename=cv.pdf"}
            return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
        except ModuleNotFoundError:
            raise HTTPException(status_code=500, detail="Playwright is not installed")
        except Exception:
            raise HTTPException(status_code=500, detail="Failed to generate PDF")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Export failed")
