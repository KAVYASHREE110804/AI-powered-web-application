"""Scene detection and keyframe extraction.

Downloads videos with yt-dlp, detects scene changes with PySceneDetect,
and extracts the middle frame of each scene with OpenCV.
"""

import os
import subprocess
from pathlib import Path

import cv2
import numpy as np
import yt_dlp
from scenedetect import ContentDetector, detect


def _check_ffmpeg() -> None:
    try:
        result = subprocess.run(["ffmpeg", "-version"], capture_output=True)
        if result.returncode != 0:
            raise EnvironmentError(
                "ffmpeg not found. Install it: https://ffmpeg.org/download.html"
            )
    except FileNotFoundError:
        raise EnvironmentError(
            "ffmpeg not found. Install it: https://ffmpeg.org/download.html"
        ) from None


_check_ffmpeg()

DOWNLOADS_DIR = Path("downloads")
OUTPUTS_DIR = Path("outputs")
SCENE_THRESHOLD = 27.0


def download_video(url: str, video_id: str) -> str:
    """Download a video at max 720p; return the downloaded file path."""
    DOWNLOADS_DIR.mkdir(exist_ok=True)

    ydl_opts = {
        "format": "best[height<=720]",
        "outtmpl": f"downloads/{video_id}.%(ext)s",
        "quiet": False,
    }
    print(f"Downloading {url} (max 720p)...")
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        video_path = ydl.prepare_filename(info)

    print(f"Downloaded to {video_path}")
    return video_path


def extract_keyframes(
    video_path: str, video_id: str, max_frames: int = 20
) -> list:
    """Detect scenes and save the middle frame of each as a JPEG.

    Returns a list of dicts:
    { scene_number, timestamp_seconds, image_path }
    """
    output_dir = OUTPUTS_DIR / video_id
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Detecting scenes in {video_path}...")
    scene_list = detect(video_path, ContentDetector(threshold=SCENE_THRESHOLD))

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"OpenCV could not open video: {video_path}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    if scene_list:
        frame_ranges = [
            (scene[0].get_frames(), scene[1].get_frames())
            for scene in scene_list
        ]
        print(f"Detected {len(frame_ranges)} scenes")
    else:
        # Single-shot videos produce no cuts; treat the whole video as one scene.
        print("No scene cuts detected — using the whole video as one scene")
        frame_ranges = [(0, total_frames)]

    if len(frame_ranges) > max_frames:
        indices = np.linspace(0, len(frame_ranges) - 1, max_frames, dtype=int)
        frame_ranges = [frame_ranges[i] for i in indices]
        print(f"Sampling {max_frames} evenly spaced scenes")

    keyframes = []
    for i, (start_frame, end_frame) in enumerate(frame_ranges, start=1):
        mid_frame = (start_frame + end_frame) // 2
        if total_frames:
            mid_frame = min(mid_frame, total_frames - 1)

        cap.set(cv2.CAP_PROP_POS_FRAMES, mid_frame)
        ret, frame = cap.read()
        if not ret:
            print(f"Warning: could not read frame {mid_frame}, skipping scene {i}")
            continue

        timestamp = mid_frame / fps
        image_path = f"outputs/{video_id}/frame_{i}.jpg"
        cv2.imwrite(image_path, frame)
        print(f"Extracted frame {i} at timestamp {timestamp:.1f}s")

        keyframes.append(
            {
                "scene_number": i,
                "timestamp_seconds": timestamp,
                "image_path": image_path,
            }
        )

    cap.release()
    return keyframes


def process_video_scenes(url: str, video_id: str) -> list:
    """Download a video, extract keyframes, then delete the download."""
    video_path = download_video(url, video_id)
    try:
        keyframes = extract_keyframes(video_path, video_id)
    finally:
        if os.path.exists(video_path):
            os.remove(video_path)
            print(f"Cleaned up {video_path}")
    return keyframes


def process_all_videos(videos: list) -> list:
    """Add extracted keyframes to each video metadata dict."""
    results = []
    for video in videos:
        frames = process_video_scenes(video["url"], video["id"])
        results.append({**video, "frames": frames})
    return results
