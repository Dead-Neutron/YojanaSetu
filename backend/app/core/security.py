import json
import logging
from typing import Optional, Dict, Any
import httpx
import jwt
from fastapi import HTTPException, Security, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

logger = logging.getLogger("yojanasetu.security")
security_bearer = HTTPBearer(auto_error=False)

# In-memory cache for Auth0 JWKS
_jwks_cache: Optional[Dict[str, Any]] = None


async def get_jwks() -> Dict[str, Any]:
    """Fetch and cache Auth0 JSON Web Key Set (JWKS)."""
    global _jwks_cache
    if _jwks_cache is not None:
        return _jwks_cache

    if not settings.AUTH0_DOMAIN:
        return {}

    jwks_url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(jwks_url)
            if response.status_code == 200:
                _jwks_cache = response.json()
                return _jwks_cache
    except Exception as e:
        logger.warning(f"Could not retrieve Auth0 JWKS from {jwks_url}: {e}")

    return {}


async def verify_jwt_token(token: str) -> Dict[str, Any]:
    """Verify an incoming Auth0 JWT token using cached public keys."""
    if not settings.AUTH0_DOMAIN:
        # Development mode bypass when Auth0 is not configured yet
        return {"sub": "guest-user", "is_anonymous": True}

    jwks = await get_jwks()
    if not jwks or "keys" not in jwks:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication authority unavailable."
        )

    try:
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header.get("kid"):
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break

        if not rsa_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token key ID."
            )

        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(rsa_key))
        issuer = f"https://{settings.AUTH0_DOMAIN}/"
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=settings.AUTH0_AUDIENCE if settings.AUTH0_AUDIENCE else None,
            issuer=issuer,
            options={"verify_aud": bool(settings.AUTH0_AUDIENCE)}
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has expired."
        )
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token validation failed: {str(e)}"
        )


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)
) -> Dict[str, Any]:
    """
    Returns verified user claims if token is provided;
    Otherwise returns anonymous citizen context to keep voice-first assistant universally accessible.
    """
    if not credentials:
        return {"sub": "anonymous-citizen", "is_anonymous": True}

    return await verify_jwt_token(credentials.credentials)


async def get_current_user_required(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)
) -> Dict[str, Any]:
    """Requires a valid Auth0 JWT token."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials required."
        )

    return await verify_jwt_token(credentials.credentials)
