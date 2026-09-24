from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
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
    schemes = load_local_schemes()
    categories = set()
    for s in schemes:
        cat = s.get("category") or s.get("scheme_category")
        if cat:
            categories.add(cat)
    return sorted(list(categories))


@router.get("/states", response_model=List[str])
def get_states(db: Session = Depends(get_db)):
    """Returns list of all supported Indian states."""
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
    schemes = load_local_schemes()
    for s in schemes:
        if s.get("id") == scheme_id:
            return s
    raise HTTPException(status_code=404, detail="Scheme not found")
