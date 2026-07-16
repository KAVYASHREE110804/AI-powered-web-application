"""YouTube URL validation and metadata retrieval."""

import re

import requests
import yt_dlp

MAX_DURATION_MINUTES = 90

_VIDEO_ID_PATTERN = re.compile(
    r"(?:youtube\.com/(?:watch\?(?:[^#]*&)?v=|shorts/|embed/)|youtu\.be/)"
    r"([\w-]{11})"
)

_OEMBED_ENDPOINT = "https://www.youtube.com/oembed"


def extract_video_id(url: str) -> str:
    """Extract the 11-character video ID from any common YouTube URL format.

    Supports watch, youtu.be, shorts, and embed URLs.
    Raises ValueError if no valid ID is found.
    """
    match = _VIDEO_ID_PATTERN.search(url.strip())
    if not match:
        raise ValueError(f"No valid YouTube video ID found in URL: {url!r}")
    return match.group(1)


def get_video_metadata(url: str) -> dict:
    """Fetch title (oEmbed API) and duration (yt-dlp) for a YouTube video.

    Raises ValueError if the video cannot be found or is inaccessible.
    """
    video_id = extract_video_id(url)

    response = requests.get(
        _OEMBED_ENDPOINT,
        params={"url": url, "format": "json"},
        timeout=15,
    )
    if response.status_code != 200:
        raise ValueError(
            f"Video not found or unavailable (oEmbed returned "
            f"{response.status_code}): {url}"
        )
    title = response.json()["title"]

    try:
        with yt_dlp.YoutubeDL({"quiet": True, "no_warnings": True}) as ydl:
            info = ydl.extract_info(url, download=False)
            duration_seconds = info.get("duration")
    except yt_dlp.utils.DownloadError as exc:
        raise ValueError(f"Could not read video duration for {url}: {exc}") from exc

    # Active live streams and premieres report no fixed duration.
    if duration_seconds is None:
        raise ValueError(
            f"Video has no fixed duration (live stream or premiere?): {url}"
        )

    return {
        "id": video_id,
        "title": title,
        "duration_minutes": duration_seconds / 60,
        "url": url,
    }


def validate_videos(urls: list) -> list:
    """Validate each URL and return a list of metadata dicts.

    Raises ValueError if any video exceeds the 90-minute limit.
    """
    videos = []
    for url in urls:
        metadata = get_video_metadata(url)
        duration = metadata["duration_minutes"]
        if duration > MAX_DURATION_MINUTES:
            raise ValueError(
                f"Video '{metadata['title']}' is {duration:.1f} mins, "
                f"exceeds {MAX_DURATION_MINUTES} min limit"
            )
        videos.append(metadata)
    return videos
