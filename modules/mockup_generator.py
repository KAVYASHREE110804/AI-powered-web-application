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
- Each screen is a complete HTML document with a <style> block in <head>.
- Load Inter from Google Fonts in every screen's <head>:
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
- Define the COLORS below as CSS variables in :root and reference them
  (var(--rausch), etc.) throughout the stylesheet.
- Follow this design system EXACTLY:

=== AIRBNB DESIGN SYSTEM ===

CORE PRINCIPLE: Restraint. White canvas, one accent color, generous whitespace,
soft rounded shapes. The red means "do this" — nothing else.

COLORS:
  --canvas:       #FFFFFF   /* page + card backgrounds — this is the base */
  --surface-soft: #F7F7F7   /* subtle section fills */
  --ink:          #222222   /* headings + body text — NEVER pure #000000 */
  --body:         #3F3F3F   /* secondary text */
  --muted:        #767676   /* captions, hints */
  --rausch:       #FF385C   /* PRIMARY ACTION ONLY — buttons, active states */
  --border:       #EBEBEB   /* hairline dividers only, not card outlines */

  HARD RULE: --rausch appears ONLY on primary buttons and key interactive
  accents. NEVER on headers, banners, backgrounds, or large surfaces.
  Headers/banners = white (--canvas) with --ink text.

TYPOGRAPHY:
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  Weights: 500 (most UI), 600 (emphasis), 700 (primary headings). No <500 on
  headings. Apply letter-spacing: -0.02em on headings.

RADIUS:
  buttons: 8px | cards: 16px (min); 20px preferred | inputs: 12px
  pills/toggles/search: 9999px. NEVER 0-4px on cards.

ELEVATION (use INSTEAD of borders on cards):
  box-shadow: 0 6px 16px rgba(0,0,0,0.06), 0 3px 6px rgba(0,0,0,0.04);
  Soft and light — never heavy.

SPACING: 4px base. Scale: 4, 8, 12, 16, 24, 32, 48, 64. Be generous.

COMPONENTS:
  Primary button: background --rausch, white text, 8px radius, weight 600,
    padding 12px 24px. RESERVE for the single primary action per view — do not
    put a red button on every card.
  Secondary button: white bg, 1px --ink border, --ink text, 8px radius.
  Card: --canvas bg, soft shadow (above), 20px radius, 24px padding, NO border.
  Input: --canvas bg, 1px --border, 12px radius, 12px padding, --ink text.
  Checkbox/toggle: styled in --ink or --rausch — never default browser blue.

=== END SPEC ===

- Each screen must have realistic placeholder data drawn from the PRD
- Keep each screen focused and compact — quality over quantity of elements

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
