"""DemoLens master pipeline: YouTube demo videos -> PRD + HTML mockups."""

import os
import sys

from dotenv import load_dotenv

# Windows consoles default to cp1252, which crashes on characters like ✓
# and transcript symbols; force UTF-8 so output always prints.
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from modules.youtube import validate_videos
from modules.transcribe import transcribe_all_videos
from modules.scene_detector import process_all_videos
from modules.prd_generator import generate_prd, save_prd
from modules.mockup_generator import generate_mockups, save_mockups

# override=True: a stale OPENAI_API_KEY in the Windows user environment
# would otherwise shadow the key in .env
load_dotenv(override=True)


def run_pipeline(urls: list):
    print("\n=== DEMOLENS PIPELINE STARTING ===\n")

    print("STEP 1: Validating videos...")
    videos = validate_videos(urls)
    print(f"✓ {len(videos)} videos validated\n")

    print("STEP 2: Transcribing videos...")
    videos = transcribe_all_videos(
        videos, os.getenv("USETRANSCRIBE_API_KEY")
    )
    print("✓ Transcription complete\n")

    print("STEP 3: Extracting keyframes...")
    videos = process_all_videos(videos)
    print("✓ Scene detection complete\n")

    print("STEP 4: Generating PRD...")
    prd = generate_prd(videos, os.getenv("OPENAI_API_KEY"))
    save_prd(prd)
    print("✓ PRD saved to outputs/prd.md\n")

    print("STEP 5: Generating mockups...")
    mockups = generate_mockups(prd, os.getenv("OPENAI_API_KEY"))
    paths = save_mockups(mockups)
    print(f"✓ {len(mockups)} mockups saved\n")

    print("=== PIPELINE COMPLETE ===")
    print("PRD: outputs/prd.md")
    for path in paths:
        print(f"Mockup: {path}")


if __name__ == "__main__":
    urls = [
        "https://www.youtube.com/watch?v=jNQXAC9IVRw",
        "https://www.youtube.com/watch?v=ZbZSe6N_BXs",
    ]
    run_pipeline(urls)
