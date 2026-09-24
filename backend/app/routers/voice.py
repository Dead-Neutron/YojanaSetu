import uuid
from typing import Optional, Dict
from fastapi import APIRouter, UploadFile, File, Form, Depends, Request, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.limiter import limiter
from app.core.security import get_current_user_optional
from app.database import get_db
from app.services.gemini import process_audio_with_gemini, synthesize_scheme_response
from app.services.rag import retrieve_relevant_schemes_for_voice
from app.services.elevenlabs import stream_regional_speech
from app.schemas import VoiceQueryResponse, DemographicInfo

router = APIRouter(tags=["Voice Assistant"])

# In-memory storage for synthesized audio sessions if needed
_audio_cache: Dict[str, bytes] = {}


@router.post("/voice-query", response_model=VoiceQueryResponse)
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def handle_voice_query(
    request: Request,
    audio: UploadFile = File(..., description="WebM/WAV/MP3 audio blob from browser MediaRecorder"),
    language: str = Form("en", description="Citizen selected language code (hi, bn, en)"),
    db: Session = Depends(get_db),
    citizen: dict = Depends(get_current_user_optional)
):
    """
    Multimodal Voice-First Assistant Core.
    1. Ingests raw voice audio blob directly.
    2. Transcribes and extracts citizen demographics via Gemini Flash multimodal.
    3. Executes RAG hybrid retrieval over verified government schemes.
    4. Synthesizes empathetic, vernacular spoken response.
    5. Returns structured JSON with matching schemes and audio playback URL.
    """
    try:
        audio_bytes = await audio.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read audio payload: {str(e)}")

    mime_type = audio.content_type or "audio/webm"

    # Step 1: Multimodal Audio Extraction with Gemini Flash
    analysis = await process_audio_with_gemini(
        audio_bytes=audio_bytes,
        mime_type=mime_type,
        preferred_lang=language
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

    # Step 3: Regional Response Synthesis
    synthesis = await synthesize_scheme_response(
        transcript=transcript,
        language=detected_lang,
        demographics=demographics,
        matched_schemes=matched_schemes
    )

    response_text = synthesis.get("response_text", "")
    localized_response = synthesis.get("localized_response", response_text)

    # Step 4: ElevenLabs audio URL generation (if configured)
    audio_url = None
    if settings.ELEVENLABS_API_KEY and not settings.ELEVENLABS_API_KEY.startswith("your-"):
        audio_id = str(uuid.uuid4())
        audio_url = f"{settings.API_V1_STR}/voice-query/audio/{audio_id}"
        # Store localized response text to stream on demand
        _audio_cache[audio_id] = localized_response.encode("utf-8")

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


@router.get("/voice-query/audio/{audio_id}")
async def stream_audio_response(audio_id: str):
    """
    Zero-latency streaming endpoint for synthesized vernacular speech via ElevenLabs.
    """
    cached_text_bytes = _audio_cache.get(audio_id)
    if not cached_text_bytes:
        raise HTTPException(status_code=404, detail="Audio session expired or not found")

    text = cached_text_bytes.decode("utf-8")
    stream_gen = await stream_regional_speech(text)
    if not stream_gen:
        raise HTTPException(status_code=503, detail="Voice synthesis service currently unavailable")

    return StreamingResponse(stream_gen, media_type="audio/mpeg")
