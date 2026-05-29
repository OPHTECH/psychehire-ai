from __future__ import annotations

import math
import tempfile
from pathlib import Path
from typing import Any

import numpy as np
from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel

app = FastAPI(title="PsycheHire Behavioral Intelligence Interview Engine")


class TranscriptRequest(BaseModel):
    transcript: str
    role: str = "General"


def clamp(value: float) -> int:
    return int(max(0, min(100, round(value))))


def content_scores(text: str) -> dict[str, Any]:
    lower = text.lower()
    accountability = sum(word in lower for word in ["owned", "accountable", "mistake", "learned", "documented", "escalated"])
    leadership = sum(word in lower for word in ["strategy", "mentor", "led", "prioritize", "decision", "stakeholder"])
    conflict = sum(word in lower for word in ["conflict", "pressure", "deadline", "feedback", "change"])
    hesitation = sum(word in lower for word in ["maybe", "um", "uh", "sort of", "i guess"])
    words = max(1, len(lower.split()))
    return {
        "accountability": clamp(45 + accountability * 10),
        "leadershipLanguage": clamp(42 + leadership * 9),
        "conflictMaturity": clamp(45 + conflict * 8),
        "clarity": clamp(85 - (hesitation / words) * 500),
        "flaggedSegments": [] if hesitation / words < 0.06 else [{"reason": "High hesitation density", "advisoryOnly": True}],
    }


@app.post("/analyze/transcript")
def analyze_transcript(request: TranscriptRequest):
    content = content_scores(request.transcript)
    return {
        "contentSummary": content,
        "behavioralScores": {
            "confidenceScore": clamp((content["clarity"] + content["leadershipLanguage"]) / 2),
            "truthfulnessProbability": clamp((content["accountability"] + content["clarity"]) / 2),
            "leadershipPresence": content["leadershipLanguage"],
            "socialCompatibility": clamp((content["conflictMaturity"] + content["accountability"]) / 2),
        },
        "humanReviewRequired": True,
        "advisoryOnly": True,
    }


@app.post("/analyze/video")
async def analyze_video(file: UploadFile = File(...)):
    suffix = Path(file.filename or "interview.webm").suffix or ".webm"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        path = Path(tmp.name)

    try:
        import cv2
    except Exception as exc:
        return {
            "error": "OpenCV is required for frame-level analysis.",
            "install": "pip install opencv-python mediapipe librosa faster-whisper",
            "detail": str(exc),
        }

    capture = cv2.VideoCapture(str(path))
    frame_count = 0
    brightness = []
    motion = []
    previous_gray = None
    face_frames = 0
    classifier = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

    while True:
        ok, frame = capture.read()
        if not ok:
            break
        frame_count += 1
        if frame_count % 5:
            continue
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        brightness.append(float(np.mean(gray)))
        faces = classifier.detectMultiScale(gray, 1.1, 4)
        if len(faces):
            face_frames += 1
        if previous_gray is not None:
            diff = cv2.absdiff(gray, previous_gray)
            motion.append(float(np.mean(diff)))
        previous_gray = gray

    capture.release()
    path.unlink(missing_ok=True)

    focus = face_frames / max(1, math.ceil(frame_count / 5))
    movement = float(np.mean(motion)) if motion else 0.0
    light = float(np.mean(brightness)) if brightness else 0.0
    return {
        "facialSummary": {
            "facePresenceRate": round(focus, 3),
            "lightingQuality": clamp(light / 2.55),
            "movementIntensity": round(movement, 2),
            "microExpressionModel": "Configure MediaPipe/OpenFace model weights for production FACS action-unit scoring.",
        },
        "behavioralScores": {
            "gazeStability": clamp(focus * 100 - movement * 0.5),
            "engagementScore": clamp(focus * 80 + min(20, light / 12)),
            "stressResilience": clamp(82 - movement * 0.7),
        },
        "humanReviewRequired": True,
        "advisoryOnly": True,
    }


@app.post("/analyze/audio")
async def analyze_audio(file: UploadFile = File(...)):
    suffix = Path(file.filename or "interview.wav").suffix or ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        path = Path(tmp.name)

    try:
        import librosa
    except Exception as exc:
        return {
            "error": "librosa is required for acoustic analysis.",
            "install": "pip install librosa soundfile faster-whisper",
            "detail": str(exc),
        }

    y, sr = librosa.load(str(path), sr=16000, mono=True)
    path.unlink(missing_ok=True)
    rms = librosa.feature.rms(y=y)[0]
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch_values = pitches[magnitudes > np.percentile(magnitudes, 90)]
    energy_variance = float(np.var(rms))
    pitch_variance = float(np.var(pitch_values)) if pitch_values.size else 0.0
    duration = librosa.get_duration(y=y, sr=sr)

    return {
        "voiceSummary": {
            "durationSeconds": round(duration, 2),
            "energyVariance": round(energy_variance, 6),
            "pitchVariance": round(pitch_variance, 2),
            "speechModel": "Whisper/faster-whisper transcription endpoint can be enabled with model weights in production.",
        },
        "behavioralScores": {
            "confidenceScore": clamp(65 + min(25, pitch_variance / 9000) - min(20, energy_variance * 5000)),
            "emotionalStability": clamp(78 - min(35, energy_variance * 8000)),
            "communicationClarity": clamp(70 + min(20, duration / 30)),
        },
        "humanReviewRequired": True,
        "advisoryOnly": True,
    }

