"""HTML mockup generation from a PRD using GPT-4o."""

import json
import os
import re
from pathlib import Path

from openai import OpenAI

DEFAULT_MODEL = "gpt-4o"

SYSTEM_PROMPT = """You are a senior UI/UX designer expert in the Airbnb Design System (DLS).

Generate UI mockups as self-contained HTML files using only HTML and CSS
(no JavaScript frameworks, no React, no external CSS libraries like
Bootstrap or Tailwind). Vanilla CSS only. All styles must be in a <style>
tag in the same file.

## Airbnb Design System — apply these exactly:

--color-rausch: #FF385C;        /* primary buttons, badges, accents */
--color-dark: #222222;          /* headings, primary text */
--color-secondary: #717171;     /* body text, labels */
--color-border: #DDDDDD;        /* card borders, dividers */
--color-babu: #00A699;          /* success / deployed state */
--color-arches: #FFB400;        /* warning / building state */
--color-background: #F7F7F7;    /* page background */
--color-white: #FFFFFF;         /* card backgrounds */

font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
/* Airbnb Circular font isn't available freely — this stack is the correct fallback */

Border radius — cards: 12px | buttons: 8px | badges: 20px
Box shadow — cards: 0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)
Spacing — use multiples of 8px only (8, 16, 24, 32, 48, 64)
Navbar — height 80px, background white, border-bottom 1px solid #DDDDDD
Button padding — 14px 24px, font-weight 600, font-size 15px

## The product's 4 pages (you will be asked for ONE at a time):

### Dashboard (dashboard.html)
- Navbar: logo left, "200,000 tokens" indicator center, user avatar circle right
- Large centered prompt textarea: "Describe the app you want to build..."
  with a Rausch-colored Submit button below
- Below that: "Your Projects" heading with a 3-column card grid
  Each card shows: App name, status badge (Deployed/Building/Error),
  last modified date, an "Open" button
- NO sidebar. Navigation lives in the top navbar ONLY, mapped like this:
  Home = the logo link (left) | My Projects = active filter tab above the
  project grid | Netlify & Supabase = secondary links in the navbar (top
  right) | Settings = ⚙ icon inside the profile menu (top right)

### Builder (builder.html)
- Two-column layout (50/50):
  Left = AI conversation panel with alternating user/AI message bubbles
  Right = app preview panel with a grey placeholder box simulating iframe
- Top bar: app name left, token progress bar center
  ("45,230 / 200,000 tokens"), Deploy button right (Rausch)
- Error banner at top in light red background:
  "⚠ Build error detected — Click to auto-fix"
  with an X to dismiss

### Auth-Setup (auth-setup.html)
- Left panel: Auth configuration with toggle switches (CSS only) for:
  Email/Password, Google OAuth, Phone OTP
  Each toggle row has label + description + the switch
- Right panel: Live preview of the generated login form
  (email input, password input, Sign In button in Rausch)
- Bottom: "Save & Apply" button full width in Rausch

### Deployment (deployment.html)
- Centered stepper showing 4 steps:
  1. Connect Netlify  2. Build  3. Deploy  4. Live
  Completed steps show green checkmark circle
  Current step highlighted in Rausch
  Upcoming steps greyed out
- Below stepper: live URL box with copy button
- QR code placeholder (grey box with "QR Code" text)
- Secondary "Deploy to Android" outlined button

## Strict rules:
- SIDEBAR NAVIGATION IS STRICTLY FORBIDDEN on every screen. If a screen
  seems to need one, map its items into the top navbar instead (links top
  right, filter tabs above content, settings in the profile menu). Any
  output containing a sidebar is WRONG.
- NO Lorem Ipsum — use real content based on the provided PRD
- NO external fonts, NO CDN links, NO JavaScript libraries
- Every page must share the same navbar HTML/CSS — reproduce the exact
  same navbar markup and styles on every page you generate
- Status badges must use pill shape (border-radius: 20px, padding: 4px 12px)
  Green #00A699 = Deployed, Yellow #FFB400 = Building, Red #FF385C = Error
- Use Unicode for icons: ⚙ ✓ ✕ ◉ → etc.
- The output must look production-ready, not like a wireframe

Return ONLY a valid JSON object for the one requested screen,
no extra text, no markdown:
{
  "screen_name": "Dashboard",
  "html": "<html>...</html>"
}
Inside the "html" string value, escape every double quote as \\" and
every newline as \\n so the JSON stays valid."""

# One API call per screen: four production-ready pages exceed the
# output-token cap in a single response and would truncate the JSON.
SCREENS = ["Dashboard", "Builder", "Auth-Setup", "Deployment"]

# LLM output is not deterministic: a screen occasionally comes back as
# broken JSON or truncated, so each screen gets a few attempts.
MAX_ATTEMPTS = 3


def _parse_mockup_entry(response_text: str) -> dict:
    """Parse a model response into a mockup dict.

    Tolerates markdown fences, surrounding prose, and a one-element
    array wrapper around the expected object.
    """
    text = response_text.strip()
    fence = re.match(r"^```(?:json)?\s*(.*?)\s*```$", text, re.DOTALL)
    if fence:
        text = fence.group(1).strip()
    if not text.startswith(("{", "[")):
        starts = [i for i in (text.find("{"), text.find("[")) if i != -1]
        end = max(text.rfind("}"), text.rfind("]"))
        if not starts or end <= min(starts):
            raise ValueError(
                f"No JSON found in model response: {text[:200]!r}"
            )
        text = text[min(starts) : end + 1]
    data = json.loads(text)
    if isinstance(data, list):
        if not data:
            raise ValueError("Empty JSON array in model response")
        data = data[0]
    if not isinstance(data, dict) or "html" not in data:
        raise ValueError("Model response is missing the 'html' field")
    return data


def generate_mockups(prd: str, openai_key: str) -> list:
    """Generate the 4 HTML mockup screens from the PRD via GPT-4o.

    One API call per screen — a single response for all four pages would
    exceed the 4k output-token cap and truncate the JSON.
    """
    if not openai_key:
        raise ValueError("Missing OpenAI API key. Set OPENAI_API_KEY in .env.")

    client = OpenAI(
        api_key=openai_key,
        base_url=os.getenv("OPENAI_BASE_URL") or None,
    )

    mockups = []
    for screen in SCREENS:
        print(f"Generating {screen} mockup...")
        # Canonical name guarantees stable filenames (dashboard.html, ...).
        mockups.append(
            {"screen_name": screen, "html": _generate_screen(client, prd, screen)}
        )
    return mockups


def _generate_screen(client: OpenAI, prd: str, screen: str) -> str:
    """Generate one screen's HTML, retrying on invalid/truncated JSON."""
    last_err = None
    for attempt in range(1, MAX_ATTEMPTS + 1):
        if attempt > 1:
            print(f"  retry {attempt}/{MAX_ATTEMPTS} for {screen}: {last_err}")
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", DEFAULT_MODEL),
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": (
                        f"PRD:\n\n{prd}\n\n"
                        f"Generate ONLY the '{screen}' screen now, including "
                        "the standard shared navbar."
                    ),
                },
            ],
            max_tokens=8000,
            # JSON mode: the API only returns syntactically valid JSON,
            # which unescaped quotes in the HTML string would otherwise break.
            response_format={"type": "json_object"},
        )

        choice = response.choices[0]
        if choice.finish_reason == "length":
            last_err = ValueError(
                f"{screen} response hit the output-token cap and was truncated"
            )
            continue
        try:
            return _parse_mockup_entry(choice.message.content)["html"]
        except (json.JSONDecodeError, ValueError) as err:
            last_err = err
    raise RuntimeError(
        f"Failed to generate a valid {screen} mockup "
        f"after {MAX_ATTEMPTS} attempts: {last_err}"
    ) from last_err


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
