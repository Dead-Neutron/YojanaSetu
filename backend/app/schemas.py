from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class DemographicInfo(BaseModel):
    state: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    occupation: Optional[str] = None
    income: Optional[str] = None
    caste: Optional[str] = None


class SchemeBase(BaseModel):
    scheme_name: str
    slug: Optional[str] = None
    details: Optional[str] = None
    benefits: Optional[str] = None
    eligibility: Optional[str] = None
    application: Optional[str] = None
    documents: Optional[str] = None
    level: Optional[str] = "Central"
    state: Optional[str] = None
    scheme_category: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = Field(default_factory=list)
    target_age_min: Optional[int] = None
    target_age_max: Optional[int] = None
    gender: Optional[str] = "All"
    occupation: Optional[str] = None
    income_bracket: Optional[str] = None
    caste_category: Optional[str] = None
    caste: Optional[str] = None


class SchemeOut(SchemeBase):
    id: int

    class Config:
        from_attributes = True


class SchemeSearchResponse(BaseModel):
    items: List[SchemeOut]
    total: int
    page: int
    page_size: int
    total_pages: int


class VoiceQueryResponse(BaseModel):
    transcript: str
    detected_language: str
    english_translation: Optional[str] = None
    extracted_demographics: DemographicInfo
    intent: str
    response_text: str
    localized_response: str
    audio_url: Optional[str] = None
    schemes: List[SchemeOut] = Field(default_factory=list)


class HealthResponse(BaseModel):
    status: str
    version: str
    services: Dict[str, Any]
