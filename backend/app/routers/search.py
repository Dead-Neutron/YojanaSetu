from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import get_current_user_optional
from app.database import get_db
from app.models import Scheme, CitizenProfile
from app.services.rag import search_schemes, load_local_schemes, get_personalized_recommendations
from app.schemas import SchemeSearchResponse, SchemeOut, SchemeRecommendationsResponse, DemographicInfo

router = APIRouter(prefix="/schemes", tags=["Schemes"])


@router.get("/recommendations", response_model=SchemeRecommendationsResponse)
async def get_citizen_scheme_recommendations(
    request: Request,
    category: Optional[str] = Query(None, description="Optional filter by Scheme Category"),
    citizen: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Personalized welfare schemes recommendation engine for authenticated citizens.
    Only accessible if citizen is authenticated AND has saved their demographic profile.
    """
    sub = citizen.get("sub", "anonymous-citizen")
    header_sub = request.headers.get("x-citizen-sub")
    if (sub in ["anonymous-citizen", "guest-user"]) and header_sub:
        sub = header_sub

    is_auth = (not citizen.get("is_anonymous", False) and sub != "anonymous-citizen") or bool(header_sub)
    if not is_auth:
        raise HTTPException(
            status_code=401,
            detail="Authentication required. Please sign in with your Citizen ID to view personalized scheme recommendations."
        )

    # 1. Fetch saved citizen demographic criteria from Database
    demographics_dict = None
    if db is not None:
        try:
            profile = db.query(CitizenProfile).filter(CitizenProfile.sub == sub).first()
            if profile:
                demographics_dict = profile.to_demographics_dict()
        except Exception:
            pass

    # 2. Check fallback in-memory cache if DB had no profile
    if not demographics_dict:
        from app.routers.auth import _user_demographics_db
        cached_demographics = _user_demographics_db.get(sub)
        if cached_demographics:
            demographics_dict = cached_demographics.model_dump()

    # 3. Check custom claims namespace
    if not demographics_dict:
        custom_key = f"{settings.AUTH0_AUDIENCE}/demographics"
        if custom_key in citizen and isinstance(citizen[custom_key], dict):
            demographics_dict = citizen[custom_key]

    if not demographics_dict or (not demographics_dict.get("state") and not demographics_dict.get("occupation")):
        raise HTTPException(
            status_code=400,
            detail="Demographic profile incomplete. Please complete your State and Occupation in the Demographic Form to unlock personalized recommendations."
        )

    recommendations = get_personalized_recommendations(
        db=db,
        demographics=demographics_dict,
        category_filter=category
    )

    return SchemeRecommendationsResponse(
        citizen_demographics=DemographicInfo(**demographics_dict),
        total_recommended=recommendations["total_recommended"],
        items=recommendations["items"],
        categories=recommendations["categories"]
    )


@router.get("/search", response_model=SchemeSearchResponse)
def get_schemes_search(
    q: Optional[str] = Query(None, description="Search keyword in title, details, or benefits"),
    state: Optional[str] = Query(None, description="Filter by Indian State"),
    category: Optional[str] = Query(None, description="Filter by Scheme Category"),
    gender: Optional[str] = Query(None, description="Filter by Target Gender"),
    occupation: Optional[str] = Query(None, description="Filter by Occupation"),
    caste: Optional[str] = Query(None, description="Filter by Caste Category"),
    min_age: Optional[int] = Query(None, description="Minimum age eligibility"),
    max_age: Optional[int] = Query(None, description="Maximum age eligibility"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """
    Search and filter verified government welfare schemes.
    Supports multi-attribute relational filtering (State, Category, Gender, Occupation, Caste).
    """
    results = search_schemes(
        db=db,
        query=q,
        state=state,
        category=category,
        gender=gender,
        occupation=occupation,
        caste=caste,
        min_age=min_age,
        max_age=max_age,
        page=page,
        page_size=page_size
    )
    return results


@router.get("/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    """Returns list of all unique welfare scheme categories."""
    raw_cats = []
    if db is not None:
        try:
            results = db.query(Scheme.scheme_category).distinct().all()
            raw_cats = [r[0] for r in results if r[0]]
        except Exception:
            pass

    if not raw_cats:
        schemes = load_local_schemes()
        for s in schemes:
            cat = s.get("category") or s.get("scheme_category")
            if cat:
                raw_cats.append(cat)

    categories = set()
    for entry in raw_cats:
        for part in entry.split(","):
            cleaned = part.strip()
            if cleaned and len(cleaned) > 2:
                categories.add(cleaned)

    return sorted(list(categories))



@router.get("/states", response_model=List[str])
def get_states(db: Session = Depends(get_db)):
    """Returns list of all supported Indian states."""
    if db is not None:
        try:
            results = db.query(Scheme.state).distinct().all()
            states = sorted([r[0] for r in results if r[0] and r[0] != "All"])
            if states:
                return states
        except Exception:
            pass

    schemes = load_local_schemes()
    states = set()
    for s in schemes:
        st = s.get("state")
        if st and st != "All":
            states.add(st)
    return sorted(list(states))


@router.get("/{scheme_id}", response_model=SchemeOut)
def get_scheme_by_id(scheme_id: int, db: Session = Depends(get_db)):
    """Retrieve detailed scheme information by its unique ID."""
    if db is not None:
        try:
            scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
            if scheme:
                return scheme.to_dict()
        except Exception:
            pass

    schemes = load_local_schemes()
    for s in schemes:
        if s.get("id") == scheme_id:
            return s
    raise HTTPException(status_code=404, detail="Scheme not found")

