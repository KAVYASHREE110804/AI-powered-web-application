# DemoLens

Reverse-engineers any product from its YouTube demo videos.
Give it 1–4 demo video URLs and it automatically watches them, extracts the
context, writes a comprehensive Product Requirements Document, and generates
HTML UI mockups in the Airbnb design system.

## Architecture overview

The pipeline is a chain of five specialized stages. Each stage is an
independent module that enriches a shared list of video dicts and hands it to
the next stage — so every stage can be run, tested, and debugged in isolation.

```
 user input (1–4 YouTube URLs + OpenAI key, prompted at runtime)
      │
      ▼
┌─────────────────────┐   oEmbed API + yt-dlp metadata (no API key needed)
│ 1. VALIDATION        │   • extracts video ID from any URL format
│ modules/youtube.py   │   • rejects: invalid URLs, missing videos,
└─────────┬───────────┘     live streams, videos over 90 minutes
          ▼
┌─────────────────────┐   usetranscribe.io (agentic flow, no API key needed)
│ 2. TRANSCRIPTION     │   • checks the service's cache first (etiquette)
│ modules/transcribe.py│   • cache miss → submits job, streams progress
└─────────┬───────────┘     over SSE until the `done` event
          ▼                 • classifies errors as permanent vs retriable
┌─────────────────────┐   yt-dlp + PySceneDetect + OpenCV
│ 3. SCENE DETECTION   │   • downloads video at ≤720p (deleted after use)
│ modules/             │   • ContentDetector finds cuts; single-shot videos
│   scene_detector.py  │     fall back to "whole video = one scene"
└─────────┬───────────┘   • saves the middle frame of ≤20 scenes as JPEGs
          ▼
┌─────────────────────┐   GPT-4o vision (streaming)
│ 4. PRD GENERATION    │   • combines ALL transcripts + up to 8 keyframes
│ modules/             │     (evenly sampled across videos) in one context
│   prd_generator.py   │   • senior-PM system prompt demands 6 exact
└─────────┬───────────┘     sections; streams to console; saves prd.md
          ▼
┌─────────────────────┐   GPT-4o (structured JSON output)
│ 5. MOCKUP GENERATION │   • feeds the finished PRD back to GPT-4o with a
│ modules/             │     senior-UI-engineer prompt + Airbnb design tokens
│   mockup_generator.py│   • parses the JSON array defensively (markdown
└─────────┬───────────┘     fences, prose); sanitizes filenames
          ▼
 outputs/prd.md  +  outputs/mockups/*.html
```

Key design decisions:

- **Grounding approach** — the PRD prompt enforces strict grounding rules:
  the transcript and screenshots are the model's only permitted sources
  (outside knowledge is forbidden even for recognizable products), invented
  implementation details (API paths, schemas) are banned unless shown in the
  video, unsupported sections must say "Not shown in source material", and
  every claim is labeled [Observed] (with its supporting transcript/scene
  citation) or [Inferred]. The PRD call runs at temperature 0.2 to further
  reduce fabrication, and the mockup stage is grounded in the generated PRD.
- **Token budgeting** — keyframes are sampled evenly across all videos and
  capped at 8 images per request; an optional low-detail image mode keeps
  requests inside free-tier token limits.
- **Fail fast, fail clearly** — every stage raises `ValueError` with a
  human-readable message (bad URL, video too long, live stream, missing
  key), and `pipeline.py` catches these and exits gracefully instead of
  dumping a stack trace.
- **Be a good API citizen** — transcription always checks the service cache
  before submitting new jobs, sends a descriptive User-Agent, and never
  retries errors the API marks as permanent.

## Prerequisites

- Python 3.10+
- [ffmpeg](https://ffmpeg.org/download.html) on your PATH
  (Windows: `winget install Gyan.FFmpeg`)
- An OpenAI API key (only needed for steps 4–5; you'll be prompted at
  runtime if it isn't in your environment)

No other API keys are required: video validation uses YouTube's public
oEmbed endpoint, and usetranscribe.io currently works without a key
(rate-limited to ~50 transcriptions/day per IP).

## Setup

```bash
git clone https://github.com/KAVYASHREE110804/AI-powered-web-application.git
cd AI-powered-web-application
pip install -r requirements.txt
```

Optionally create a `.env` (see `.env.example`) to avoid the runtime key
prompt:

```
OPENAI_API_KEY=sk-...
```

**No OpenAI credits?** The pipeline also runs on GitHub Models' free GPT-4o
tier — put a GitHub fine-grained token (with the "Models" permission) in
`OPENAI_API_KEY` and add:

```
OPENAI_BASE_URL=https://models.github.ai/inference
OPENAI_MODEL=openai/gpt-4o
OPENAI_IMAGE_DETAIL=low
```

Using a real OpenAI key? Remove `OPENAI_IMAGE_DETAIL=low` — it downscales
screenshots and weakens visual grounding; the "low" setting only exists to
fit GitHub Models' 8k input-token cap.

## Run — Web app (recommended)

```bash
python app.py
```

Then open **http://127.0.0.1:5000**:

1. Enter 1–4 YouTube demo video URLs
2. Enter your OpenAI API key (password field — used for that generation
   session only, never stored; leave blank to fall back to the server's
   `.env` key if one is configured)
3. Watch the five pipeline stages progress live, with streaming logs
4. Read the rendered PRD and preview each mockup inline (or open it
   full-size in a new tab)

## Run — CLI

```bash
# URLs as arguments:
python pipeline.py "https://www.youtube.com/watch?v=VIDEO1" "https://youtu.be/VIDEO2"

# or fully interactive (prompts for 1-4 URLs):
python pipeline.py
```

If `OPENAI_API_KEY` isn't set, the pipeline prompts for it (hidden input).
A prompted key lives in memory for that run only — it is never written to
disk or logged.

## Output

```
outputs/prd.md        - Full product requirements document (6 sections:
                        overview, business scenarios, user roles, key
                        features, user stories, technical specifications)
outputs/mockups/      - Self-contained HTML mockups, one per screen,
                        Airbnb design system (open directly in a browser)
outputs/<video_id>/   - Extracted keyframe JPEGs per video
```

## Error handling

| Input | Behavior |
|---|---|
| 0 or 5+ URLs | Rejected with a clear message |
| Invalid / non-YouTube URL | Rejected per-URL with the offending URL named |
| Nonexistent or private video | Rejected (detected via oEmbed) |
| Video over 90 minutes | Rejected with the video's title and duration |
| Live stream / premiere | Rejected (no fixed duration) |
| Transcription rate limit / timeout | Raised with the API's reason; permanent errors are never retried |
| Single-shot video (no scene cuts) | Falls back to one keyframe from the whole video |
| GPT JSON wrapped in markdown fences | Parsed anyway (defensive extraction) |

## Project structure

```
app.py                - Flask web app (URL form, session-only key input,
                        live progress, inline PRD + mockup viewing)
templates/index.html  - Single-page web UI (Airbnb design language)
pipeline.py           - CLI pipeline entry point (input, key prompt,
                        orchestration, graceful errors)
main.py               - Development entry point used while building modules
modules/
  youtube.py          - URL validation and metadata
  transcribe.py       - Transcription via usetranscribe.io (cache + SSE)
  scene_detector.py   - Keyframe extraction via PySceneDetect + OpenCV
  prd_generator.py    - PRD generation via GPT-4o vision (streaming)
  mockup_generator.py - Airbnb-style HTML mockups via GPT-4o
transcripts/          - Complete coding-agent transcripts for every session
                        used to build this project, including the failed
                        attempts (see transcripts/README.md)
.env.example          - Environment variable template
```

## How this was built

This project was built module-by-module with Claude Code, committing each
working module as it landed. The full agent transcripts — including the
abandoned Next.js frontend, the reverse-engineering of usetranscribe.io's
real API, and the API-key debugging saga — are in
[transcripts/](transcripts/README.md).
