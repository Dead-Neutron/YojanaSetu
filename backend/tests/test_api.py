import asyncio
import os
import sys

# Ensure backend directory is in python search path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

import httpx
from app.main import app


async def run_tests():
    print("========================================")
    print("Testing YojanaSetu FastAPI Backend Endpoints")
    print("========================================")
    
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # 1. Root
        r_root = await client.get("/")
        assert r_root.status_code == 200, f"Root failed: {r_root.text}"
        print(f"[OK] Root Endpoint: {r_root.json()['name']} v{r_root.json()['version']}")

        # 2. Health Check
        r_health = await client.get("/api/v1/health")
        assert r_health.status_code == 200, f"Health check failed: {r_health.text}"
        health_data = r_health.json()
        print(f"[OK] Health Check: Status={health_data['status']}, Services={health_data['services']}")

        # 3. Scheme Categories
        r_cats = await client.get("/api/v1/schemes/categories")
        assert r_cats.status_code == 200, f"Categories failed: {r_cats.text}"
        cats = r_cats.json()
        print(f"[OK] Categories Endpoint: {len(cats)} categories retrieved.")

        # 4. Multi-parameter Scheme Search
        r_search = await client.get("/api/v1/schemes/search?q=farmer&page=1&page_size=3")
        assert r_search.status_code == 200, f"Search failed: {r_search.text}"
        search_data = r_search.json()
        print(f"[OK] Scheme Search: Found {search_data['total']} matches for query 'farmer'.")
        if search_data["items"]:
            print(f"     Top Match: {search_data['items'][0]['scheme_name']}")

        # 5. Voice Query Endpoint (Testing media upload & fallback synthesis)
        fake_audio_bytes = b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00D\xac\x00\x00"
        files = {"audio": ("sample_voice.webm", fake_audio_bytes, "audio/webm")}
        data = {"language": "hi"}
        r_voice = await client.post("/api/v1/voice-query", files=files, data=data)
        assert r_voice.status_code == 200, f"Voice query failed: {r_voice.text}"
        voice_data = r_voice.json()
        print(f"[OK] Voice Query Endpoint:")
        print(f"     Transcript: {voice_data['transcript'].encode('ascii', errors='backslashreplace').decode('ascii')}")
        print(f"     Demographics: {voice_data['extracted_demographics']}")
        print(f"     Localized Spoken Response: {voice_data['localized_response'].encode('ascii', errors='backslashreplace').decode('ascii')[:100]}...")
        print(f"     Matched Schemes Count: {len(voice_data['schemes'])}")

    print("========================================")
    print("All FastAPI Backend tests passed successfully!")
    print("========================================")


if __name__ == "__main__":
    asyncio.run(run_tests())
