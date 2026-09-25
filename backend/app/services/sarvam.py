import logging
import base64
import re
from typing import Optional, Dict, Any
import httpx
from app.core.config import settings

logger = logging.getLogger("yojanasetu.sarvam")

# Sarvam AI API Endpoints
SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"
SARVAM_LEGACY_STT_TRANSLATE_URL = "https://api.sarvam.ai/speech-to-text-translate"
SARVAM_TRANSLATE_URL = "https://api.sarvam.ai/translate"
SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech"

# Authentic studio-recorded native speakers for Sarvam Bulbul Indic TTS
# Bengali (bn-IN): 'roopa' is the tier-1 native Bengali speaker with authentic cadence and pronunciation.
# Hindi (hi-IN): 'ritu' is the native Hindi speaker.
# Tamil (ta-IN): 'priya', Telugu (te-IN): 'ishita', English (en-IN): 'aditya'
SARVAM_SPEAKERS_BY_LANG = {
    "bn": "roopa",
    "hi": "ritu",
    "ta": "priya",
    "te": "ishita",
    "mr": "aditi",
    "gu": "pooja",
    "kn": "deepa",
    "ml": "arya",
    "pa": "gurpreet",
    "od": "manaswi",
    "en": "aditya"
}


async def translate_audio_with_sarvam(
    audio_bytes: bytes,
    mime_type: str = "audio/webm"
) -> Optional[Dict[str, Any]]:
    """
    Direct Audio-to-English translation using Sarvam AI Saaras model.
    Transcribes Indic spoken audio (Hindi, Bengali, Tamil, etc.) and translates
    it directly into clean English in a single ~600ms call with auto-detected language.
    Returns:
        {
            "transcript": "English translated query",
            "language_code": "bn-IN" / "hi-IN" / etc.
        }
    """
    if not settings.SARVAM_API_KEY or settings.SARVAM_API_KEY.startswith("your-"):
        return None

    headers = {
        "api-subscription-key": settings.SARVAM_API_KEY
    }

    extension = "webm"
    if "wav" in mime_type:
        extension = "wav"
    elif "mp3" in mime_type or "mpeg" in mime_type:
        extension = "mp3"
    elif "ogg" in mime_type:
        extension = "ogg"

    files = {
        "file": (f"audio.{extension}", audio_bytes, mime_type)
    }

    # Attempt 1: Modern /speech-to-text with mode="translate" & automatic language detection
    try:
        data_v3 = {
            "model": "saaras:v3",
            "mode": "translate",
            "language_code": "unknown"
        }
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(SARVAM_STT_URL, headers=headers, files=files, data=data_v3)
            if resp.status_code == 200:
                res_json = resp.json()
                transcript = (res_json.get("transcript") or "").strip()
                lang_code = res_json.get("language_code", "en-IN")
                if transcript:
                    logger.info(f"Sarvam AI Saaras v3 audio translated ({lang_code}): '{transcript}'")
                    return {
                        "transcript": transcript,
                        "language_code": lang_code
                    }
            elif resp.status_code in (400, 404):
                # Fallback to legacy endpoint with saaras:v2.5 / saaras:v2
                logger.info("Attempting Sarvam legacy STT-translate endpoint...")
                data_legacy = {"model": "saaras:v2.5"}
                resp_legacy = await client.post(SARVAM_LEGACY_STT_TRANSLATE_URL, headers=headers, files=files, data=data_legacy)
                if resp_legacy.status_code == 200:
                    res_json = resp_legacy.json()
                    transcript = (res_json.get("transcript") or "").strip()
                    lang_code = res_json.get("language_code", "en-IN")
                    if transcript:
                        logger.info(f"Sarvam AI legacy translated ({lang_code}): '{transcript}'")
                        return {
                            "transcript": transcript,
                            "language_code": lang_code
                        }
            else:
                logger.warning(f"Sarvam STT-Translate error {resp.status_code}: {resp.text[:200]}")
    except Exception as e:
        logger.warning(f"Sarvam STT-Translate call failed: {e}")

    return None


def clean_script_leakage(text: str, target_lang_code: str = "bn-IN") -> str:
    """
    Sanitizes speech text against cross-lingual tokenizer leaks and raw formatting.
    E.g. Converts leaked Kannada tokens 'ವರೆಗিন' (up to) into Bengali 'পর্যন্ত' (with proper spacing),
    strips non-target Indic script Unicode ranges, and strips visual symbols (/-).
    """
    if not text:
        return ""

    cleaned = text
    norm_lang = target_lang_code.lower()

    if "en" in norm_lang:
        # Strip all Indic script blocks if English text
        cleaned = re.sub(r"[\u0900-\u0D7F]+", "", cleaned)
        cleaned = cleaned.replace("/-", "")
        cleaned = re.sub(r"[*#_`~]", "", cleaned)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
    elif "bn" in norm_lang:
        # 1. Map known cross-lingual tokens from Kannada/Telugu to Bengali
        # Ensure proper spacing when attached to Bengali words (e.g. 'টাকারವರೆগিন' -> 'টাকার পর্যন্ত')
        cleaned = re.sub(r"টাকার\s*ವರೆগিন", "টাকার পর্যন্ত", cleaned)
        cleaned = re.sub(r"টাকা\s*ವರೆগিন", "টাকা পর্যন্ত", cleaned)
        cleaned = re.sub(r"ವರೆগিন", " পর্যন্ত", cleaned)
        cleaned = re.sub(r"ವರೆಗೂ", " পর্যন্ত", cleaned)
        
        # 2. Strip any non-Bengali Indic script blocks (Kannada, Telugu, Tamil, Malayalam)
        # Kannada: \u0C80-\u0CFF, Telugu: \u0C00-\u0C7F, Tamil: \u0B80-\u0BFF, Malayalam: \u0D00-\u0D7F
        cleaned = re.sub(r"[\u0C80-\u0CFF\u0C00-\u0C7F\u0B80-\u0BFF\u0D00-\u0D7F]+", "", cleaned)
        
        # 3. Clean up visual noise like '/-', asterisks, hashes
        cleaned = cleaned.replace("/-", "")
        cleaned = re.sub(r"[*#_`~]", "", cleaned)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
    elif "hi" in norm_lang:
        cleaned = re.sub(r"रुपये\s*ವರೆಗಿನ", "रुपये तक", cleaned)
        cleaned = re.sub(r"ವರೆগিন", " तक", cleaned)
        cleaned = re.sub(r"ವರೆಗೂ", " तक", cleaned)
        cleaned = re.sub(r"[\u0C80-\u0CFF\u0C00-\u0C7F\u0B80-\u0BFF\u0D00-\u0D7F]+", "", cleaned)
        cleaned = cleaned.replace("/-", "")
        cleaned = re.sub(r"[*#_`~]", "", cleaned)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
    else:
        cleaned = cleaned.replace("/-", "")
        cleaned = re.sub(r"[*#_`~]", "", cleaned)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()

    return cleaned


async def translate_text_with_sarvam(
    text: str,
    target_lang_code: str = "hi-IN",
    source_lang_code: str = "en-IN"
) -> Optional[str]:
    """
    Translates English scheme explanation into the citizen's vernacular language
    using Sarvam Mayura model. Sanitizes the output against tokenizer leaks.
    """
    if not settings.SARVAM_API_KEY or settings.SARVAM_API_KEY.startswith("your-"):
        return None

    # Normalize language codes to standard 5-char codes (e.g. 'hi' -> 'hi-IN')
    norm_target = target_lang_code
    if len(target_lang_code) == 2:
        norm_target = f"{target_lang_code}-IN"

    if norm_target == source_lang_code:
        return text

    headers = {
        "api-subscription-key": settings.SARVAM_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "input": text[:950],
        "source_language_code": source_lang_code,
        "target_language_code": norm_target,
        "speaker_gender": "Female",
        "mode": "formal",
        "model": "mayura:v1"
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(SARVAM_TRANSLATE_URL, headers=headers, json=payload)
            if resp.status_code == 200:
                res_json = resp.json()
                translated = (res_json.get("translated_text") or "").strip()
                if translated:
                    sanitized = clean_script_leakage(translated, norm_target)
                    logger.info(f"Sarvam Mayura translated to {norm_target}: '{sanitized[:60]}...'")
                    return sanitized
            else:
                logger.warning(f"Sarvam Mayura translation error {resp.status_code}: {resp.text[:200]}")
    except Exception as e:
        logger.warning(f"Sarvam text translation failed: {e}")

    return None


async def synthesize_speech_with_sarvam(
    text: str,
    language_code: str = "bn-IN"
) -> Optional[bytes]:
    """
    Generates high-definition regional speech audio using Sarvam Bulbul TTS.
    - Uses native Bengali speaker 'roopa' for bn-IN
    - Uses native Hindi speaker 'ritu' for hi-IN
    - Sanitizes text before passing to the acoustic model to eliminate speech glitches
    Returns raw audio bytes (WAV/MP3).
    """
    if not settings.SARVAM_API_KEY or settings.SARVAM_API_KEY.startswith("your-"):
        return None

    norm_lang = language_code
    if len(language_code) == 2:
        norm_lang = f"{language_code}-IN"

    lang_prefix = norm_lang.split("-")[0]
    speaker = SARVAM_SPEAKERS_BY_LANG.get(lang_prefix, "roopa")

    # Clean any script leakage or symbols before audio synthesis
    clean_text = clean_script_leakage(text, norm_lang)
    if not clean_text:
        return None

    headers = {
        "api-subscription-key": settings.SARVAM_API_KEY,
        "Content-Type": "application/json"
    }

    # Models supported by Sarvam TTS: bulbul:v3 (primary production), bulbul:v2, bulbul:v4-flash
    candidate_models = ["bulbul:v3", "bulbul:v2", "bulbul:v4-flash", "bulbul:v1"]

    for model_name in candidate_models:
        payload = {
            "inputs": [clean_text[:500]],
            "target_language_code": norm_lang,
            "speaker": speaker,
            "pitch": 0,
            "pace": 1.0,
            "loudness": 1.5,
            "speech_sample_rate": 22050,
            "enable_preprocessing": True,
            "model": model_name
        }

        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                resp = await client.post(SARVAM_TTS_URL, headers=headers, json=payload)
                if resp.status_code == 200:
                    res_json = resp.json()
                    audios = res_json.get("audios", [])
                    if audios and len(audios) > 0:
                        audio_b64 = audios[0]
                        audio_bytes = base64.b64decode(audio_b64)
                        logger.info(f"Sarvam Bulbul TTS ({model_name}, speaker '{speaker}', {norm_lang}) synthesized {len(audio_bytes)} bytes")
                        return audio_bytes
                elif resp.status_code == 400 and "model" in resp.text:
                    continue  # Try next candidate model
                else:
                    logger.warning(f"Sarvam Bulbul TTS ({model_name}) error {resp.status_code}: {resp.text[:200]}")
        except Exception as e:
            logger.warning(f"Sarvam Bulbul TTS call with {model_name} failed: {e}")

    return None
