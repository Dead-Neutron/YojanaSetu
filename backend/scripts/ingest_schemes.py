import os
import sys
import re
import json
import logging
import pandas as pd

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from app.core.config import settings
from app.database import engine, init_db, SessionLocal
from app.models import Scheme

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ingest_schemes")

# Known Indian States and UTs for demographic extraction
INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh"
]


def extract_state(text: str) -> str:
    """Extract Indian State or UT from text if mentioned; defaults to 'Central'."""
    if not isinstance(text, str):
        return "All"
    for state in INDIAN_STATES:
        if state.lower() in text.lower():
            return state
    return "All"


def extract_gender(text: str) -> str:
    """Extract target gender criteria."""
    if not isinstance(text, str):
        return "All"
    text_lower = text.lower()
    if any(k in text_lower for k in ["female", "women", "girl", "mother", "widow"]):
        return "Female"
    if any(k in text_lower for k in ["transgender", "third gender"]):
        return "Transgender"
    return "All"


def extract_occupation(text: str) -> str:
    """Extract target occupational sector."""
    if not isinstance(text, str):
        return "General"
    text_lower = text.lower()
    if any(k in text_lower for k in ["farmer", "agriculture", "cultivator", "kisan"]):
        return "Farmer"
    if any(k in text_lower for k in ["student", "school", "scholarship", "college", "higher education"]):
        return "Student"
    if any(k in text_lower for k in ["artisan", "weaver", "loom", "handicraft", "potter"]):
        return "Artisan"
    if any(k in text_lower for k in ["construction", "laborer", "worker", "unorganized", "migrant"]):
        return "Worker"
    if any(k in text_lower for k in ["msme", "business", "entrepreneur", "startup", "industry"]):
        return "Business"
    return "General"


def run_etl():
    """Main ETL pipeline ingesting Kaggle dataset into PostgreSQL / SQLite."""
    csv_path = settings.DATASET_CSV_PATH
    if not os.path.exists(csv_path):
        logger.error(f"Dataset CSV not found at: {csv_path}")
        return

    logger.info(f"Reading dataset from {csv_path}...")
    df = pd.read_csv(csv_path)
    logger.info(f"Loaded {len(df)} raw records from CSV.")

    # Initialize tables
    init_db()
    db = SessionLocal()

    inserted_count = 0
    updated_count = 0

    seen_slugs = set()

    try:
        for idx, row in df.iterrows():
            name = str(row.get("scheme_name", "")).strip()
            if not name or name == "nan":
                continue

            slug = str(row.get("slug", "")).strip()
            if not slug or slug == "nan":
                slug = re.sub(r'[^a-zA-Z0-9]+', '-', name.lower()).strip('-')[:80]
            
            # Ensure unique slug even if dataset contains duplicates
            if slug in seen_slugs:
                slug = f"{slug}-{idx}"
            seen_slugs.add(slug)

            details = str(row.get("details", "")) if pd.notna(row.get("details")) else ""
            benefits = str(row.get("benefits", "")) if pd.notna(row.get("benefits")) else ""
            eligibility = str(row.get("eligibility", "")) if pd.notna(row.get("eligibility")) else ""
            application = str(row.get("application", "")) if pd.notna(row.get("application")) else ""
            documents = str(row.get("documents", "")) if pd.notna(row.get("documents")) else ""
            level = str(row.get("level", "Central")) if pd.notna(row.get("level")) else "Central"
            category = str(row.get("schemeCategory", "")) if pd.notna(row.get("schemeCategory")) else "General"
            tags = str(row.get("tags", "")) if pd.notna(row.get("tags")) else ""

            # Extract demographic rules
            all_text = f"{name} {details} {eligibility} {benefits}"
            state = extract_state(all_text)
            gender = extract_gender(all_text)
            occupation = extract_occupation(all_text)

            # Check for existing record
            existing = db.query(Scheme).filter(Scheme.slug == slug).first()
            if existing:
                existing.scheme_name = name
                existing.details = details
                existing.benefits = benefits
                existing.eligibility = eligibility
                existing.application = application
                existing.documents = documents
                existing.level = level
                existing.state = state
                existing.scheme_category = category
                existing.tags = tags
                existing.gender = gender
                existing.occupation = occupation
                updated_count += 1
            else:
                scheme = Scheme(
                    scheme_name=name,
                    slug=slug,
                    details=details,
                    benefits=benefits,
                    eligibility=eligibility,
                    application=application,
                    documents=documents,
                    level=level,
                    state=state,
                    scheme_category=category,
                    tags=tags,
                    gender=gender,
                    occupation=occupation
                )
                db.add(scheme)
                inserted_count += 1

            if (idx + 1) % 250 == 0:
                db.commit()
                logger.info(f"Processed {idx + 1}/{len(df)} schemes...")

        db.commit()
        logger.info(f"ETL completed successfully: {inserted_count} inserted, {updated_count} updated.")
    except Exception as e:
        db.rollback()
        logger.error(f"ETL pipeline encountered error: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    run_etl()
