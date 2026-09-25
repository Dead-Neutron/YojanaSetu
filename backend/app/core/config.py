import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "YojanaSetu API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Server network settings
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/yojanasetu"
    
    # Google Gemini Multimodal & Embeddings
    GOOGLE_API_KEY: str = ""
    
    # ElevenLabs Multilingual Voice Streaming
    ELEVENLABS_API_KEY: str = ""
    ELEVENLABS_VOICE_ID: str = "21m00Tcm4TlvDq8ikWAM"
    
    # Sarvam AI Indic Speech & Translation
    SARVAM_API_KEY: str = ""
    
    # Auth0 Authentication
    AUTH0_DOMAIN: str = ""
    AUTH0_CLIENT_ID: str = ""
    AUTH0_CLIENT_SECRET: str = ""
    AUTH0_AUDIENCE: str = "https://yojanasetu-api.local"
    AUTH0_ISSUER_BASE_URL: str = ""
    
    # Dataset File Paths
    DATASET_CSV_PATH: str = str(
        Path(__file__).resolve().parent.parent.parent.parent / "dataset" / "updated_data.csv"
    )
    SCHEMES_JSON_PATH: str = str(
        Path(__file__).resolve().parent.parent.parent.parent / "frontend" / "src" / "data" / "schemes.json"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.CORS_ORIGINS:
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env", "../.env", "../../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
