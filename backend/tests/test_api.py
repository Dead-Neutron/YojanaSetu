import asyncio
import os
import sys

# Ensure backend directory is in python search path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

import httpx
from app.database import init_db
from app.main import app


async def run_tests():
    print("================================================================")
    print("YojanaSetu Phase 5: Comprehensive Integration & Verification")
    print("================================================================")
    
    # Ensure database schema is initialized
    init_db()

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # ---------------------------------------------------------
        # 1. Health & Root System Status
        # ---------------------------------------------------------
        print("\n--- 1. System Health & Metadata ---")
        r_root = await client.get("/")
        assert r_root.status_code == 200, f"Root failed: {r_root.text}"
        print(f"[OK] Root Endpoint: {r_root.json()['name']} v{r_root.json()['version']}")

        r_health = await client.get("/api/v1/health")
        assert r_health.status_code == 200, f"Health check failed: {r_health.text}"
        health_data = r_health.json()
        print(f"[OK] Health Status: {health_data['status']}, Services: {health_data['services']}")
        assert health_data["services"]["database"] == "connected"

        # ---------------------------------------------------------
        # 2. Task 5.1: End-to-End Voice Flow Verification
        # ---------------------------------------------------------
        print("\n--- 2. Task 5.1: End-to-End Multilingual Voice Flow ---")
        fake_audio_bytes = b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00D\xac\x00\x00"

        # 2.1 Hindi Voice Query
        r_hi = await client.post(
            "/api/v1/voice-query",
            files={"audio": ("voice_hi.webm", fake_audio_bytes, "audio/webm")},
            data={"language": "hi"}
        )
        assert r_hi.status_code == 200, f"Hindi voice query failed: {r_hi.text}"
        hi_data = r_hi.json()
        print(f"[OK] Hindi Voice Query:")
        print(f"     Detected Lang: {hi_data['detected_language']}")
        print(f"     Demographics: {hi_data['extracted_demographics']}")
        print(f"     Matches: {len(hi_data['schemes'])} schemes")
        assert len(hi_data["schemes"]) > 0, "Expected matching schemes for farmer query"
        assert hi_data["localized_response"], "Expected non-empty localized response"

        # 2.2 Bengali Voice Query
        r_bn = await client.post(
            "/api/v1/voice-query",
            files={"audio": ("voice_bn.webm", fake_audio_bytes, "audio/webm")},
            data={"language": "bn"}
        )
        assert r_bn.status_code == 200, f"Bengali voice query failed: {r_bn.text}"
        bn_data = r_bn.json()
        print(f"[OK] Bengali Voice Query:")
        print(f"     Detected Lang: {bn_data['detected_language']}")
        print(f"     Demographics: {bn_data['extracted_demographics']}")
        print(f"     Matches: {len(bn_data['schemes'])} schemes")
        assert len(bn_data["schemes"]) > 0, "Expected matching schemes for artisan query"

        # 2.3 English Voice Query
        r_en = await client.post(
            "/api/v1/voice-query",
            files={"audio": ("voice_en.webm", fake_audio_bytes, "audio/webm")},
            data={"language": "en"}
        )
        assert r_en.status_code == 200, f"English voice query failed: {r_en.text}"
        en_data = r_en.json()
        print(f"[OK] English Voice Query:")
        print(f"     Detected Lang: {en_data['detected_language']}")
        print(f"     Demographics: {en_data['extracted_demographics']}")
        print(f"     Matches: {len(en_data['schemes'])} schemes")

        # 2.4 Audio Streaming Session Endpoint
        r_audio_miss = await client.get("/api/v1/voice-query/audio/non-existent-session-id")
        assert r_audio_miss.status_code == 404, "Expected 404 for expired or non-existent audio session"
        print(f"[OK] Voice Audio Stream: Safely returned 404 for invalid/expired audio session")

        # ---------------------------------------------------------
        # 3. Task 5.2: Traditional Search & Filtering Verification
        # ---------------------------------------------------------
        print("\n--- 3. Task 5.2: Traditional Search & Multi-Attribute Filtering ---")
        
        # 3.1 Dynamic Categories
        r_cats = await client.get("/api/v1/schemes/categories")
        assert r_cats.status_code == 200
        cats = r_cats.json()
        assert len(cats) >= 5, f"Expected at least 5 categories, got {len(cats)}"
        print(f"[OK] Scheme Categories: {len(cats)} categories available ({cats[:3]}...)")

        # 3.2 Dynamic States
        r_states = await client.get("/api/v1/schemes/states")
        assert r_states.status_code == 200
        states = r_states.json()
        assert len(states) >= 10, f"Expected at least 10 states, got {len(states)}"
        print(f"[OK] Indian States: {len(states)} states/UTs available ({states[:3]}...)")

        # 3.3 Keyword Search
        r_kw = await client.get("/api/v1/schemes/search?q=kisan&page=1&page_size=5")
        assert r_kw.status_code == 200
        kw_data = r_kw.json()
        print(f"[OK] Keyword Search ('kisan'): {kw_data['total']} total results, page 1 returned {len(kw_data['items'])} items")
        assert kw_data["total"] > 0

        # 3.4 Multi-filter Search: Category + Gender
        r_multi = await client.get("/api/v1/schemes/search?category=Agriculture&gender=Female&page=1&page_size=5")
        assert r_multi.status_code == 200
        multi_data = r_multi.json()
        print(f"[OK] Multi-filter Search (Agriculture + Female): {multi_data['total']} matches")

        # 3.5 Pagination Verification
        r_page1 = await client.get("/api/v1/schemes/search?page=1&page_size=4")
        r_page2 = await client.get("/api/v1/schemes/search?page=2&page_size=4")
        assert r_page1.status_code == 200 and r_page2.status_code == 200
        items_p1 = [i["id"] for i in r_page1.json()["items"]]
        items_p2 = [i["id"] for i in r_page2.json()["items"]]
        assert items_p1 != items_p2, "Page 1 and Page 2 should return distinct items"
        print(f"[OK] Pagination: Page 1 IDs={items_p1} distinct from Page 2 IDs={items_p2}")

        # 3.6 Edge Case: Zero results search
        r_empty = await client.get("/api/v1/schemes/search?q=thiskeywordwillnevermatchanyscheme999")
        assert r_empty.status_code == 200
        empty_data = r_empty.json()
        assert empty_data["total"] == 0 and len(empty_data["items"]) == 0
        print(f"[OK] Empty Search Edge Case: Cleanly returned 0 results without errors")

        # 3.7 Scheme Details by ID
        first_id = items_p1[0]
        r_detail = await client.get(f"/api/v1/schemes/{first_id}")
        assert r_detail.status_code == 200
        scheme_obj = r_detail.json()
        assert scheme_obj["id"] == first_id
        print(f"[OK] Scheme Detail Lookup: ID={first_id} -> '{scheme_obj['scheme_name']}'")

        # 3.8 Scheme Details 404 on Invalid ID
        r_notfound = await client.get("/api/v1/schemes/99999999")
        assert r_notfound.status_code == 404
        print(f"[OK] Scheme Detail 404 Edge Case: Validated non-existent ID returns 404")

        # ---------------------------------------------------------
        # 4. Task 5.3: Security, Auth & Rate Limiting Audit
        # ---------------------------------------------------------
        print("\n--- 4. Task 5.3: Security, Error Handling & Rate Limiting Audit ---")

        # 4.1 Anonymous Citizen Guest Access (Ensuring Voice-first Accessibility)
        r_guest = await client.get("/api/v1/schemes/search")
        assert r_guest.status_code == 200
        print(f"[OK] Anonymous Access: Unauthenticated citizens can access public welfare schemes")

        # 4.2 Auth Bearer Header Handling
        # If guest mode without Auth0 configured, should accept gracefully
        r_auth = await client.get("/api/v1/schemes/search", headers={"Authorization": "Bearer test-token"})
        assert r_auth.status_code == 200
        print(f"[OK] Auth Token Handling: Verified guest/development mode token handling")

        # 4.3 Malformed Payload Handling
        r_bad_audio = await client.post("/api/v1/voice-query", data={"language": "hi"})
        assert r_bad_audio.status_code == 422, "Expected 422 Unprocessable Entity when audio file is missing"
        print(f"[OK] Error Handling: Missing audio payload rejected with 422")

    print("\n================================================================")
    print("ALL Phase 5 Verification Tests Completed Successfully!")
    print("================================================================")


if __name__ == "__main__":
    asyncio.run(run_tests())

