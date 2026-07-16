# DemoLens

Reverse-engineers any product from its YouTube demo videos.
Outputs a full PRD and HTML mockups automatically.

## What it does

1. Validates YouTube URLs (rejects videos over 90 mins)
2. Transcribes audio using usetranscribe.io
3. Extracts keyframes using PySceneDetect
4. Generates a full PRD using GPT-4o vision
5. Generates HTML UI mockups using Airbnb design system

## Prerequisites

- Python 3.10+
- ffmpeg installed (https://ffmpeg.org/download.html)
- OpenAI API key
- usetranscribe.io API key
- YouTube Data API key

## Setup

```bash
git clone https://github.com/KAVYASHREE110804/AI-powered-web-application.git
cd AI-powered-web-application
pip install -r requirements.txt
cp .env.example .env
# Fill in your API keys in .env
```

No OpenAI credits? The pipeline also runs on GitHub Models' free GPT-4o
tier — see the optional `OPENAI_BASE_URL` settings in `.env.example`.

## Run

```bash
python pipeline.py
```

## Output

```
outputs/prd.md        - Full product requirements document
outputs/mockups/      - HTML mockup files for each screen
```

## Project structure

```
pipeline.py           - Master pipeline entry point
modules/
  youtube.py          - URL validation and metadata
  transcribe.py       - Transcription via usetranscribe.io
  scene_detector.py   - Keyframe extraction via PySceneDetect
  prd_generator.py    - PRD generation via GPT-4o
  mockup_generator.py - Mockup generation via GPT-4o
```
