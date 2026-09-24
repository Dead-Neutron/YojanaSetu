from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.config import settings
from app.database import get_db, engine
from app.schemas import HealthResponse

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)):
    """
    Comprehensive system health diagnostic.
    Verifies database connectivity, Gemini Flash status, ElevenLabs, and Auth0.
    """
    db_status = "unconnected"
    if engine is not None:
        try:
            with engine.connect() as conn:
                db_status = "connected"
        except Exception:
            db_status = "fallback_active"

    gemini_status = "configured" if settings.GOOGLE_API_KEY and not settings.GOOGLE_API_KEY.startswith("your-") else "mock_mode"
    elevenlabs_status = "configured" if settings.ELEVENLABS_API_KEY and not settings.ELEVENLABS_API_KEY.startswith("your-") else "client_tts_fallback"
    auth0_status = "configured" if settings.AUTH0_DOMAIN and not settings.AUTH0_DOMAIN.startswith("your-") else "guest_mode"

    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        services={
            "database": db_status,
            "gemini_flash": gemini_status,
            "elevenlabs_voice": elevenlabs_status,
            "auth0": auth0_status
        }
    )
