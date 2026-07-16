"""DemoLens master pipeline: YouTube demo videos -> PRD + HTML mockups.

Usage:
    python pipeline.py <url1> [url2] [url3] [url4]
    python pipeline.py              # prompts for URLs interactively

The OpenAI API key is taken from the OPENAI_API_KEY environment variable
(or .env) if present; otherwise the user is prompted for it at runtime.
A prompted key is kept in memory only for the duration of the run — it is
never written to disk.
"""

import getpass
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

MIN_URLS = 1
MAX_URLS = 4


def get_urls(argv: list) -> list:
    """Collect 1-4 YouTube URLs from CLI arguments or interactive prompts."""
    urls = [arg.strip() for arg in argv if arg.strip()]

    if not urls:
        print(f"Enter {MIN_URLS} to {MAX_URLS} YouTube demo video URLs "
              "(blank line to finish):")
        while len(urls) < MAX_URLS:
            url = input(f"  URL {len(urls) + 1}: ").strip()
            if not url:
                break
            urls.append(url)

    if not MIN_URLS <= len(urls) <= MAX_URLS:
        raise ValueError(
            f"Expected {MIN_URLS} to {MAX_URLS} YouTube URLs, got {len(urls)}."
        )
    return urls


def get_openai_key() -> str:
    """Return the OpenAI API key from the environment, or prompt for it.

    A prompted key is used only for this session and never persisted.
    """
    key = os.getenv("OPENAI_API_KEY")
    if key:
        return key

    print("No OPENAI_API_KEY found in the environment or .env.")
    prompt = ("Enter your OpenAI API key (used for this session only, "
              "never stored): ")
    if sys.stdin.isatty():
        key = getpass.getpass(prompt).strip()  # hidden input
    else:
        # Piped/redirected stdin: getpass would bypass it and hang waiting
        # for the real console, so read the line directly instead.
        key = input(prompt).strip()
    if not key:
        raise ValueError("An OpenAI API key is required to generate the PRD "
                         "and mockups.")
    return key


def run_pipeline(urls: list, openai_key: str):
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
    prd = generate_prd(videos, openai_key)
    save_prd(prd)
    print("✓ PRD saved to outputs/prd.md\n")

    print("STEP 5: Generating mockups...")
    mockups = generate_mockups(prd, openai_key)
    paths = save_mockups(mockups)
    print(f"✓ {len(mockups)} mockups saved\n")

    print("=== PIPELINE COMPLETE ===")
    print("PRD: outputs/prd.md")
    for path in paths:
        print(f"Mockup: {path}")


def main() -> int:
    try:
        urls = get_urls(sys.argv[1:])
        openai_key = get_openai_key()
        run_pipeline(urls, openai_key)
    except ValueError as exc:
        # Expected rejections: bad/too-long videos, missing key, URL count.
        print(f"\nError: {exc}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        print("\nCancelled.", file=sys.stderr)
        return 130
    return 0


if __name__ == "__main__":
    sys.exit(main())
