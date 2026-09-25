import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import get_current_user_optional
from app.database import get_db
from app.models import CitizenProfile
from app.schemas import AuthConfigResponse, UserProfile, DemographicInfo

logger = logging.getLogger("yojanasetu.auth")
router = APIRouter(prefix="/auth", tags=["Authentication & Citizen Identity"])

# In-memory user demographic profiles cache as fallback
_user_demographics_db: Dict[str, DemographicInfo] = {}


@router.get("/config", response_model=AuthConfigResponse)
def get_auth_configuration():
    """
    Public Auth0 metadata endpoint.
    Supplies the frontend with Auth0 client settings.
    If unconfigured, frontend gracefully operates in guest citizen mode with simulated Auth0 testing.
    """
    is_conf = bool(settings.AUTH0_DOMAIN and not settings.AUTH0_DOMAIN.startswith("your-"))
    return AuthConfigResponse(
        domain=settings.AUTH0_DOMAIN,
        client_id=settings.AUTH0_CLIENT_ID,
        audience=settings.AUTH0_AUDIENCE,
        is_configured=is_conf
    )


@router.get("/me", response_model=UserProfile)
async def get_current_citizen_profile(
    request: Request,
    citizen: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Returns citizen identity state.
    Designed for universal access: unauthenticated citizens return is_authenticated=False without error.
    Authenticated citizens receive their decoded Auth0 claims and demographic criteria loaded from DB.
    """
    sub = citizen.get("sub", "anonymous-citizen")
    header_sub = request.headers.get("x-citizen-sub")
    if (sub in ["anonymous-citizen", "guest-user"]) and header_sub:
        sub = header_sub

    is_auth = (not citizen.get("is_anonymous", False) and sub != "anonymous-citizen") or bool(header_sub)

    saved_demographics = None

    # 1. First, check persistent Database for authenticated citizen
    if is_auth and db is not None:
        try:
            profile_record = db.query(CitizenProfile).filter(CitizenProfile.sub == sub).first()
            if profile_record:
                saved_demographics = DemographicInfo(**profile_record.to_demographics_dict())
                logger.info(f"Loaded citizen demographics from DB for {sub}: {saved_demographics.model_dump()}")
        except Exception as e:
            logger.warning(f"Error loading citizen profile from DB: {e}")

    # 2. In-memory cache fallback
    if not saved_demographics and sub in _user_demographics_db:
        saved_demographics = _user_demographics_db.get(sub)

    # 3. If demographics were passed in Auth0 custom claims namespace, parse them
    custom_claims_key = f"{settings.AUTH0_AUDIENCE}/demographics"
    if not saved_demographics and custom_claims_key in citizen:
        d = citizen[custom_claims_key]
        if isinstance(d, dict):
            saved_demographics = DemographicInfo(**d)

    # Extract name and email from claims
    name = citizen.get("name") or citizen.get("nickname") or ("Registered Citizen" if is_auth else "Anonymous Citizen")
    email = citizen.get("email")
    picture = citizen.get("picture")

    return UserProfile(
        sub=sub,
        is_authenticated=is_auth,
        name=name,
        email=email,
        picture=picture,
        demographics=saved_demographics
    )


@router.post("/profile", response_model=UserProfile)
async def update_citizen_profile(
    demographics: DemographicInfo,
    request: Request,
    citizen: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Updates or saves citizen demographic preferences (e.g. State, Occupation, Gender, Caste, Age).
    Persists to the relational database tied to the citizen's Auth0 unique user ID (sub).
    """
    sub = citizen.get("sub", "anonymous-citizen")
    header_sub = request.headers.get("x-citizen-sub")
    if (sub in ["anonymous-citizen", "guest-user"]) and header_sub:
        sub = header_sub

    is_auth = (not citizen.get("is_anonymous", False) and sub != "anonymous-citizen") or bool(header_sub)

    # Persist to database if authenticated and database is active
    if is_auth and db is not None:
        try:
            profile_record = db.query(CitizenProfile).filter(CitizenProfile.sub == sub).first()
            if not profile_record:
                profile_record = CitizenProfile(sub=sub)
                db.add(profile_record)

            profile_record.state = demographics.state
            profile_record.occupation = demographics.occupation
            profile_record.gender = demographics.gender
            profile_record.caste = demographics.caste
            profile_record.age = demographics.age
            db.commit()
            db.refresh(profile_record)
            logger.info(f"Persisted demographic profile to DB for citizen {sub}: {demographics.model_dump()}")
        except Exception as e:
            logger.error(f"Error persisting citizen profile to DB: {e}")
            db.rollback()

    _user_demographics_db[sub] = demographics

    name = citizen.get("name") or citizen.get("nickname") or ("Registered Citizen" if is_auth else "Guest Citizen")

    return UserProfile(
        sub=sub,
        is_authenticated=is_auth,
        name=name,
        email=citizen.get("email"),
        picture=citizen.get("picture"),
        demographics=demographics
    )
