import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.limiter import limiter, rate_limit_exceeded_handler
from app.database import init_db
from app.routers import health, search, voice

# Configure application logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("yojanasetu.api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context for startup and graceful shutdown."""
    logger.info("Starting YojanaSetu FastAPI Backend Engine...")
    init_db()
    yield
    logger.info("Shutting down YojanaSetu Backend Engine...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Multilingual Citizen Assistant Platform for Indian Government Schemes",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# SlowAPI Rate Limiting State and Exception Handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(search.router, prefix=settings.API_V1_STR)
app.include_router(voice.router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
def root_info():
    """Root metadata providing API status and documentation links."""
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR,
        "description": "Connecting Indian citizens directly to verified welfare benefits through voice and accessible search."
    }
