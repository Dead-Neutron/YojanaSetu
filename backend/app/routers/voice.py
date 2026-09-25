import uuid
import io
import logging
from typing import Optional, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, Depends, Request, HTTPException
from fastapi.responses import StreamingResponse, Response
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.limiter import limiter
from app.core.security import get_current_user_optional
from app.database import get_db
from app.services.gemini import process_audio_with_gemini, synthesize_scheme_response
from app.services.rag import retrieve_relevant_schemes_for_voice
from app.services.sarvam import synthesize_speech_with_sarvam, clean_script_leakage
from app.services.elevenlabs import stream_regional_speech
from app.schemas import VoiceQueryResponse, DemographicInfo, SynthesizeSpeechRequest

logger = logging.getLogger("yojanasetu.voice")

router = APIRouter(tags=["Voice Assistant"])

# In-memory storage for synthesized audio sessions
_audio_cache: Dict[str, Dict[str, Any]] = {}


@router.post("/voice-query", response_model=VoiceQueryResponse)
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def handle_voice_query(
    request: Request,
    audio: UploadFile = File(..., description="WebM/WAV/MP3 audio blob from browser MediaRecorder"),
    language: str = Form("en", description="Citizen selected language code (bn, hi, en)"),
    client_transcript: Optional[str] = Form(None, description="Optional browser SpeechRecognition transcript"),
    db: Session = Depends(get_db),
    citizen: dict = Depends(get_current_user_optional)
):
    """
    Multimodal Voice-First Assistant Core.
    1. Ingests raw voice audio blob directly.
    2. Transcribes & auto-detects language using Sarvam AI Saaras model.
    3. Executes RAG hybrid retrieval over verified government schemes.
    4. Synthesizes empathetic, speech-optimized vernacular response with Gemini.
    5. Generates crystal-clear audio: Sarvam Bulbul (for Bengali/Hindi) or ElevenLabs (for English).
    6. Returns structured JSON with matching schemes and playable audio URL.
    """
    try:
        audio_bytes = await audio.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read audio payload: {str(e)}")

    mime_type = audio.content_type or "audio/webm"

    # Step 1: Multimodal Audio Extraction & Translation
    analysis = await process_audio_with_gemini(
        audio_bytes=audio_bytes,
        mime_type=mime_type,
        preferred_lang=language,
        client_transcript=client_transcript
    )

    transcript = analysis.get("transcript", "")
    detected_lang = analysis.get("detected_language", language)
    english_trans = analysis.get("english_translation", transcript)
    demographics = analysis.get("extracted_demographics", {})
    intent = analysis.get("intent", "General citizen welfare assistance")

    # Step 2: Hybrid RAG Scheme Retrieval
    matched_schemes = retrieve_relevant_schemes_for_voice(
        db=db,
        demographics=demographics,
        query_text=english_trans,
        limit=4
    )

    # Step 3: Regional Response Synthesis (Gemini speech-optimized localized response)
    synthesis = await synthesize_scheme_response(
        transcript=transcript,
        language=detected_lang,
        demographics=demographics,
        matched_schemes=matched_schemes
    )

    response_text = synthesis.get("response_text", "")
    raw_loc = synthesis.get("localized_response", response_text)
    # Ironclad script leakage sanitizer
    localized_response = clean_script_leakage(raw_loc, detected_lang)
    if detected_lang == "en":
        response_text = localized_response

    # Step 4: High-Fidelity Audio Generation
    audio_url = None
    audio_id = str(uuid.uuid4())

    try:
        if detected_lang != "en" and settings.SARVAM_API_KEY and not settings.SARVAM_API_KEY.startswith("your-"):
            # Sarvam Bulbul TTS for Indian Regional Languages (e.g. 'roopa' for Bengali, 'ritu' for Hindi)
            audio_data = await synthesize_speech_with_sarvam(
                text=localized_response,
                language_code=f"{detected_lang}-IN"
            )
            if audio_data:
                _audio_cache[audio_id] = {
                    "data": audio_data,
                    "media_type": "audio/wav"
                }
                audio_url = f"{settings.API_V1_STR}/voice-query/audio/{audio_id}"
                logger.info(f"Synthesized Sarvam Bulbul audio ({len(audio_data)} bytes) for {detected_lang}")
        elif detected_lang == "en":
            if settings.ELEVENLABS_API_KEY and not settings.ELEVENLABS_API_KEY.startswith("your-"):
                # ElevenLabs for English
                _audio_cache[audio_id] = {
                    "text": localized_response,
                    "media_type": "audio/mpeg",
                    "is_elevenlabs": True
                }
                audio_url = f"{settings.API_V1_STR}/voice-query/audio/{audio_id}"
                logger.info("ElevenLabs audio queued for English playback")
            elif settings.SARVAM_API_KEY and not settings.SARVAM_API_KEY.startswith("your-"):
                # Fallback to Sarvam Bulbul English (aditya)
                audio_data = await synthesize_speech_with_sarvam(
                    text=localized_response,
                    language_code="en-IN"
                )
                if audio_data:
                    _audio_cache[audio_id] = {
                        "data": audio_data,
                        "media_type": "audio/wav"
                    }
                    audio_url = f"{settings.API_V1_STR}/voice-query/audio/{audio_id}"
                    logger.info(f"Synthesized Sarvam Bulbul English audio ({len(audio_data)} bytes)")
    except Exception as e:
        logger.warning(f"Audio generation failed: {e}")

    return VoiceQueryResponse(
        transcript=transcript,
        detected_language=detected_lang,
        english_translation=english_trans,
        extracted_demographics=DemographicInfo(
            state=demographics.get("state"),
            age=demographics.get("age"),
            gender=demographics.get("gender"),
            occupation=demographics.get("occupation"),
            income=demographics.get("income"),
            caste=demographics.get("caste")
        ),
        intent=intent,
        response_text=response_text,
        localized_response=localized_response,
        audio_url=audio_url,
        schemes=matched_schemes
    )


@router.post("/voice-query/synthesize-text")
async def synthesize_text_audio(
    payload: SynthesizeSpeechRequest
):
    """
    On-demand speech synthesis endpoint for quick topic clicks or replays.
    Uses Sarvam Bulbul for Indian regional languages and ElevenLabs for English.
    """
    text = payload.text.strip()
    lang = payload.language.strip().lower()

    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    clean_text = clean_script_leakage(text, lang)

    # Priority: Sarvam Bulbul for Indic languages
    if lang != "en" and settings.SARVAM_API_KEY and not settings.SARVAM_API_KEY.startswith("your-"):
        audio_bytes = await synthesize_speech_with_sarvam(clean_text, f"{lang}-IN")
        if audio_bytes:
            return Response(content=audio_bytes, media_type="audio/wav")

    # Priority: ElevenLabs for English with Sarvam Bulbul fallback
    if lang == "en":
        if settings.ELEVENLABS_API_KEY and not settings.ELEVENLABS_API_KEY.startswith("your-"):
            stream_gen = await stream_regional_speech(clean_text)
            if stream_gen:
                return StreamingResponse(stream_gen, media_type="audio/mpeg")
        if settings.SARVAM_API_KEY and not settings.SARVAM_API_KEY.startswith("your-"):
            audio_bytes = await synthesize_speech_with_sarvam(clean_text, "en-IN")
            if audio_bytes:
                return Response(content=audio_bytes, media_type="audio/wav")

    raise HTTPException(status_code=503, detail="Audio synthesis service currently unavailable")


@router.get("/voice-query/audio/{audio_id}")
async def stream_audio_response(audio_id: str):
    """
    Serves synthesized vernacular speech via Sarvam Bulbul or ElevenLabs.
    """
    cached = _audio_cache.get(audio_id)
    if not cached:
        raise HTTPException(status_code=404, detail="Audio session expired or not found")

    if cached.get("is_elevenlabs"):
        text = cached.get("text", "")
        stream_gen = await stream_regional_speech(text)
        if stream_gen:
            return StreamingResponse(stream_gen, media_type="audio/mpeg")
        # If ElevenLabs stream fails (e.g. quota exceeded), fallback seamlessly to Sarvam Bulbul English
        if settings.SARVAM_API_KEY and not settings.SARVAM_API_KEY.startswith("your-"):
            audio_data = await synthesize_speech_with_sarvam(text, "en-IN")
            if audio_data:
                return Response(content=audio_data, media_type="audio/wav")
        raise HTTPException(status_code=503, detail="Voice synthesis service currently unavailable")

    audio_data = cached.get("data")
    media_type = cached.get("media_type", "audio/wav")
    if not audio_data:
        raise HTTPException(status_code=404, detail="Audio data missing")

    return Response(content=audio_data, media_type=media_type)
