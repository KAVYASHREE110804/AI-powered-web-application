"""Video transcription via the usetranscribe.io API."""

import time

import requests

API_BASE = "https://api.usetranscribe.io/v1"
POLL_INTERVAL_SECONDS = 5


def _auth_headers(api_key: str) -> dict:
    if not api_key:
        raise ValueError(
            "Missing usetranscribe.io API key. Set USETRANSCRIBE_API_KEY in .env."
        )
    return {"Authorization": f"Bearer {api_key}"}


def submit_transcription_job(video_url: str, api_key: str) -> str:
    """Start a transcription job and return its job ID."""
    response = requests.post(
        f"{API_BASE}/transcribe",
        headers=_auth_headers(api_key),
        json={"url": video_url},
        timeout=30,
    )
    if response.status_code not in (200, 201, 202):
        raise RuntimeError(
            f"Failed to submit transcription job for {video_url}: "
            f"HTTP {response.status_code} — {response.text[:300]}"
        )
    data = response.json()
    job_id = data.get("job_id") or data.get("id")
    if not job_id:
        raise RuntimeError(f"No job ID in transcription response: {data}")
    return job_id


def poll_transcription_job(
    job_id: str, api_key: str, timeout_minutes: int = 10
) -> str:
    """Poll a job every 5 seconds until completed; return the transcript text.

    Raises TimeoutError if the job does not complete within timeout_minutes.
    """
    deadline = time.monotonic() + timeout_minutes * 60

    while time.monotonic() < deadline:
        response = requests.get(
            f"{API_BASE}/transcribe/{job_id}",
            headers=_auth_headers(api_key),
            timeout=30,
        )
        if response.status_code != 200:
            raise RuntimeError(
                f"Failed to poll transcription job {job_id}: "
                f"HTTP {response.status_code} — {response.text[:300]}"
            )
        data = response.json()
        status = data.get("status")

        if status == "completed":
            transcript = data.get("transcript") or data.get("text")
            if transcript is None:
                raise RuntimeError(
                    f"Job {job_id} completed but no transcript in response: {data}"
                )
            return transcript
        if status in ("failed", "error"):
            raise RuntimeError(f"Transcription job {job_id} failed: {data}")

        time.sleep(POLL_INTERVAL_SECONDS)

    raise TimeoutError(
        f"Transcription job {job_id} did not complete within "
        f"{timeout_minutes} minutes"
    )


def transcribe_video(video_url: str, api_key: str) -> dict:
    """Submit and poll a transcription job for one video."""
    print(f"Submitting transcription job for {video_url}...")
    job_id = submit_transcription_job(video_url, api_key)
    print(f"Polling job {job_id}...")
    transcript = poll_transcription_job(job_id, api_key)
    print("Transcription complete.")
    return {
        "url": video_url,
        "transcript": transcript,
    }


def transcribe_all_videos(videos: list, api_key: str) -> list:
    """Transcribe each validated video; return metadata dicts with transcripts."""
    results = []
    for video in videos:
        transcription = transcribe_video(video["url"], api_key)
        results.append({**video, "transcript": transcription["transcript"]})
    return results
