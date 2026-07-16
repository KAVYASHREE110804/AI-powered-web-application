"""Video transcription via the usetranscribe.io API.

API docs: https://www.usetranscribe.io/AGENTS.md
No API key is required today; limits are per IP (2 concurrent, 50/day).
Etiquette per the docs: always cache-check before transcribing, send a
descriptive User-Agent, and don't retry permanent errors.
"""

import json
import time

import requests

from modules.youtube import extract_video_id

# The www. prefix is required — the apex domain redirect can drop request
# paths for non-browser clients.
BASE_URL = "https://www.usetranscribe.io"
USER_AGENT = "DemoLens/0.1 (video-to-PRD pipeline)"

# Errors the API documents as permanent — retrying won't help.
_PERMANENT_ERROR_CODES = {"too_long", "unsupported_url", "auth_required"}

_HEADERS = {"User-Agent": USER_AGENT}


def check_cached(video_id: str) -> str | None:
    """Return the permalink path if this video is already transcribed."""
    response = requests.get(
        f"{BASE_URL}/api/check",
        params={"platform": "youtube", "id": video_id},
        headers=_HEADERS,
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    return data["permalink"] if data.get("cached") else None


def _absolutize(permalink: str) -> str:
    """/api/check returns a path; the SSE done event returns a full URL."""
    return permalink if permalink.startswith("http") else f"{BASE_URL}{permalink}"


def fetch_cached_transcript(permalink: str) -> dict:
    """Fetch a cached transcript row as JSON."""
    response = requests.get(
        _absolutize(permalink),
        params={"format": "json"},
        headers=_HEADERS,
        timeout=60,
    )
    response.raise_for_status()
    return response.json()


def transcribe_new(video_url: str, timeout_minutes: int = 10) -> dict:
    """Trigger a new transcription and stream progress via SSE.

    Returns the `done` event payload (segments top-level, summary in
    `summary_md`). Raises TimeoutError or RuntimeError on failure.
    """
    deadline = time.monotonic() + timeout_minutes * 60

    with requests.get(
        f"{BASE_URL}/transcribe",
        params={"url": video_url, "summarize": 1},
        headers={**_HEADERS, "Accept": "text/event-stream"},
        stream=True,
        timeout=(15, timeout_minutes * 60),
    ) as response:
        if response.status_code == 429:
            raise RuntimeError(
                f"usetranscribe.io rate limit hit: {response.text[:200]}"
            )
        response.raise_for_status()

        event = None
        for line in response.iter_lines(decode_unicode=True):
            if time.monotonic() > deadline:
                raise TimeoutError(
                    f"Transcription of {video_url} did not complete within "
                    f"{timeout_minutes} minutes"
                )
            if not line:
                continue
            if line.startswith("event:"):
                event = line.split(":", 1)[1].strip()
            elif line.startswith("data:"):
                payload = line.split(":", 1)[1].strip()
                if event == "stage":
                    print(f"  stage: {payload}")
                elif event == "done":
                    return json.loads(payload)
                elif event == "error":
                    err = json.loads(payload)
                    code = err.get("code", "unknown")
                    retriable = (
                        "" if code in _PERMANENT_ERROR_CODES else " (retriable)"
                    )
                    raise RuntimeError(
                        f"Transcription failed for {video_url}: "
                        f"{code}: {err.get('message', '')}{retriable}"
                    )

    raise RuntimeError(
        f"SSE stream for {video_url} ended without a 'done' event"
    )


def _segments_to_text(segments: list) -> str:
    """Flatten timestamped segments into plain transcript text."""
    return " ".join(
        segment["text"].strip() for segment in segments if segment.get("text")
    )


def transcribe_video(video_url: str, api_key: str | None = None) -> dict:
    """Transcribe one video, using the cache when possible.

    `api_key` is accepted for interface compatibility but unused — the
    API currently requires no key.
    """
    video_id = extract_video_id(video_url)

    print(f"Checking transcript cache for {video_url}...")
    permalink = check_cached(video_id)

    if permalink:
        print(f"Cache hit — fetching {permalink}...")
        data = fetch_cached_transcript(permalink)
        segments = data["transcript"]["segments"]
        summary = data.get("summary")
        permalink_url = _absolutize(data.get("permalink") or permalink)
    else:
        print(f"Not cached — submitting transcription job for {video_url}...")
        done = transcribe_new(video_url)
        segments = done["segments"]
        summary = done.get("summary_md")
        permalink_url = _absolutize(done["permalink"])

    print("Transcription complete.")
    return {
        "url": video_url,
        "transcript": _segments_to_text(segments),
        "segments": segments,
        "summary": summary,
        "permalink": permalink_url,
    }


def transcribe_all_videos(videos: list, api_key: str | None = None) -> list:
    """Transcribe each validated video; return metadata dicts with transcripts."""
    results = []
    for video in videos:
        transcription = transcribe_video(video["url"], api_key)
        results.append(
            {
                **video,
                "transcript": transcription["transcript"],
                "segments": transcription["segments"],
                "summary": transcription["summary"],
                "permalink": transcription["permalink"],
            }
        )
    return results
