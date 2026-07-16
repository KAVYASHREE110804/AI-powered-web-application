# Session 1 (2026-07-15) — First scaffold attempt (interrupted/failed)

Raw log: `raw/session-1_2026-07-15_first-scaffold-attempt-interrupted.jsonl` (complete, machine-readable).
This file is a condensed human-readable view: user and assistant messages plus one-line tool-call summaries. Tool outputs and system context are omitted for brevity.

## 👤 User

<ide_selection>The user selected the lines 7 to 30 from c:\Users\spkav\Downloads\prompt-pack.md:

**Log every session.** The brief asks for your coding-agent transcripts, including
the failures. You cannot reconstruct these later. After each module, save the
session to `transcripts/NN-module-name.md` with the prompt at the top and a
2-line "what went wrong and how I diagnosed it" note at the bottom. That note is
the part that actually scores — it shows you debugged rather than re-rolled.

**Three decisions already baked in, so you don't re-litigate them mid-build:**

1. **Mockups are HTML + Tailwind (CDN), not React.** The brief allows either.
   HTML renders in a sandboxed `<iframe srcdoc>` with zero build step. Generated
   React needs runtime transpilation (Babel standalone or Sandpack) and fails in
   ways that look like *your* bug during a demo. Don't take that risk for no points.
2. **Backend is Python.** yt-dlp and PySceneDetect are Python. Don't shell out to
   them from Node.
3. **The app's own UI must not look Airbnb-styled.** Only the *generated mockups*
   use the Airbnb tokens. If your whole app is coral-and-Cereal the evaluator
   can't tell which part the AI produced. Make the chrome visually distinct.

**Cache locally from day one.** usetranscribe.io allows 50 transcribes/day per IP.
You will iterate on modules 4–6 dozens of times. Every one of those runs should hit
a local disk cache, never the network. Build the cache in module 2 and you'll thank
yourself on day three.


This may or may not be related to the current task.</ide_selection>
**Log every session.** The brief asks for your coding-agent transcripts, including
the failures. You cannot reconstruct these later. After each module, save the
session to `transcripts/NN-module-name.md` with the prompt at the top and a
2-line "what went wrong and how I diagnosed it" note at the bottom. That note is
the part that actually scores — it shows you debugged rather than re-rolled.

**Three decisions already baked in, so you don't re-litigate them mid-build:**

1. **Mockups are HTML + Tailwind (CDN), not React.** The brief allows either.
   HTML renders in a sandboxed `<iframe srcdoc>` with zero build step. Generated
   React needs runtime transpilation (Babel standalone or Sandpack) and fails in
   ways that look like *your* bug during a demo. Don't take that risk for no points.
2. **Backend is Python.** yt-dlp and PySceneDetect are Python. Don't shell out to
   them from Node.
3. **The app's own UI must not look Airbnb-styled.** Only the *generated mockups*
   use the Airbnb tokens. If your whole app is coral-and-Cereal the evaluator
   can't tell which part the AI produced. Make the chrome visually distinct.

**Cache locally from day one.** usetranscribe.io allows 50 transcribes/day per IP.
You will iterate on modules 4–6 dozens of times. Every one of those runs should hit
a local disk cache, never the network. Build the cache in module 2 and you'll thank
yourself on day three.

## 🤖 Claude

I see you've selected guidance from your prompt-pack.md covering session logging, three baked-in tech decisions (HTML+Tailwind mockups, Python backend, distinct app UI), and local caching for transcription calls. What would you like me to do with this — start scaffolding the project structure based on these decisions, or is there a specific module you want to begin building?

## 👤 User

<ide_selection>The user selected the lines 35 to 91 from c:\Users\spkav\Downloads\prompt-pack.md:
````
Project "Reverse-PRD": takes 1-4 YouTube product-demo URLs, watches them, and
produces a PRD + UI mockups.

This first task is scaffold + data contracts ONLY. Every later module imports
from these models, so they are the thing that keeps the pipeline from drifting.
Write no pipeline logic yet.

Stack (decided — do not substitute):
- Python 3.11, FastAPI, uvicorn, pydantic v2
- yt-dlp, scenedetect[opencv], Pillow, imagehash
- httpx (async; SSE via iter_lines)
- openai >= 1.0  — key comes from the user at runtime, NEVER from env/disk
- Frontend: Vite + React + TypeScript + Tailwind

Create:
  backend/
    schemas.py          # all pydantic models — single source of truth
    config.py           # constants, no secrets
    main.py             # FastAPI app, GET /health only
    agents/__init__.py
    cache/              # gitignored, local artifact cache
  frontend/             # bare vite scaffold
  transcripts/          # coding-agent session logs
  tests/
  .env.example          # note: contains NO OpenAI key. Explain why in a comment.
  README.md             # stub

schemas.py — define exactly these, with docstrings:

  VideoRef          url, video_id, title, channel, duration_seconds, thumbnail_url
  TranscriptSegment start: float, end: float, text: str, speaker: str | None
  Transcript        video_id, language, segments: list[TranscriptSegment],
                    summary_md: str | None, permalink: str | None,
                    source: Literal["captions","audio_url","audio_file"] | None
  Scene             index: int, start: float, end: float,
                    keyframe_path: str, phash: str, origin: Literal["cut","interval"]
  SceneContext      scene: Scene, narration: str
  VideoBundle       video: VideoRef, transcript: Transcript,
                    scenes: list[SceneContext]
  Rejection         url: str, reason: str
  JobEvent          stage: str, video_id: str | None, pct: int,
                    message: str, payload: dict | None
  # PRD models: leave a `# TODO(prompt-5)` stub

config.py:
  MAX_VIDEOS = 4
  MAX_DURATION_SECONDS = 90 * 60
  TRANSCRIBE_BASE = "https://www.usetranscribe.io"   # the www. is mandatory
  TRANSCRIBE_MAX_CONCURRENT = 2                       # their per-IP cap
  MAX_FRAMES_TO_LLM = 40
  USER_AGENT = "reverse-prd/0.1 (take-home; <your-email>)"

Acceptance:
  - `python -c "import backend.schemas"` clean
  - `uvicorn backend.main:app` -> GET /health -> {"ok": true}
  - `cd frontend && npm run dev` serves the Vite page

This may or may not be related to the current task.</ide_selection>
````
Project "Reverse-PRD": takes 1-4 YouTube product-demo URLs, watches them, and
produces a PRD + UI mockups.

This first task is scaffold + data contracts ONLY. Every later module imports
from these models, so they are the thing that keeps the pipeline from drifting.
Write no pipeline logic yet.

Stack (decided — do not substitute):
- Python 3.11, FastAPI, uvicorn, pydantic v2
- yt-dlp, scenedetect[opencv], Pillow, imagehash
- httpx (async; SSE via iter_lines)
- openai >= 1.0  — key comes from the user at runtime, NEVER from env/disk
- Frontend: Vite + React + TypeScript + Tailwind

Create:
  backend/
    schemas.py          # all pydantic models — single source of truth
    config.py           # constants, no secrets
    main.py             # FastAPI app, GET /health only
    agents/__init__.py
    cache/              # gitignored, local artifact cache
  frontend/             # bare vite scaffold
  transcripts/          # coding-agent session logs
  tests/
  .env.example          # note: contains NO OpenAI key. Explain why in a comment.
  README.md             # stub

schemas.py — define exactly these, with docstrings:

  VideoRef          url, video_id, title, channel, duration_seconds, thumbnail_url
  TranscriptSegment start: float, end: float, text: str, speaker: str | None
  Transcript        video_id, language, segments: list[TranscriptSegment],
                    summary_md: str | None, permalink: str | None,
                    source: Literal["captions","audio_url","audio_file"] | None
  Scene             index: int, start: float, end: float,
                    keyframe_path: str, phash: str, origin: Literal["cut","interval"]
  SceneContext      scene: Scene, narration: str
  VideoBundle       video: VideoRef, transcript: Transcript,
                    scenes: list[SceneContext]
  Rejection         url: str, reason: str
  JobEvent          stage: str, video_id: str | None, pct: int,
                    message: str, payload: dict | None
  # PRD models: leave a `# TODO(prompt-5)` stub

config.py:
  MAX_VIDEOS = 4
  MAX_DURATION_SECONDS = 90 * 60
  TRANSCRIBE_BASE = "https://www.usetranscribe.io"   # the www. is mandatory
  TRANSCRIBE_MAX_CONCURRENT = 2                       # their per-IP cap
  MAX_FRAMES_TO_LLM = 40
  USER_AGENT = "reverse-prd/0.1 (take-home; <your-email>)"

Acceptance:
  - `python -c "import backend.schemas"` clean
  - `uvicorn backend.main:app` -> GET /health -> {"ok": true}
  - `cd frontend && npm run dev` serves the Vite page

## 🤖 Claude

I'll scaffold Module 1 — backend data contracts and bare project structure. Let me first check what's already in the working directory.

> 🔧 `Bash: cd "/c/Users/spkav/OneDrive/Desktop/TAKE HOME TASK" && ls -la && echo "---python---" && python --ver`

## 👤 User

[Request interrupted by user]
