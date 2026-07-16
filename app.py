"""DemoLens web UI — Flask app wrapping the video-to-PRD pipeline.

Run:  python app.py   →  http://127.0.0.1:5000

The OpenAI key entered in the form is held in memory for the duration of
the generation job only — it is never logged or written to disk. If the
field is left blank, the server's OPENAI_API_KEY (.env) is used instead.
"""

import os
import sys
import threading

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request, send_from_directory

# Windows consoles default to cp1252, which crashes on transcript characters;
# force UTF-8 so pipeline output always prints.
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# override=True: a stale OPENAI_API_KEY in the Windows user environment
# would otherwise shadow the key in .env
load_dotenv(override=True)

from modules.youtube import validate_videos
from modules.transcribe import transcribe_all_videos
from modules.scene_detector import process_all_videos
from modules.prd_generator import generate_prd, save_prd
from modules.mockup_generator import generate_mockups, save_mockups

app = Flask(__name__)

STAGES = [
    "Validating videos",
    "Transcribing audio",
    "Extracting keyframes",
    "Generating PRD",
    "Generating mockups",
]

MIN_URLS, MAX_URLS = 1, 4
MAX_LOG_CHARS = 200_000

# One generation job at a time. The job dict is the single source of truth
# the /api/status endpoint reports from.
_job_lock = threading.Lock()
_job = None


class _LogTee:
    """Mirror stdout into the active job's log so the UI can stream it."""

    def __init__(self, original, job):
        self._original = original
        self._job = job

    def write(self, text):
        self._original.write(text)
        self._job["log"] += text
        if len(self._job["log"]) > MAX_LOG_CHARS:
            self._job["log"] = self._job["log"][-MAX_LOG_CHARS:]

    def flush(self):
        self._original.flush()

    def __getattr__(self, name):
        return getattr(self._original, name)


def _run_job(job, urls, openai_key):
    # Swapping sys.stdout is process-wide, but only one job runs at a time
    # and the web routes themselves never print.
    original_stdout = sys.stdout
    sys.stdout = _LogTee(original_stdout, job)
    try:
        job["stage"] = 0
        videos = validate_videos(urls)

        job["stage"] = 1
        videos = transcribe_all_videos(videos, os.getenv("USETRANSCRIBE_API_KEY"))

        job["stage"] = 2
        videos = process_all_videos(videos)

        job["stage"] = 3
        prd = generate_prd(videos, openai_key)

        job["stage"] = 4
        mockups = generate_mockups(prd, openai_key)
        paths = save_mockups(mockups)

        job["prd"] = prd
        job["mockups"] = [
            {"screen_name": mockup["screen_name"], "url": f"/{path}"}
            for mockup, path in zip(mockups, paths)
        ]
        job["stage"] = len(STAGES)
        job["status"] = "done"
    except Exception as exc:  # surface any stage failure to the UI
        job["status"] = "error"
        job["error"] = str(exc)
    finally:
        sys.stdout = original_stdout


@app.route("/")
def index():
    return render_template(
        "index.html",
        stages=STAGES,
        server_has_key=bool(os.getenv("OPENAI_API_KEY")),
    )


@app.route("/api/generate", methods=["POST"])
def generate():
    global _job
    data = request.get_json(silent=True) or {}

    urls = [u.strip() for u in data.get("urls", []) if isinstance(u, str) and u.strip()]
    if not MIN_URLS <= len(urls) <= MAX_URLS:
        return jsonify({"error": f"Provide {MIN_URLS} to {MAX_URLS} YouTube URLs."}), 400

    openai_key = (data.get("openai_key") or "").strip() or os.getenv("OPENAI_API_KEY")
    if not openai_key:
        return jsonify({"error": "An OpenAI API key is required (the server has "
                                 "none configured)."}), 400

    with _job_lock:
        if _job and _job["status"] == "running":
            return jsonify({"error": "A generation job is already running."}), 409
        _job = {
            "status": "running",
            "stage": 0,
            "log": "",
            "prd": None,
            "mockups": [],
            "error": None,
        }
        threading.Thread(
            target=_run_job, args=(_job, urls, openai_key), daemon=True
        ).start()

    return jsonify({"ok": True})


@app.route("/api/status")
def status():
    if _job is None:
        return jsonify({"status": "idle"})
    return jsonify(
        {
            "status": _job["status"],
            "stage": _job["stage"],
            "stages": STAGES,
            "log": _job["log"],
            "prd": _job["prd"],
            "mockups": _job["mockups"],
            "error": _job["error"],
        }
    )


@app.route("/outputs/<path:filename>")
def outputs(filename):
    return send_from_directory("outputs", filename)


if __name__ == "__main__":
    print("DemoLens web UI running at http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=False)
