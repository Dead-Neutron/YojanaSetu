import asyncio
import httpx
import json

env_path = r"c:\Users\pc\OneDrive\Documents\Desktop\YojanaSetu\backend\.env"
sarvam_key = None
with open(env_path, "r", encoding="utf-8") as f:
    for line in f:
        if line.startswith("SARVAM_API_KEY="):
            sarvam_key = line.strip().split("=", 1)[1].strip('"').strip("'")

async def test_sarvam():
    headers = {"api-subscription-key": sarvam_key}
    
    # 1. Synthesize Bengali audio
    print("Synthesizing Bengali audio...")
    tts_bn = {
        "text": "আমি শিক্ষার্থীদের জন্য সরকারি স্কলারশিপ খুঁজছি।",
        "language_code": "bn-IN",
        "speaker": "roopa",
        "model": "bulbul:v3"
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        r_bn = await client.post("https://api.sarvam.ai/text-to-speech", headers=headers, json=tts_bn)
        bn_audio_b64 = r_bn.json()["audios"][0]
        import base64
        bn_bytes = base64.b64decode(bn_audio_b64)
        
        # Test STT translate on Bengali
        files = {"file": ("bn.wav", bn_bytes, "audio/wav")}
        data = {"model": "saaras:v3", "mode": "translate", "language_code": "unknown"}
        stt_bn = await client.post("https://api.sarvam.ai/speech-to-text", headers=headers, files=files, data=data)
        print("STT on Bengali audio:", stt_bn.json())

        # 2. Synthesize English audio
        print("\nSynthesizing English audio...")
        tts_en = {
            "text": "I am looking for government scholarships for college students in India.",
            "language_code": "en-IN",
            "speaker": "aditya",
            "model": "bulbul:v3"
        }
        r_en = await client.post("https://api.sarvam.ai/text-to-speech", headers=headers, json=tts_en)
        en_audio_b64 = r_en.json()["audios"][0]
        en_bytes = base64.b64decode(en_audio_b64)

        # Test STT translate on English
        files_en = {"file": ("en.wav", en_bytes, "audio/wav")}
        stt_en = await client.post("https://api.sarvam.ai/speech-to-text", headers=headers, files=files_en, data=data)
        print("STT on English audio:", stt_en.json())

asyncio.run(test_sarvam())
