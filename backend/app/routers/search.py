from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Scheme
from app.services.rag import search_schemes, load_local_schemes
from app.schemas import SchemeSearchResponse, SchemeOut

router = APIRouter(prefix="/schemes", tags=["Schemes"])


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

