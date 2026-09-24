import logging
from typing import AsyncGenerator, Optional
import httpx
from app.core.config import settings

logger = logging.getLogger("yojanasetu.elevenlabs")

ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech"


async def stream_regional_speech(
    text: str,
    voice_id: Optional[str] = None
) -> Optional[AsyncGenerator[bytes, None]]:
    """
    Synthesize natural Indian regional voice using ElevenLabs eleven_multilingual_v2 model.
    Yields chunks of audio/mpeg for low-latency streaming playback.
    Returns None if ELEVENLABS_API_KEY is not configured, triggering smooth browser fallback.
    """
    if not settings.ELEVENLABS_API_KEY or settings.ELEVENLABS_API_KEY.startswith("your-"):
        logger.info("ElevenLabs API key not configured. Deferring to browser speech synthesis.")
        return None

    vid = voice_id or settings.ELEVENLABS_VOICE_ID or "21m00Tcm4TlvDq8ikWAM"
    url = f"{ELEVENLABS_API_URL}/{vid}/stream"

    headers = {
        "xi-api-key": settings.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }

    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.8,
            "style": 0.2,
            "use_speaker_boost": True
        }
    }

    try:
        client = httpx.AsyncClient(timeout=30.0)
        req = client.build_request("POST", url, headers=headers, json=payload)
        resp = await client.send(req, stream=True)

        if resp.status_code == 200:
            async def audio_generator() -> AsyncGenerator[bytes, None]:
                try:
                    async for chunk in resp.aiter_bytes(chunk_size=1024):
                        yield chunk
                finally:
                    await resp.aclose()
                    await client.aclose()

            return audio_generator()
        else:
            err_body = await resp.aread()
            logger.warning(f"ElevenLabs error response {resp.status_code}: {err_body.decode('utf-8', errors='ignore')}")
            await resp.aclose()
            await client.aclose()
    except Exception as e:
        logger.error(f"ElevenLabs TTS streaming failed: {e}")

    return None
