# DemoLens

Reverse-engineer any product from its demo video.

DemoLens is a video-to-PRD pipeline: it takes YouTube demo videos and turns
them into a Product Requirements Document and mockups.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate      # Windows
pip install -r requirements.txt
copy .env.example .env      # then fill in your API keys
```

## Run

```bash
python main.py
```

## Structure

```
main.py           # entry point, verifies all pipeline modules load
modules/          # pipeline modules (added incrementally)
.env.example      # template for required API keys (never commit .env)
requirements.txt  # Python dependencies
```
