import json
import logging
from typing import Dict, Any, List, Optional
from app.core.config import settings

logger = logging.getLogger("yojanasetu.gemini")

# System prompt for structured multimodal citizen query understanding
AUDIO_ANALYSIS_PROMPT = """
You are YojanaSetu AI, an expert citizen welfare assistant for India.
Analyze the provided citizen voice recording.

Your task:
1. Accurately transcribe what the citizen said in their original language/dialect (e.g. Hindi, Bengali, Tamil, Telugu, Marathi, English, etc.).
2. Detect the language.
3. Translate the citizen's query into clear English.
4. Extract key demographic parameters if mentioned or implied (state, age, gender, occupation such as farmer/student/weaver/MSME/unemployed, income bracket, caste category). If not mentioned, set to null.
5. Identify the user's core intent.

You MUST respond strictly with a valid JSON object matching this schema:
{
  "transcript": "Citizen spoken words in original script",
  "detected_language": "hi / bn / en / te / ta / mr / etc.",
  "english_translation": "English translation of query",
  "extracted_demographics": {
    "state": "State name or null",
    "age": 0 or null,
    "gender": "Male / Female / Transgender / All or null",
    "occupation": "Farmer / Student / Artisan / Worker / Business / null",
    "income": "string or null",
    "caste": "SC / ST / OBC / General / null"
  },
  "intent": "Brief description of scheme needs"
}
"""

RESPONSE_SYNTHESIS_PROMPT = """
You are YojanaSetu AI, an empathetic, highly clear Indian Government Welfare Assistant.
A citizen has inquired about government welfare schemes.

Citizen Spoken Query: "{transcript}"
Citizen Language: "{language}"
Extracted Demographics: {demographics}

Top Matching Schemes Found:
{schemes_context}

Your Goal:
1. Synthesize a warm, reassuring, highly accessible response directly in the citizen's language ({language}).
2. For rural and low-literacy citizens, avoid complex bureaucratic jargon. State clearly what benefit they receive and what simple steps to take.
3. Keep the spoken response concise (3-4 spoken sentences) so it can be listened to comfortably without cognitive overload.

Output valid JSON strictly in this structure:
{
  "response_text": "English accessible explanation",
  "localized_response": "Empathetic response written in the citizen's spoken language script"
}
"""


async def process_audio_with_gemini(
    audio_bytes: bytes,
    mime_type: str = "audio/webm",
    preferred_lang: str = "hi"
) -> Dict[str, Any]:
    """
    Direct multimodal audio analysis using Gemini Flash.
    Extracts transcript, language, demographic filters, and intent.
    Falls back gracefully to intelligent local simulation if API key is not configured.
    """
    if not settings.GOOGLE_API_KEY or settings.GOOGLE_API_KEY.startswith("your-"):
        logger.info("Google API key not configured. Using intelligent mock fallback.")
        return _mock_audio_extraction(preferred_lang)

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                types.Part.from_bytes(data=audio_bytes, mime_type=mime_type),
                AUDIO_ANALYSIS_PROMPT,
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            )
        )
        
        if response.text:
            return json.loads(response.text)
    except Exception as e:
        logger.error(f"Gemini Flash multimodal processing error: {e}")

    return _mock_audio_extraction(preferred_lang)


async def synthesize_scheme_response(
    transcript: str,
    language: str,
    demographics: Dict[str, Any],
    matched_schemes: List[Dict[str, Any]]
) -> Dict[str, str]:
    """
    Synthesize an empathetic, accessible response in the user's regional language.
    """
    if not matched_schemes:
        if language == "hi":
            return {
                "response_text": "No specific scheme matched your exact criteria. You can explore all central and state welfare programs on our search portal.",
                "localized_response": "आपके द्वारा दिए गए विवरण से मेल खाती कोई विशिष्ट योजना नहीं मिली। कृपया हमारी खोज सूची में अन्य केंद्रीय व राज्य योजनाओं की जांच करें।"
            }
        elif language == "bn":
            return {
                "response_text": "No specific scheme matched your exact criteria. You can explore all central and state welfare programs on our search portal.",
                "localized_response": "আপনার প্রদত্ত বিবরণের সাথে মেলানো কোনো নির্দিষ্ট প্রকল্প পাওয়া যায়নি। বিস্তারিত জানতে আমাদের সার্চ পোর্টালে অনুসন্ধান করুন।"
            }
        return {
            "response_text": "No specific scheme matched your exact criteria. You can explore all central and state welfare programs on our search portal.",
            "localized_response": "No specific scheme matched your exact criteria. You can explore all central and state welfare programs on our search portal."
        }

    schemes_summary = "\n".join([
        f"- Scheme: {s.get('scheme_name')}\n  Benefits: {s.get('benefits', '')[:200]}\n  Eligibility: {s.get('eligibility', '')[:150]}"
        for s in matched_schemes[:3]
    ])

    if not settings.GOOGLE_API_KEY or settings.GOOGLE_API_KEY.startswith("your-"):
        first_scheme = matched_schemes[0].get("scheme_name", "कल्याणकारी योजना")
        if language == "hi":
            return {
                "response_text": f"We found schemes suitable for you, including {first_scheme}. You can apply with your basic identity documents.",
                "localized_response": f"नमस्ते! आपके लिए उपयुक्त योजनाएं उपलब्ध हैं, विशेष रूप से '{first_scheme}'। आप आवश्यक पहचान पत्रों के साथ इसके लिए आवेदन कर सकते हैं।"
            }
        elif language == "bn":
            return {
                "response_text": f"We found schemes suitable for you, including {first_scheme}. You can apply with your basic identity documents.",
                "localized_response": f"নমস্কার! আপনার জন্য উপযুক্ত সরকারি প্রকল্প পাওয়া গেছে, যেমন '{first_scheme}'। প্রয়োজনীয় পরিচয়পত্র দিয়ে আপনি এতে আবেদন করতে পারেন।"
            }
        return {
            "response_text": f"We found schemes suitable for you, including {first_scheme}. You can apply with your basic identity documents.",
            "localized_response": f"We found schemes suitable for you, including {first_scheme}. You can apply with your basic identity documents."
        }

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        prompt = RESPONSE_SYNTHESIS_PROMPT.format(
            transcript=transcript,
            language=language,
            demographics=json.dumps(demographics),
            schemes_context=schemes_summary
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.3,
            )
        )

        if response.text:
            return json.loads(response.text)
    except Exception as e:
        logger.error(f"Gemini response synthesis error: {e}")

    first_scheme = matched_schemes[0].get("scheme_name", "Welfare Scheme")
    return {
        "response_text": f"Found matching scheme: {first_scheme}.",
        "localized_response": f"Found matching scheme: {first_scheme}."
    }


def _mock_audio_extraction(preferred_lang: str) -> Dict[str, Any]:
    """Fallback simulated extraction when external AI keys are pending."""
    if preferred_lang == "hi":
        return {
            "transcript": "मैं एक छोटा किसान हूँ और मुझे खाद और बीज के लिए सरकारी सहायता चाहिए।",
            "detected_language": "hi",
            "english_translation": "I am a small farmer and need government assistance for fertilizer and seeds.",
            "extracted_demographics": {
                "state": None,
                "age": None,
                "gender": "All",
                "occupation": "Farmer",
                "income": None,
                "caste": None
            },
            "intent": "Agricultural input financial subsidy"
        }
    elif preferred_lang == "bn":
        return {
            "transcript": "আমি একজন তাঁতি এবং আমার নতুন তাঁত বসানোর জন্য আর্থিক অনুদান প্রয়োজন।",
            "detected_language": "bn",
            "english_translation": "I am a handloom weaver and need financial grant for setting up looms.",
            "extracted_demographics": {
                "state": "West Bengal",
                "age": None,
                "gender": "All",
                "occupation": "Artisan",
                "income": None,
                "caste": None
            },
            "intent": "Handloom and powerloom capital subsidy"
        }
    return {
        "transcript": "I am a woman entrepreneur looking for small business loan subsidies.",
        "detected_language": "en",
        "english_translation": "I am a woman entrepreneur looking for small business loan subsidies.",
        "extracted_demographics": {
            "state": None,
            "age": None,
            "gender": "Female",
            "occupation": "Business",
            "income": None,
            "caste": None
        },
        "intent": "Women entrepreneurship capital subsidy"
    }
