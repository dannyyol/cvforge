from __future__ import annotations

import html
import re
from typing import Any

import bleach
from urllib.parse import urlsplit


_RICH_TEXT_MARKER_RE = re.compile(
    r"</?(?:p|br|div|ul|ol|li|h[1-6]|strong|em|blockquote|span)\b",
    re.IGNORECASE,
)


_ALLOWED_TAGS: list[str] = [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "blockquote",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "span",
    "div",
    "a",
]

_ALLOWED_ATTRIBUTES: dict[str, list[str]] = {
    "a": ["href", "target", "rel"],
    "div": ["class"],
    "span": ["class"],
    "p": ["class"],
}

_ALLOWED_PROTOCOLS: list[str] = ["http", "https", "mailto"]


def sanitize_rich_text_html(value: Any) -> str:
    if value is None:
        return ""
    text = value if isinstance(value, str) else str(value)
    return bleach.clean(
        text,
        tags=_ALLOWED_TAGS,
        attributes=_ALLOWED_ATTRIBUTES,
        protocols=_ALLOWED_PROTOCOLS,
        strip=True,
        strip_comments=True,
    )


def plain_text_to_rich_html(value: Any) -> str:
    """Turn model plain text into TipTap-friendly HTML paragraphs.

    Already-tagged multi-block HTML is sanitized as-is. A single wrapping
    ``<p>`` (or plain text) is split on blank lines, falling back to single
    newlines when needed.
    """
    if value is None:
        return ""
    text = value if isinstance(value, str) else str(value)
    text = text.replace("\r\n", "\n").replace("\r", "\n").strip()
    if not text:
        return ""

    single_p = re.fullmatch(r"<p(?:\s[^>]*)?>(.*?)</p>", text, flags=re.IGNORECASE | re.DOTALL)
    if single_p:
        inner = single_p.group(1)
        if not _RICH_TEXT_MARKER_RE.search(inner):
            text = html.unescape(re.sub(r"<br\s*/?>", "\n", inner, flags=re.IGNORECASE)).strip()
        else:
            return sanitize_rich_text_html(text)
    elif _RICH_TEXT_MARKER_RE.search(text):
        return sanitize_rich_text_html(text)

    blocks = [b.strip() for b in re.split(r"\n\s*\n+", text) if b.strip()]
    if len(blocks) <= 1 and "\n" in text:
        blocks = [b.strip() for b in text.split("\n") if b.strip()]

    if not blocks:
        return ""

    paragraphs: list[str] = []
    for block in blocks:
        lines = [html.escape(line) for line in block.split("\n")]
        paragraphs.append(f"<p>{'<br>'.join(lines)}</p>")
    return "".join(paragraphs)


_EMPTY_PARAGRAPH_RE = re.compile(
    r"<p(?:\s[^>]*)?>\s*(?:<br\s*/?>\s*)*</p>",
    re.IGNORECASE,
)
_PARAGRAPH_BLOCK_RE = re.compile(r"<p(?:\s[^>]*)?>.*?</p>", re.IGNORECASE | re.DOTALL)


def insert_paragraph_spacing(value: Any) -> str:
    """Insert blank ``<p></p>`` between content paragraphs for TipTap spacing.

    Empty paragraphs already present are normalized to a single spacer between
    adjacent content blocks (no double blanks).
    """
    if value is None:
        return ""
    text = value if isinstance(value, str) else str(value)
    cleaned = sanitize_rich_text_html(text.strip())
    if not cleaned:
        return ""

    blocks = _PARAGRAPH_BLOCK_RE.findall(cleaned)
    if not blocks:
        return cleaned
    if len(blocks) == 1:
        return blocks[0] if not _EMPTY_PARAGRAPH_RE.fullmatch(blocks[0].strip()) else ""

    spaced: list[str] = []
    for block in blocks:
        if _EMPTY_PARAGRAPH_RE.fullmatch(block.strip()):
            continue
        if spaced:
            spaced.append("<p></p>")
        spaced.append(block)
    return "".join(spaced)


def sanitize_url(value: Any) -> str:
    if value is None:
        return ""
    text = value if isinstance(value, str) else str(value)
    raw = text.strip()
    if not raw:
        return ""
    if raw.startswith("//"):
        return raw
    try:
        parsed = urlsplit(raw)
    except Exception:
        return ""
    if parsed.scheme and parsed.scheme.lower() not in _ALLOWED_PROTOCOLS:
        return ""
    return raw


def sanitize_resume_data_inplace(resume_data: dict[str, Any]) -> dict[str, Any]:
    ps = resume_data.get("professionalSummary")
    if isinstance(ps, dict) and "content" in ps:
        ps["content"] = sanitize_rich_text_html(ps.get("content"))

    pd = resume_data.get("personalDetails")
    if isinstance(pd, dict):
        for key in ("website", "linkedin", "github"):
            if key in pd:
                pd[key] = sanitize_url(pd.get(key))

    for key in ("workExperiences", "education", "projects", "awards", "publications"):
        items = resume_data.get(key)
        if not isinstance(items, list):
            continue
        for item in items:
            if not isinstance(item, dict):
                continue
            if "description" in item:
                item["description"] = sanitize_rich_text_html(item.get("description"))
            if key == "projects" and "link" in item:
                item["link"] = sanitize_url(item.get("link"))
            if key == "publications" and "link" in item:
                item["link"] = sanitize_url(item.get("link"))

    websites = resume_data.get("websites")
    if isinstance(websites, list):
        for item in websites:
            if isinstance(item, dict) and "url" in item:
                item["url"] = sanitize_url(item.get("url"))

    cl = resume_data.get("coverLetter")
    if isinstance(cl, dict) and "content" in cl:
        cl["content"] = sanitize_rich_text_html(cl.get("content"))

    return resume_data
