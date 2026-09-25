import json
import logging
import os
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.core.config import settings
from app.models import Scheme

logger = logging.getLogger("yojanasetu.rag")

# In-memory cached dataset fallback
_cached_schemes: Optional[List[Dict[str, Any]]] = None


def load_local_schemes() -> List[Dict[str, Any]]:
    """Loads schemes from the extracted Kaggle JSON file as instant high-speed fallback."""
    global _cached_schemes
    if _cached_schemes is not None:
        return _cached_schemes

    json_path = settings.SCHEMES_JSON_PATH
    if os.path.exists(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                _cached_schemes = json.load(f)
                logger.info(f"Loaded {len(_cached_schemes)} fallback schemes from {json_path}")
                return _cached_schemes
        except Exception as e:
            logger.error(f"Error loading {json_path}: {e}")

    _cached_schemes = []
    return _cached_schemes


def search_schemes(
    db: Optional[Session] = None,
    query: Optional[str] = None,
    state: Optional[str] = None,
    category: Optional[str] = None,
    gender: Optional[str] = None,
    occupation: Optional[str] = None,
    caste: Optional[str] = None,
    min_age: Optional[int] = None,
    max_age: Optional[int] = None,
    page: int = 1,
    page_size: int = 20
) -> Dict[str, Any]:
    """
    Hybrid Scheme Retrieval Engine.
    Executes relational SQL filters if the database has records;
    Otherwise falls back to high-speed in-memory multi-attribute filtering.
    """
    # 1. Try relational database query if DB session has data
    if db is not None:
        try:
            db_count = db.query(Scheme).count()
            if db_count > 0:
                q = db.query(Scheme)
                if query:
                    search_term = f"%{query}%"
                    q = q.filter(
                        or_(
                            Scheme.scheme_name.ilike(search_term),
                            Scheme.details.ilike(search_term),
                            Scheme.benefits.ilike(search_term),
                            Scheme.tags.ilike(search_term)
                        )
                    )
                if state and state != "All":
                    q = q.filter(or_(Scheme.state == state, Scheme.level == "Central"))
                if category and category != "All":
                    q = q.filter(Scheme.scheme_category.ilike(f"%{category}%"))
                if gender and gender != "All":
                    q = q.filter(or_(Scheme.gender == gender, Scheme.gender == "All"))
                if occupation and occupation != "All":
                    q = q.filter(or_(Scheme.occupation == occupation, Scheme.occupation.is_(None)))
                if caste and caste != "All":
                    q = q.filter(or_(Scheme.caste_category == caste, Scheme.caste_category.is_(None)))

                total = q.count()
                offset = (page - 1) * page_size
                items = q.offset(offset).limit(page_size).all()
                total_pages = max(1, (total + page_size - 1) // page_size)

                return {
                    "items": [item.to_dict() for item in items],
                    "total": total,
                    "page": page,
                    "page_size": page_size,
                    "total_pages": total_pages
                }
        except Exception as e:
            logger.warning(f"Database query failed, falling back to local dataset: {e}")

    # 2. Local high-speed in-memory filtering fallback
    schemes = load_local_schemes()
    filtered = schemes

    if query:
        q_lower = query.lower()
        filtered = [
            s for s in filtered
            if q_lower in s.get("scheme_name", "").lower()
            or q_lower in s.get("details", "").lower()
            or q_lower in s.get("benefits", "").lower()
            or any(q_lower in tag.lower() for tag in s.get("tags", []))
        ]

    if state and state != "All":
        filtered = [
            s for s in filtered
            if s.get("state") == state or s.get("level") == "Central"
        ]

    if category and category != "All":
        c_lower = category.lower()
        filtered = [
            s for s in filtered
            if c_lower in (s.get("category") or "").lower() or c_lower in (s.get("scheme_category") or "").lower()
        ]

    if gender and gender != "All":
        filtered = [
            s for s in filtered
            if s.get("gender") == gender or s.get("gender") == "All" or not s.get("gender")
        ]

    if occupation and occupation != "All":
        filtered = [
            s for s in filtered
            if s.get("occupation") == occupation or not s.get("occupation")
        ]

    if caste and caste != "All":
        filtered = [
            s for s in filtered
            if s.get("caste") == caste or s.get("caste_category") == caste or not (s.get("caste") or s.get("caste_category"))
        ]

    total = len(filtered)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    items = filtered[start_idx:end_idx]
    total_pages = max(1, (total + page_size - 1) // page_size)

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }


def get_query_embedding(text: str) -> List[float]:
    """Generates 768-dim query embedding using Gemini text-embedding-004 or semantic projection."""
    if settings.GOOGLE_API_KEY and not settings.GOOGLE_API_KEY.startswith("your-"):
        try:
            from google import genai
            client = genai.Client(api_key=settings.GOOGLE_API_KEY)
            res = client.models.embed_content(
                model="text-embedding-004",
                contents=text
            )
            if hasattr(res, "embeddings") and res.embeddings:
                return list(res.embeddings[0].values)
        except Exception as e:
            logger.warning(f"Gemini query embedding failed ({e}), using semantic projection fallback.")

    import math
    import hashlib
    dim = 768
    vec = [0.0] * dim
    words = text.lower().replace(",", " ").replace(".", " ").replace(";", " ").split() or ["welfare"]
    for i, word in enumerate(words):
        h1 = int(hashlib.sha256(word.encode("utf-8")).hexdigest(), 16)
        sign1 = 1.0 if ((h1 >> 8) % 2 == 0) else -1.0
        decay = 1.0 / (1.0 + 0.05 * i)
        vec[h1 % dim] += sign1 * decay * 1.5
        if i > 0:
            h2 = int(hashlib.md5(f"{words[i-1]}_{word}".encode("utf-8")).hexdigest(), 16)
            sign2 = 1.0 if ((h2 >> 4) % 2 == 0) else -1.0
            vec[h2 % dim] += sign2 * decay * 1.0
    norm = math.sqrt(sum(x * x for x in vec))
    return [float(x / norm) for x in vec] if norm > 0 else vec


def retrieve_relevant_schemes_for_voice(
    db: Optional[Session],
    demographics: Dict[str, Any],
    query_text: str,
    limit: int = 4
) -> List[Dict[str, Any]]:
    """
    RAG retrieval tailored for citizen voice queries.
    Uses pgvector HNSW cosine similarity search combined with demographic filters.
    Falls back to relational keyword search and in-memory cache if needed.
    """
    state = demographics.get("state")
    gender = demographics.get("gender")
    occupation = demographics.get("occupation")
    caste = demographics.get("caste")

    # 1. Primary: pgvector HNSW Semantic Vector Search
    if db is not None:
        try:
            q = db.query(Scheme).filter(Scheme.embedding.isnot(None))

            if state and str(state).lower() not in ["all", "null"]:
                q = q.filter(or_(Scheme.state == state, Scheme.level == "Central"))
            if gender and str(gender).lower() not in ["all", "null"]:
                q = q.filter(or_(Scheme.gender == gender, Scheme.gender == "All"))
            if occupation and str(occupation).lower() not in ["all", "null", "general"]:
                q = q.filter(or_(Scheme.occupation == occupation, Scheme.occupation.is_(None)))
            if caste and str(caste).lower() not in ["all", "null"]:
                q = q.filter(or_(Scheme.caste_category == caste, Scheme.caste_category.is_(None)))

            if query_text and len(query_text.strip()) > 1:
                query_vector = get_query_embedding(query_text)
                q = q.order_by(Scheme.embedding.cosine_distance(query_vector))

            vector_matches = q.limit(limit).all()
            if vector_matches:
                logger.info(f"Retrieved {len(vector_matches)} schemes via pgvector HNSW semantic search for query: '{query_text[:50]}'")
                return [m.to_dict() for m in vector_matches]
        except Exception as e:
            logger.warning(f"Vector search failed, falling back to hybrid keyword search: {e}")

    # 2. Secondary: Relational keyword & demographic filters
    results = search_schemes(
        db=db,
        query=query_text,
        state=state if state and str(state).lower() != "null" else None,
        gender=gender if gender and str(gender).lower() != "all" else None,
        occupation=occupation if occupation and str(occupation).lower() != "null" else None,
        caste=caste if caste and str(caste).lower() != "null" else None,
        page=1,
        page_size=limit
    )

    if results["items"]:
        return results["items"]

    # 3. Fallback to broader query if strict filters returned no items
    broad_results = search_schemes(
        db=db,
        query=None,
        occupation=occupation if occupation and str(occupation).lower() != "null" else None,
        gender=gender if gender and str(gender).lower() != "all" else None,
        page=1,
        page_size=limit
    )

    return broad_results["items"] if broad_results["items"] else load_local_schemes()[:limit]
