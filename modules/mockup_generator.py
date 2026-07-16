"""HTML mockup generation from a PRD using GPT-4o."""

import json
import os
import re
from pathlib import Path

from openai import OpenAI

DEFAULT_MODEL = "gpt-4o"

SYSTEM_PROMPT = """You are a senior UI engineer. Given this PRD, generate 3
self-contained HTML mockup screens for the most important
pages of this product.

Rules:
- Use only plain HTML and inline CSS
- Follow Airbnb design system style:
  * Font: Arial, sans-serif
  * Primary color: #FF5A5F
  * Background: #FFFFFF
  * Border color: #E5E7EB
  * Spacing: multiples of 8px
  * Border radius: 8px on cards and buttons
  * Clean, minimal, generous whitespace
- Each screen must have realistic placeholder data
- Each screen must be fully self-contained HTML

Return ONLY a valid JSON array, no extra text, no markdown:
[
  {
    "screen_name": "Dashboard",
    "html": "<html>...</html>"
  },
  {
    "screen_name": "Feature Page",
    "html": "<html>...</html>"
  },
  {
    "screen_name": "Settings",
    "html": "<html>...</html>"
  }
]"""


def _extract_json_array(response_text: str) -> str:
    """Return the JSON array from a response, tolerating markdown fences."""
    text = response_text.strip()
    fence = re.match(r"^```(?:json)?\s*(.*?)\s*```$", text, re.DOTALL)
    if fence:
        text = fence.group(1).strip()
    if not text.startswith("["):
        start, end = text.find("["), text.rfind("]")
        if start == -1 or end <= start:
            raise ValueError(
                f"No JSON array found in model response: {text[:200]!r}"
            )
        text = text[start : end + 1]
    return text


def generate_mockups(prd: str, openai_key: str) -> list:
    """Generate 3 HTML mockup screens from the PRD via GPT-4o."""
    if not openai_key:
        raise ValueError("Missing OpenAI API key. Set OPENAI_API_KEY in .env.")

    client = OpenAI(
        api_key=openai_key,
        base_url=os.getenv("OPENAI_BASE_URL") or None,
    )
    response = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", DEFAULT_MODEL),
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prd},
        ],
        max_tokens=4000,
    )

    response_text = response.choices[0].message.content
    mockups = json.loads(_extract_json_array(response_text))

    for mockup in mockups:
        if "screen_name" not in mockup or "html" not in mockup:
            raise ValueError(f"Malformed mockup entry: {mockup.keys()}")
    return mockups


def _safe_filename(screen_name: str, fallback: str) -> str:
    """Slugify a screen name; model output may contain characters like
    '/' or ':' that are invalid in (Windows) filenames."""
    slug = re.sub(r"[^a-z0-9_-]+", "_", screen_name.lower()).strip("_")
    return slug or fallback


def save_mockups(mockups: list, output_dir: str = "outputs/mockups") -> list:
    """Save each mockup as an HTML file; return the saved paths."""
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    paths = []
    for i, mockup in enumerate(mockups, start=1):
        filename = _safe_filename(mockup["screen_name"], f"screen_{i}")
        path = f"{output_dir}/{filename}.html"
        with open(path, "w", encoding="utf-8") as f:
            f.write(mockup["html"])
        print(f"Saved mockup: {path}")
        paths.append(path)
    return paths
