from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from pgvector.sqlalchemy import Vector
from app.database import Base


class Scheme(Base):
    """
    SQLAlchemy representation of Indian Government Schemes.
    Supports hybrid queries: relational filtering (state, category, gender, occupation, age)
    combined with semantic vector search.
    """
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    scheme_name = Column(String(512), index=True, nullable=False)
    slug = Column(String(512), unique=True, index=True, nullable=True)
    details = Column(Text, nullable=True)
    benefits = Column(Text, nullable=True)
    eligibility = Column(Text, nullable=True)
    application = Column(Text, nullable=True)
    documents = Column(Text, nullable=True)
    level = Column(String(100), default="Central")
    state = Column(String(255), index=True, nullable=True)
    scheme_category = Column(Text, nullable=True)
    tags = Column(Text, nullable=True)
    target_age_min = Column(Integer, nullable=True)
    target_age_max = Column(Integer, nullable=True)
    gender = Column(String(100), nullable=True)
    occupation = Column(String(255), nullable=True)
    income_bracket = Column(String(255), nullable=True)
    caste_category = Column(String(255), nullable=True)
    embedding = Column(Vector(768), nullable=True)  # Native pgvector 768-dimensional embedding
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "scheme_name": self.scheme_name,
            "slug": self.slug,
            "details": self.details,
            "benefits": self.benefits,
            "eligibility": self.eligibility,
            "application": self.application,
            "documents": self.documents,
            "level": self.level,
            "state": self.state,
            "scheme_category": self.scheme_category,
            "category": self.scheme_category,
            "tags": [t.strip() for t in self.tags.split(",") if t.strip()] if self.tags else [],
            "target_age_min": self.target_age_min,
            "target_age_max": self.target_age_max,
            "gender": self.gender,
            "occupation": self.occupation,
            "income_bracket": self.income_bracket,
            "caste_category": self.caste_category,
            "caste": self.caste_category,
        }


class CitizenProfile(Base):
    """
    SQLAlchemy representation of Citizen Demographic Profile.
    Persists citizen demographic criteria tied to their Auth0 `sub` user identifier.
    """
    __tablename__ = "citizen_profiles"

    sub = Column(String(255), primary_key=True, index=True)
    state = Column(String(100), nullable=True)
    occupation = Column(String(100), nullable=True)
    gender = Column(String(50), nullable=True)
    caste = Column(String(50), nullable=True)
    age = Column(Integer, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_demographics_dict(self):
        return {
            "state": self.state,
            "occupation": self.occupation,
            "gender": self.gender,
            "caste": self.caste,
            "age": self.age,
        }

