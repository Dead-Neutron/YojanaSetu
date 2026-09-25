import asyncio
import io
import base64
import re
import sys
import httpx

# Ensure backend root is on path
sys.path.insert(0, "backend")
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

from app.core.config import settings
from app.services.gemini import process_audio_with_gemini, synthesize_scheme_response
from app.services.sarvam import synthesize_speech_with_sarvam, clean_script_leakage
from app.services.elevenlabs import stream_regional_speech

async def test_full_language_routing():
    print("==================================================")
    print("STARTING FULL VOICE LANGUAGE ROUTING VERIFICATION")
    print("==================================================")
    
    headers = {"api-subscription-key": settings.SARVAM_API_KEY}
    
    # --- TEST 1: CITIZEN SPEAKS IN ENGLISH ---
    print("\n--- TEST 1: Citizen Speaks in English ---")
    # 1. Synthesize English voice sample
    tts_en = {
        "text": "I am an engineering student looking for education loans and college scholarships in West Bengal.",
        "language_code": "en-IN",
        "speaker": "aditya",
        "model": "bulbul:v3"
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        r_en = await client.post("https://api.sarvam.ai/text-to-speech", headers=headers, json=tts_en)
        en_audio_b64 = r_en.json()["audios"][0]
        en_audio_bytes = base64.b64decode(en_audio_b64)

    # Process audio with backend
    en_analysis = await process_audio_with_gemini(
        audio_bytes=en_audio_bytes,
        mime_type="audio/wav",
        preferred_lang="en",
        client_transcript=None
    )
    
    print(f"Detected Language: {en_analysis.get('detected_language')}")
    print(f"Transcript: {en_analysis.get('transcript')}")
    print(f"English Query: {en_analysis.get('english_translation')}")
    
    assert en_analysis.get("detected_language") == "en", f"Expected 'en', got {en_analysis.get('detected_language')}"
    
    # Test Synthesis for English
    mock_schemes = [
        {
            "scheme_name": "West Bengal Student Credit Card Scheme",
            "benefits": "Education loan up to ten lakh rupees at low 4% simple interest rate with collateral-free guarantee.",
            "eligibility": "Students residing in West Bengal for at least 10 years who have enrolled in higher education.",
            "details": "Comprehensive credit card facility to finance undergraduate and postgraduate higher education."
        }
    ]
    
    en_synthesis = await synthesize_scheme_response(
        transcript=en_analysis.get("transcript", ""),
        language="en",
        demographics=en_analysis.get("extracted_demographics", {}),
        matched_schemes=mock_schemes
    )
    
    loc_resp = en_synthesis.get("localized_response", "")
    print(f"Synthesized English Spoken Guidance:\n{loc_resp}")
    
    # Verify NO Bengali or Hindi characters exist in English response
    has_bengali = bool(re.search(r"[\u0980-\u09FF]", loc_resp))
    has_hindi = bool(re.search(r"[\u0900-\u097F]", loc_resp))
    assert not has_bengali, f"ERROR: Bengali characters found in English response: {loc_resp}"
    assert not has_hindi, f"ERROR: Hindi characters found in English response: {loc_resp}"
    print("VERIFIED: English response contains zero Indic script leakage!")
    
    # Test ElevenLabs or Sarvam Bulbul English for English audio
    print("\nTesting English Audio Generation...")
    gen = await stream_regional_speech(loc_resp)
    if gen:
        chunks = []
        async for chunk in gen:
            chunks.append(chunk)
        total_audio_bytes = sum(len(c) for c in chunks)
        print(f"VERIFIED: ElevenLabs successfully generated {total_audio_bytes} bytes of English speech!")
        assert total_audio_bytes > 5000, "ElevenLabs audio stream too small"
    else:
        print("Note: ElevenLabs quota exhausted, testing Sarvam Bulbul English fallback...")
        en_audio = await synthesize_speech_with_sarvam(loc_resp, "en-IN")
        assert en_audio is not None and len(en_audio) > 5000, "Sarvam Bulbul English audio fallback failed"
        print(f"VERIFIED: Sarvam Bulbul successfully generated {len(en_audio)} bytes of crystal-clear English audio with speaker 'aditya'!")

    # --- TEST 2: CITIZEN SPEAKS IN BENGALI ---
    print("\n--- TEST 2: Citizen Speaks in Bengali ---")
    tts_bn = {
        "text": "আমি উচ্চশিক্ষার জন্য স্টুডেন্ট ক্রেডিট কার্ড ও সরকারি অনুদান পেতে চাই।",
        "language_code": "bn-IN",
        "speaker": "roopa",
        "model": "bulbul:v3"
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        r_bn = await client.post("https://api.sarvam.ai/text-to-speech", headers=headers, json=tts_bn)
        bn_audio_b64 = r_bn.json()["audios"][0]
        bn_audio_bytes = base64.b64decode(bn_audio_b64)

    bn_analysis = await process_audio_with_gemini(
        audio_bytes=bn_audio_bytes,
        mime_type="audio/wav",
        preferred_lang="bn",
        client_transcript=None
    )
    
    print(f"Detected Language: {bn_analysis.get('detected_language')}")
    print(f"Transcript: {bn_analysis.get('transcript')}")
    print(f"English Translated: {bn_analysis.get('english_translation')}")
    assert bn_analysis.get("detected_language") == "bn", f"Expected 'bn', got {bn_analysis.get('detected_language')}"

    bn_synthesis = await synthesize_scheme_response(
        transcript=bn_analysis.get("transcript", ""),
        language="bn",
        demographics=bn_analysis.get("extracted_demographics", {}),
        matched_schemes=mock_schemes
    )
    bn_loc = bn_synthesis.get("localized_response", "")
    print(f"Synthesized Bengali Spoken Guidance:\n{bn_loc}")
    assert re.search(r"[\u0980-\u09FF]", bn_loc), "Bengali response must contain Bengali script"
    
    # Test Sarvam Bulbul for Bengali audio
    print("\nTesting Sarvam Bulbul Bengali Audio (roopa)...")
    bn_audio = await synthesize_speech_with_sarvam(bn_loc, "bn-IN")
    assert bn_audio is not None and len(bn_audio) > 5000, "Sarvam Bulbul Bengali audio generation failed"
    print(f"VERIFIED: Sarvam Bulbul successfully generated {len(bn_audio)} bytes of Bengali speech with speaker 'roopa'!")

    print("\n==================================================")
    print("ALL TESTS PASSED WITH 100% SUCCESS!")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(test_full_language_routing())
