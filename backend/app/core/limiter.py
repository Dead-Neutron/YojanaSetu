from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, Response
from fastapi.responses import JSONResponse

# Create the rate limiter keying off client IP address
limiter = Limiter(key_func=get_remote_address, default_limits=["120/minute"])


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> Response:
    """
    Standardized, clean JSON response for rate limit violations.
    Prevents abuse on Gemini Flash and ElevenLabs voice streaming endpoints.
    """
    return JSONResponse(
        status_code=429,
        content={
            "error": "Rate limit exceeded",
            "message": "Too many requests. Please slow down to preserve public welfare assistant bandwidth.",
            "detail": str(exc.detail)
        }
    )
