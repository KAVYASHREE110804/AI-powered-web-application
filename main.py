"""DemoLens pipeline entry point — Module 3 test: scenes + keyframes."""

import os
import sys

from dotenv import load_dotenv

# Windows consoles default to cp1252, which crashes on transcript characters
# like '♪'; force UTF-8 so previews always print.
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from modules.youtube import validate_videos
from modules.transcribe import transcribe_all_videos
from modules.scene_detector import process_all_videos

load_dotenv()

test_urls = [
    # "Me at the zoo" — 19s, single shot (exercises the no-cuts fallback)
    "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    # Pharrell — "Happy" — ~4 min, many cuts (exercises scene sampling)
    "https://www.youtube.com/watch?v=ZbZSe6N_BXs",
]


def main() -> None:
    videos = validate_videos(test_urls)
    print(f"Validated {len(videos)} videos")

    results = transcribe_all_videos(
        videos,
        os.getenv("USETRANSCRIBE_API_KEY"),
    )
    print(f"Transcript preview: {results[0]['transcript'][:200]}")

    videos_with_scenes = process_all_videos(results)

    for video in videos_with_scenes:
        print(f"\nVideo: {video['title']}")
        print(f"Extracted {len(video['frames'])} keyframes")
        for frame in video["frames"][:3]:
            print(
                f"  Scene {frame['scene_number']}: "
                f"{frame['timestamp_seconds']:.1f}s -> "
                f"{frame['image_path']}"
            )


if __name__ == "__main__":
    main()
