"""PRD generation from transcripts + keyframes using GPT-4o vision."""

import base64
import os
from pathlib import Path

from openai import OpenAI

MAX_IMAGES = 8
OUTPUTS_DIR = Path("outputs")

# Defaults target the OpenAI API. Set OPENAI_BASE_URL/OPENAI_MODEL in .env to
# use an OpenAI-compatible provider instead, e.g. GitHub Models:
#   OPENAI_BASE_URL=https://models.github.ai/inference
#   OPENAI_MODEL=openai/gpt-4o
DEFAULT_MODEL = "gpt-4o"

SYSTEM_PROMPT = """You are a senior product manager. You are given transcripts
and screenshots from product demo videos. Your job is to
reverse-engineer the product and write a comprehensive PRD.

The PRD must include these exact sections:

# 1. Product Overview
What the product is and who it is for.

# 2. Business Scenarios
3 to 5 real-world situations where this product solves a problem.

# 3. User Roles
Every type of user with their permissions and goals.

# 4. Key Features
Every feature visible in the demo with a clear description.

# 5. User Stories
For each feature write:
As a [role], I can [action] so that [benefit].

# 6. Technical Specifications
Inferred data models, key API endpoints, and technical decisions
based on what you see in the UI.

Be specific. Use the transcript and screenshots as your only
source of truth. Do not make things up."""


def image_to_base64(image_path: str) -> str:
    """Read an image file and return it as a base64 string."""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def _select_frames(videos: list, max_images: int = MAX_IMAGES) -> list:
    """Collect frames from all videos, evenly sampled down to max_images."""
    all_frames = [frame for video in videos for frame in video.get("frames", [])]
    if len(all_frames) <= max_images:
        return all_frames
    step = (len(all_frames) - 1) / (max_images - 1)
    indices = sorted({round(i * step) for i in range(max_images)})
    return [all_frames[i] for i in indices]


def build_messages(videos: list) -> list:
    """Build the GPT-4o messages array: transcripts + keyframe images."""
    transcript_sections = []
    for video in videos:
        transcript_sections.append(
            f"## Video: {video.get('title', video['url'])}\n"
            f"URL: {video['url']}\n\n"
            f"Transcript:\n{video.get('transcript', '(no transcript)')}"
        )

    user_content = [
        {
            "type": "text",
            "text": (
                "Here are the demo video transcripts and keyframe screenshots. "
                "Reverse-engineer the product and write the PRD.\n\n"
                + "\n\n---\n\n".join(transcript_sections)
            ),
        }
    ]

    # OPENAI_IMAGE_DETAIL=low keeps requests under the ~8k input-token cap of
    # free-tier providers like GitHub Models (85 tokens/image vs ~1k at full).
    image_detail = os.getenv("OPENAI_IMAGE_DETAIL")
    for frame in _select_frames(videos):
        image_url = {
            "url": (
                "data:image/jpeg;base64,"
                f"{image_to_base64(frame['image_path'])}"
            )
        }
        if image_detail:
            image_url["detail"] = image_detail
        user_content.append({"type": "image_url", "image_url": image_url})

    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_content},
    ]


def save_prd(prd: str, output_path: str = "outputs/prd.md") -> None:
    """Save PRD markdown to file, creating the outputs folder if needed."""
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(prd)
    print(f"PRD saved to {output_path}")


def generate_prd(videos: list, openai_key: str) -> str:
    """Generate a PRD with GPT-4o, streaming output to the console."""
    if not openai_key:
        raise ValueError("Missing OpenAI API key. Set OPENAI_API_KEY in .env.")

    messages = build_messages(videos)
    image_count = sum(
        1 for block in messages[1]["content"] if block["type"] == "image_url"
    )
    print(f"Sending {image_count} keyframes + transcripts to GPT-4o...\n")

    client = OpenAI(
        api_key=openai_key,
        base_url=os.getenv("OPENAI_BASE_URL") or None,
    )
    stream = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", DEFAULT_MODEL),
        messages=messages,
        max_tokens=4000,
        stream=True,
    )

    full_prd = ""
    for chunk in stream:
        if not chunk.choices:
            continue
        content = chunk.choices[0].delta.content
        if content:
            print(content, end="", flush=True)
            full_prd += content
    print()

    save_prd(full_prd)
    return full_prd
