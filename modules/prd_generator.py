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

SYSTEM_PROMPT = """You are a product analyst reverse-engineering a Product
Requirements Document from product demo videos. You are given (1) the video
transcript(s) and (2) screenshots of detected key scenes. These are your
ONLY sources.

GROUNDING RULES (strict):
- Base every statement ONLY on the provided transcripts and screenshots.
  Do NOT use outside knowledge about the product or company, even if you
  recognize it.
- NEVER invent technical details a demo video would not reveal — API endpoint
  paths, database schemas, field names, internal architecture — unless they
  are explicitly shown or spoken in the source.
- For "Technical / Product Specifications", describe functional and
  behavioral requirements inferred from the observed UI and narration,
  NOT invented implementation details.
- If a required section is not supported by the source, write:
  "Not shown in source material." Do not fill the gap with plausible guesses.

LABELING:
- Mark content as [Observed] when it is directly stated or visible in the
  source, and reference the transcript line or scene it came from.
- Mark content as [Inferred] when it is reasonable extrapolation. It must be
  clearly flagged as inference, never presented as fact.

Produce the PRD with these sections: Product Overview, Business Scenarios,
User Roles, Key Features, User Stories, Technical/Product Specifications.
For each Key Feature, cite the specific transcript snippet or scene that
supports it."""


def image_to_base64(image_path: str) -> str:
    """Read an image file and return it as a base64 string."""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def _select_frames(videos: list, max_images: int = MAX_IMAGES) -> list:
    """Collect frames from all videos, evenly sampled down to max_images."""
    all_frames = [frame for video in videos for frame in video.get("frames", [])]
    if len(all_frames) <= max_images:
        return all_frames
    if max_images < 2:
        return all_frames[:max_images]
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

    # Default "auto" = full-quality vision. Set OPENAI_IMAGE_DETAIL=low only
    # to fit free-tier input-token caps (e.g. GitHub Models' ~8k); it
    # downscales screenshots and weakens visual grounding.
    image_detail = os.getenv("OPENAI_IMAGE_DETAIL") or "auto"
    for frame in _select_frames(videos):
        user_content.append(
            {
                "type": "image_url",
                "image_url": {
                    "url": (
                        "data:image/jpeg;base64,"
                        f"{image_to_base64(frame['image_path'])}"
                    ),
                    "detail": image_detail,
                },
            }
        )

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
    if not videos:
        raise ValueError("No videos to generate a PRD from.")

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
        temperature=0.2,
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
