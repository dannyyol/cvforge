from src.utils.html_sanitizer import (
    insert_paragraph_spacing,
    plain_text_to_rich_html,
    sanitize_rich_text_html,
    sanitize_resume_data_inplace,
    sanitize_url,
)


def test_sanitize_rich_text_html_strips_scripts_and_event_handlers():
    html = '<p>Hello<img src=x onerror="alert(1)"></p><script>alert(2)</script>'
    cleaned = sanitize_rich_text_html(html)
    assert "<script" not in cleaned.lower()
    assert "onerror" not in cleaned.lower()
    assert "<img" not in cleaned.lower()


def test_sanitize_rich_text_html_blocks_javascript_urls():
    html = '<a href="javascript:alert(1)">click</a>'
    cleaned = sanitize_rich_text_html(html)
    assert "javascript:" not in cleaned.lower()


def test_plain_text_to_rich_html_splits_blank_lines():
    raw = "Hello Hiring Manager,\n\nI am excited to apply.\n\nBest,\nAlex"
    html = plain_text_to_rich_html(raw)
    assert html.count("<p>") == 3
    assert "<p>Hello Hiring Manager,</p>" in html
    assert "<p>I am excited to apply.</p>" in html
    assert "<p>Best,<br>Alex</p>" in html


def test_plain_text_to_rich_html_splits_single_newlines_when_needed():
    raw = "Hello Hiring Manager,\nI am excited to apply.\nBest,\nAlex"
    html = plain_text_to_rich_html(raw)
    assert html.count("<p>") == 4
    assert "<p>Hello Hiring Manager,</p>" in html
    assert "<p>Alex</p>" in html


def test_plain_text_to_rich_html_preserves_multi_paragraph_html():
    raw = "<p>Hello,</p><p>Body here.</p><p>Best,</p>"
    assert plain_text_to_rich_html(raw) == raw


def test_plain_text_to_rich_html_unwraps_single_p_with_newlines():
    raw = "<p>Hello,\n\nBody here.\n\nBest,</p>"
    html = plain_text_to_rich_html(raw)
    assert html.count("<p>") == 3


def test_insert_paragraph_spacing_adds_blank_paragraphs():
    raw = "<p>Hello,</p><p>Body here.</p><p>Best,<br>Alex</p>"
    spaced = insert_paragraph_spacing(raw)
    assert spaced == (
        "<p>Hello,</p><p></p>"
        "<p>Body here.</p><p></p>"
        "<p>Best,<br>Alex</p>"
    )


def test_insert_paragraph_spacing_normalizes_existing_blanks():
    raw = "<p>Hello,</p><p></p><p></p><p>Body</p>"
    spaced = insert_paragraph_spacing(raw)
    assert spaced == "<p>Hello,</p><p></p><p>Body</p>"


def test_insert_paragraph_spacing_from_plain_text_pipeline():
    raw = "Hello,\n\nBody here.\n\nBest,\nAlex"
    spaced = insert_paragraph_spacing(plain_text_to_rich_html(raw))
    assert spaced == (
        "<p>Hello,</p><p></p>"
        "<p>Body here.</p><p></p>"
        "<p>Best,<br>Alex</p>"
    )


def test_sanitize_resume_data_inplace_cleans_nested_fields():
    resume_data = {
        "personalDetails": {"website": "javascript:alert(1)", "linkedin": "https://linkedin.com/in/x"},
        "professionalSummary": {"content": '<p>Hi<script>alert(1)</script></p>'},
        "workExperiences": [{"description": '<img src=x onerror="alert(1)">ok'}],
        "education": [{"description": "<p>edu</p>"}],
        "projects": [{"description": '<a href="javascript:alert(1)">x</a>', "link": "javascript:alert(1)"}],
        "awards": [{"description": "<div>award</div>"}],
        "publications": [{"description": "<span>pub</span>", "link": "data:text/html,hi"}],
        "websites": [{"url": "vbscript:alert(1)"}],
        "coverLetter": {"content": '<p>cl<img src=x onerror="alert(1)"></p>'},
    }
    sanitize_resume_data_inplace(resume_data)
    assert "<script" not in resume_data["professionalSummary"]["content"].lower()
    assert "onerror" not in resume_data["workExperiences"][0]["description"].lower()
    assert "javascript:" not in resume_data["projects"][0]["description"].lower()
    assert "onerror" not in resume_data["coverLetter"]["content"].lower()
    assert resume_data["personalDetails"]["website"] == ""
    assert resume_data["personalDetails"]["linkedin"] == "https://linkedin.com/in/x"
    assert resume_data["projects"][0]["link"] == ""
    assert resume_data["publications"][0]["link"] == ""
    assert resume_data["websites"][0]["url"] == ""


def test_sanitize_url_allows_http_https_mailto_and_blocks_other_schemes():
    assert sanitize_url("https://example.com") == "https://example.com"
    assert sanitize_url("http://example.com") == "http://example.com"
    assert sanitize_url("mailto:test@example.com") == "mailto:test@example.com"
    assert sanitize_url("javascript:alert(1)") == ""
    assert sanitize_url("data:text/html,hi") == ""
