import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.config import settings
from app.core.security import get_current_user_optional
from app.schemas import AuthConfigResponse, UserProfile, DemographicInfo

logger = logging.getLogger("yojanasetu.auth")
router = APIRouter(prefix="/auth", tags=["Authentication & Citizen Identity"])

# In-memory user demographic profiles cache (persists during process lifetime)
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
    citizen: dict = Depends(get_current_user_optional)
):
    """
    Returns citizen identity state.
    Designed for universal access: unauthenticated citizens return is_authenticated=False without error.
    Authenticated citizens receive their decoded Auth0 claims and demographic criteria.
    """
    sub = citizen.get("sub", "anonymous-citizen")
    is_auth = not citizen.get("is_anonymous", False) and sub != "anonymous-citizen"

    saved_demographics = _user_demographics_db.get(sub)

    # Extract name and email from claims
    name = citizen.get("name") or citizen.get("nickname") or ("Registered Citizen" if is_auth else "Anonymous Citizen")
    email = citizen.get("email")
    picture = citizen.get("picture")

    # If demographics were passed in Auth0 custom claims namespace, parse them
    custom_claims_key = f"{settings.AUTH0_AUDIENCE}/demographics"
    if not saved_demographics and custom_claims_key in citizen:
        d = citizen[custom_claims_key]
        if isinstance(d, dict):
            saved_demographics = DemographicInfo(**d)

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
    citizen: dict = Depends(get_current_user_optional)
):
    """
    Updates or saves citizen demographic preferences (e.g. State, Occupation, Gender, Caste, Age).
    Works for both authenticated citizens (stored under Auth0 sub) and guest citizens.
    """
    sub = citizen.get("sub", "anonymous-citizen")
    is_auth = not citizen.get("is_anonymous", False) and sub != "anonymous-citizen"

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
