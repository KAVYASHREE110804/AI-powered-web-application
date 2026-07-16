"""DemoLens pipeline entry point — Module 2 test: validation + transcription."""

import os

from dotenv import load_dotenv

from modules.youtube import validate_videos
from modules.transcribe import transcribe_all_videos

load_dotenv()

# "Me at the zoo" — 19 seconds, the first video ever uploaded to YouTube.
test_urls = [
    "https://www.youtube.com/watch?v=jNQXAC9IVRw",
]


def main() -> None:
    videos = validate_videos(test_urls)
    print(f"Validated {len(videos)} videos")
    for video in videos:
        print(f"  - {video['title']} ({video['duration_minutes']:.1f} min)")

    api_key = os.getenv("USETRANSCRIBE_API_KEY")
    results = transcribe_all_videos(videos, api_key)
    print(f"Transcript preview: {results[0]['transcript'][:200]}")


if __name__ == "__main__":
    main()
