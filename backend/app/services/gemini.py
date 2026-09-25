import json
import logging
import re
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.services.sarvam import translate_audio_with_sarvam, translate_text_with_sarvam, clean_script_leakage

logger = logging.getLogger("yojanasetu.gemini")

GEMINI_MODELS = ["gemini-3.8-flash", "gemini-flash-latest"]

# System prompt for structured citizen query understanding
TEXT_TRANSLATION_PROMPT = """
You are YojanaSetu AI, an expert multilingual Indian citizen welfare assistant.
A citizen has inquired about government welfare schemes in their regional language.

Citizen Spoken Text: "{text}"
Citizen Selected Language: "{preferred_lang}"

Your tasks:
1. Detect the language code accurately (e.g. hi for Hindi, bn for Bengali, ta for Tamil, te for Telugu, en for English, mr for Marathi, etc.).
2. Translate the citizen's inquiry into clear, concise English for database search.
3. Extract demographic parameters mentioned or implied:
   - state: Specific Indian state name or null
   - age: integer age or null
   - gender: "Female", "Male", or "All"
   - occupation: "Farmer", "Student", "Artisan", "Worker", "Business", or null
   - income: string or null
   - caste: "SC", "ST", "OBC", "General", "EWS", or null
4. Summarize the user's core intent.

You MUST respond strictly with a valid JSON object matching this schema:
{{
  "transcript": "{text}",
  "detected_language": "hi / bn / en / ta / te / mr",
  "english_translation": "Clear English translation of what the citizen is asking for",
  "extracted_demographics": {{
    "state": Any Indian State Mentioned,
    "age": null,
    "gender": "All / Male / Female / Others",
    "occupation": "Farmer / Student / Artisan / Worker / Business / null",
    "income": if specified any,
    "caste": "General / SC / ST / OBC / EWS "
  }},
  "intent": "Brief description of scheme needs"
}}
"""

AUDIO_ANALYSIS_PROMPT = """
You are YojanaSetu AI, an expert citizen welfare assistant for India.
Analyze the provided citizen voice recording.

Your task:
1. Accurately transcribe what the citizen said in their original language/dialect (e.g. Hindi, Bengali, Tamil, Telugu, Marathi, English, etc.).
2. Detect the language code (hi, bn, en, ta, te, etc.).
3. Translate the citizen's query into clear English.
4. Extract key demographic parameters if mentioned or implied (state, age, gender, occupation, income, caste).
5. Identify the user's core intent.

You MUST respond strictly with a valid JSON object matching this schema:
{
  "transcript": "Citizen spoken words in original script",
  "detected_language": "hi / bn / en / te / ta / mr / etc.",
  "english_translation": "English translation of query",
  "extracted_demographics": {
    "state": null,
    "age": null,
    "gender": "All",
    "occupation": null,
    "income": null,
    "caste": null
  },
  "intent": "Brief description of scheme needs"
}
"""

RESPONSE_SYNTHESIS_PROMPT = """
You are YojanaSetu AI, an empathetic, highly knowledgeable Indian Government Welfare Voice Assistant.
A citizen has inquired about government welfare schemes.

Citizen Spoken Query: "{transcript}"
Citizen Language: "{language}"
Extracted Demographics: {demographics}

Top Matching Schemes Found:
{schemes_context}

Your Goal:
Synthesize an empathetic, reassuring, detailed spoken response tailored to the citizen.

CRITICAL VOICE & AUDIO RULES for 'localized_response':
1. The text in 'localized_response' will be directly spoken aloud to the citizen using a Text-To-Speech (TTS) voice engine.
2. LANGUAGE & SCRIPT ACCURACY:
   - If Citizen Language is English ('en'):
     Strictly write BOTH 'response_text' and 'localized_response' in natural, warm, conversational spoken English using standard Latin alphabet.
     DO NOT output ANY Bengali, Hindi, or other Indic script characters.
     Verbalize currency and numbers into spoken English (e.g., write "up to ten lakh rupees" instead of "₹10,00,000/-", and "four percent interest rate" instead of "4%").
   - If Citizen Language is Bengali ('bn'):
     Strictly write 'localized_response' in authentic Bengali script (বাংলা).
     Do NOT leave English alphabet words inside Bengali sentences. Transliterate scheme names phonetically (e.g. "ওয়েস্ট বেঙ্গল স্টুডেন্ট ক্রেডিট কার্ড প্রকল্প").
     Verbalize currency into spoken Bengali words (e.g. "১০ লক্ষ টাকা পর্যন্ত").
   - If Citizen Language is Hindi ('hi'):
     Strictly write 'localized_response' in authentic Devanagari script (हिन्दी).
     Do NOT leave English alphabet words inside Hindi sentences. Transliterate scheme names phonetically.
     Verbalize currency into spoken Hindi words (e.g. "१० लाख रुपये तक").
3. NEVER use raw symbols like ₹, /-, $, %, +, or # in either response.
4. Avoid dry bureaucratic acronyms:
   - In English, use simple conversational phrases like "subsidized low interest education loan".
   - In Bengali/Hindi, avoid jargon like MCLR and spell out CSC as nearby Common Service Centre or portal.
5. NO MARKDOWN: Do NOT use asterisks (**), bullets (-), numbering (1.), or slashes.
   Write 3 to 4 flowing, clear, soothing sentences ending with proper punctuation (periods . for English, । for Bengali and Hindi).

Output valid JSON strictly in this structure:
{{
  "response_text": "Detailed English explanation",
  "localized_response": "Speech-optimized natural spoken response in citizen's requested language"
}}
"""


def _normalize_text_for_speech(text: str) -> str:
    """
    Cleans raw database scheme text (e.g. ₹10,00,000/-, MCLR, bullets)
    into speech-ready conversational English before passing to AI or translation.
    """
    if not text:
        return ""
    
    t = text
    # Currency conversions
    t = re.sub(r"₹\s*10,00,000/-?", "up to ten lakh rupees", t)
    t = re.sub(r"₹\s*(\d+),00,000/-?", r"\1 lakh rupees", t)
    t = re.sub(r"₹\s*(\d+),(\d+)/-?", r"\1 thousand \2 rupees", t)
    t = re.sub(r"₹\s*(\d+)/-?", r"\1 rupees", t)
    t = re.sub(r"Rs\.?\s*(\d+)/-?", r"\1 rupees", t)
    t = t.replace("/-", "")
    
    # Banking jargon
    t = re.sub(r"3-year MCLR of State Bank of India plus 1%", "subsidized simple annual bank interest rate", t, flags=re.IGNORECASE)
    t = re.sub(r"MCLR", "standard bank lending rate", t, flags=re.IGNORECASE)
    
    # Strip markdown and excessive symbols
    t = re.sub(r"[*#_`~]", "", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t

normalize_text_for_speech = _normalize_text_for_speech


async def process_audio_with_gemini(
    audio_bytes: bytes,
    mime_type: str = "audio/webm",
    preferred_lang: str = "en",
    client_transcript: Optional[str] = None
) -> Dict[str, Any]:
    """
    Voice Processing Pipeline:
    1. Detects native script from client_transcript (Bengali, Hindi, Tamil, Telugu, English).
    2. Priority 1: Sarvam AI Saaras Direct Audio-to-English translation with Auto Language Detection (~600ms).
    3. Priority 2: Client Live Transcript Translation Fallback.
    4. Priority 3: Gemini multimodal audio analysis fallback.
    5. Resilient Fallback: Local dynamic semantic extraction.
    """
    effective_lang = preferred_lang or "en"
    if client_transcript and len(client_transcript.strip()) > 1:
        native_text = client_transcript.strip()
        if re.search(r"[\u0980-\u09FF]", native_text):
            effective_lang = "bn"
        elif re.search(r"[\u0900-\u097F]", native_text):
            effective_lang = "hi"
        elif re.search(r"[\u0B80-\u0BFF]", native_text):
            effective_lang = "ta"
        elif re.search(r"[\u0C00-\u0C7F]", native_text):
            effective_lang = "te"
        elif re.search(r"[a-zA-Z]", native_text) and not re.search(r"[\u0900-\u0D7F]", native_text):
            effective_lang = "en"

    # Priority 1: Sarvam AI direct Audio-to-English Translation with Auto-Detect
    if settings.SARVAM_API_KEY and not settings.SARVAM_API_KEY.startswith("your-"):
        try:
            sarvam_res = await translate_audio_with_sarvam(audio_bytes, mime_type)
            if sarvam_res and sarvam_res.get("transcript"):
                eng_query = sarvam_res["transcript"].strip()
                raw_sarvam_code = sarvam_res.get("language_code", "")
                detected_sarvam_lang = raw_sarvam_code.split("-")[0].lower() if raw_sarvam_code else ""

                if detected_sarvam_lang in ("en", "bn", "hi", "ta", "te", "mr", "gu", "kn", "ml", "pa", "od"):
                    sarvam_lang = detected_sarvam_lang
                    # Only override to Indic if client transcript has unmistakable native Indic script
                    if client_transcript and re.search(r"[\u0980-\u09FF]", client_transcript):
                        sarvam_lang = "bn"
                    elif client_transcript and re.search(r"[\u0900-\u097F]", client_transcript):
                        sarvam_lang = "hi"
                else:
                    sarvam_lang = effective_lang

                logger.info(f"Sarvam AI auto-detected language '{sarvam_lang}' and transcribed query: '{eng_query}'")
                extracted = _extract_from_text(eng_query, sarvam_lang)
                extracted["english_translation"] = eng_query
                extracted["transcript"] = client_transcript if (client_transcript and sarvam_lang != "en") else eng_query
                extracted["detected_language"] = sarvam_lang
                return extracted
        except Exception as e:
            logger.warning(f"Sarvam AI audio auto-detect & translation error: {e}, falling back.")

    # Priority 2: Instant Client Live Transcript Fallback
    if client_transcript and len(client_transcript.strip()) > 1:
        native_text = client_transcript.strip()
        logger.info(f"Using client browser transcript fallback ({effective_lang}): '{native_text}'")
        return await translate_and_extract_with_gemini(native_text, effective_lang)

    # Priority 3: Gemini multimodal audio analysis fallback
    if settings.GOOGLE_API_KEY and not settings.GOOGLE_API_KEY.startswith("your-"):
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=settings.GOOGLE_API_KEY)
            for model_name in GEMINI_MODELS:
                try:
                    response = client.models.generate_content(
                        model=model_name,
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
                        parsed = json.loads(response.text)
                        det = parsed.get("detected_language")
                        if not det or det not in ("en", "bn", "hi", "ta", "te", "mr", "gu", "kn"):
                            parsed["detected_language"] = effective_lang
                        return parsed
                except Exception as model_err:
                    logger.warning(f"Gemini model {model_name} failed: {model_err}")
        except Exception as e:
            logger.error(f"Gemini Flash multimodal processing error: {e}")

    # Fallback to simulated regional extraction
    return _mock_audio_extraction(effective_lang)


async def translate_and_extract_with_gemini(
    text: str,
    preferred_lang: str = "en"
) -> Dict[str, Any]:
    """
    Translates vernacular query into English, extracts demographic parameters,
    and identifies intent.
    """
    detected_lang = preferred_lang or "en"
    if re.search(r"[\u0900-\u097F]", text):
        detected_lang = "hi"
    elif re.search(r"[\u0980-\u09FF]", text):
        detected_lang = "bn"
    elif re.search(r"[\u0B80-\u0BFF]", text):
        detected_lang = "ta"
    elif re.search(r"[\u0C00-\u0C7F]", text):
        detected_lang = "te"
    elif re.search(r"[a-zA-Z]", text) and not re.search(r"[\u0900-\u0D7F]", text):
        detected_lang = "en"

    # If already English, skip translation and extract directly
    if detected_lang == "en":
        extracted = _extract_from_text(text, "en")
        extracted["transcript"] = text
        extracted["detected_language"] = "en"
        extracted["english_translation"] = text
        return extracted

    # Priority 1: Sarvam Mayura Indic -> English Translation
    if settings.SARVAM_API_KEY and not settings.SARVAM_API_KEY.startswith("your-") and detected_lang != "en":
        try:
            source_code = f"{detected_lang}-IN" if len(detected_lang) == 2 else detected_lang
            eng_translation = await translate_text_with_sarvam(
                text=text,
                target_lang_code="en-IN",
                source_lang_code=source_code
            )
            if eng_translation:
                logger.info(f"Sarvam Mayura translated to English: '{eng_translation}'")
                extracted = _extract_from_text(eng_translation, detected_lang)
                extracted["transcript"] = text
                extracted["detected_language"] = detected_lang
                extracted["english_translation"] = eng_translation
                return extracted
        except Exception as e:
            logger.warning(f"Sarvam text-to-English translation error: {e}")

    # Priority 2: Gemini text translation
    if settings.GOOGLE_API_KEY and not settings.GOOGLE_API_KEY.startswith("your-"):
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=settings.GOOGLE_API_KEY)
            prompt = TEXT_TRANSLATION_PROMPT.format(text=text, preferred_lang=detected_lang)
            response = client.models.generate_content(
                model="gemini-flash-latest",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1,
                )
            )
            if response.text:
                parsed = json.loads(response.text)
                parsed["transcript"] = text
                return parsed
        except Exception as e:
            logger.warning(f"Gemini text translation unavailable ({e})")

    return _extract_from_text(text, detected_lang)


async def synthesize_scheme_response(
    transcript: str,
    language: str,
    demographics: Dict[str, Any],
    matched_schemes: List[Dict[str, Any]]
) -> Dict[str, str]:
    """
    Synthesizes an empathetic, highly clear response in the citizen's native language.
    1. Gemini speech-optimized synthesis generates authentic localized script directly.
    2. Runs through clean_script_leakage safety net.
    3. Fails gracefully to speech-cleaned vernacular translation via Sarvam Mayura.
    """
    if not matched_schemes:
        if language == "hi":
            return {
                "response_text": "No specific scheme matched your exact criteria. You can explore all central and state welfare programs on our search portal.",
                "localized_response": "नमस्ते! आपके द्वारा दिए गए विवरण से मेल खाती कोई विशिष्ट योजना नहीं मिली। कृपया हमारे सर्च पोर्टल पर अन्य कल्याणकारी योजनाओं की जांच करें।"
            }
        elif language == "bn":
            return {
                "response_text": "No specific scheme matched your exact criteria. You can explore all central and state welfare programs on our search portal.",
                "localized_response": "নমস্কার! আপনার অনুসন্ধানের সাথে মেলানো কোনো নির্দিষ্ট সরকারি প্রকল্প পাওয়া যায়নি। বিস্তারিত জানতে আমাদের সার্চ পোর্টালে অনুসন্ধান করুন।"
            }
        return {
            "response_text": "No specific scheme matched your exact criteria. You can explore all central and state welfare programs on our search portal.",
            "localized_response": "No specific scheme matched your exact criteria. You can explore all central and state welfare programs on our search portal."
        }

    # Pre-clean scheme context to eliminate raw symbols before feeding to Gemini
    schemes_summary = "\n".join([
        f"- Scheme: {s.get('scheme_name')}\n  Benefits: {_normalize_text_for_speech(s.get('benefits', '')[:250])}\n  Eligibility: {_normalize_text_for_speech(s.get('eligibility', '')[:150])}"
        for s in matched_schemes[:3]
    ])

    # Priority 1: Gemini Direct Speech-Optimized Synthesis
    if settings.GOOGLE_API_KEY and not settings.GOOGLE_API_KEY.startswith("your-"):
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

            for model_name in GEMINI_MODELS:
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            temperature=0.3,
                        )
                    )
                    if response.text:
                        parsed = json.loads(response.text)
                        loc_resp = parsed.get("localized_response")
                        if loc_resp:
                            if language == "en":
                                clean_eng = re.sub(r"[\u0900-\u0D7F]+", "", loc_resp)
                                clean_eng = _normalize_text_for_speech(clean_eng)
                                parsed["localized_response"] = clean_eng
                                parsed["response_text"] = clean_eng
                            elif language == "bn":
                                if not re.search(r"[\u0980-\u09FF]", loc_resp) and settings.SARVAM_API_KEY and not settings.SARVAM_API_KEY.startswith("your-"):
                                    logger.warning("Gemini localized_response lacked Bengali script. Translating via Sarvam Mayura...")
                                    translated = await translate_text_with_sarvam(loc_resp, "bn-IN")
                                    if translated:
                                        loc_resp = translated
                                parsed["localized_response"] = clean_script_leakage(loc_resp, "bn-IN")
                            elif language == "hi":
                                if not re.search(r"[\u0900-\u097F]", loc_resp) and settings.SARVAM_API_KEY and not settings.SARVAM_API_KEY.startswith("your-"):
                                    logger.warning("Gemini localized_response lacked Devanagari script. Translating via Sarvam Mayura...")
                                    translated = await translate_text_with_sarvam(loc_resp, "hi-IN")
                                    if translated:
                                        loc_resp = translated
                                parsed["localized_response"] = clean_script_leakage(loc_resp, "hi-IN")
                            else:
                                sanitized_loc = clean_script_leakage(loc_resp, f"{language}-IN")
                                parsed["localized_response"] = sanitized_loc
                        logger.info(f"Gemini ({model_name}) speech synthesis success in {language}")
                        return parsed
                except Exception as m_err:
                    logger.warning(f"Gemini synthesis with {model_name} failed: {m_err}")
        except Exception as e:
            logger.warning(f"Gemini response synthesis failed or throttled: {e}")

    # Priority 2: Detailed Vernacular Synthesis via Speech Normalization + Sarvam Mayura
    primary = matched_schemes[0]
    p_name = primary.get("scheme_name", "Government Welfare Scheme")
    p_benefits = _normalize_text_for_speech(primary.get("benefits") or "")
    p_eligibility = _normalize_text_for_speech(primary.get("eligibility") or "")
    p_details = _normalize_text_for_speech(primary.get("details") or "")

    sentences = [
        f"Based on your inquiry, the primary government scheme tailored for you is '{p_name}'."
    ]

    if p_benefits:
        clean_ben = ". ".join([s.strip() for s in p_benefits.split(".") if len(s.strip()) > 15][:2])
        if clean_ben:
            sentences.append(f"Key Benefits: {clean_ben}.")
    elif p_details:
        clean_det = ". ".join([s.strip() for s in p_details.split(".") if len(s.strip()) > 15][:2])
        if clean_det:
            sentences.append(f"Program Overview: {clean_det}.")

    if p_eligibility:
        clean_elig = ". ".join([s.strip() for s in p_eligibility.split(".") if len(s.strip()) > 15][:2])
        if clean_elig:
            sentences.append(f"Eligibility: {clean_elig}.")

    if len(matched_schemes) > 1:
        sec_name = matched_schemes[1].get("scheme_name")
        if sec_name:
            sentences.append(f"You may also explore '{sec_name}' for additional assistance.")

    sentences.append(
        "To apply, keep your Aadhaar card and bank account details ready, and submit your application online on the official portal or visit your nearest Common Service Centre or Gram Panchayat office."
    )

    base_eng = " ".join(sentences)

    if language == "en":
        clean_eng = _normalize_text_for_speech(base_eng)
        return {
            "response_text": clean_eng,
            "localized_response": clean_eng
        }

    if settings.SARVAM_API_KEY and not settings.SARVAM_API_KEY.startswith("your-") and language != "en":
        try:
            target_code = f"{language}-IN" if len(language) == 2 else language
            translated_indic = await translate_text_with_sarvam(
                text=base_eng,
                target_lang_code=target_code,
                source_lang_code="en-IN"
            )
            if translated_indic:
                sanitized_indic = clean_script_leakage(translated_indic, target_code)
                return {
                    "response_text": base_eng,
                    "localized_response": sanitized_indic
                }
        except Exception as e:
            logger.warning(f"Sarvam Mayura synthesis translation failed: {e}")

    # Fallback fluent vernacular templates
    sec_info_hi = f" इसके अतिरिक्त आप '{matched_schemes[1].get('scheme_name')}' की भी जांच कर सकते हैं।" if len(matched_schemes) > 1 else ""
    sec_info_bn = f" এছাড়াও আপনি '{matched_schemes[1].get('scheme_name')}' প্রকল্পটির সুবিধাও নিতে পারেন।" if len(matched_schemes) > 1 else ""

    if language == "hi":
        return {
            "response_text": base_eng,
            "localized_response": f"नमस्ते! आपकी खोज के अनुसार मुख्य कल्याणकारी योजना '{p_name}' है। इसके अंतर्गत आपको आवश्यक वित्तीय सहायता, अनुदान और ऋण सुविधा प्रदान की जाती है। आवेदन करने के लिए अपने आधार कार्ड और बैंक पासबुक के साथ निकटतम कॉमन सर्विस सेंटर या आधिकारिक पोर्टल पर संपर्क करें।{sec_info_hi}"
        }
    elif language == "bn":
        return {
            "response_text": base_eng,
            "localized_response": f"নমস্কার! আপনার অনুসন্ধান অনুযায়ী সর্বাধিক উপযুক্ত সরকারি প্রকল্প হলো '{p_name}'। এর মাধ্যমে আপনি সরাসরি আর্থিক অনুদান, স্বল্প সুদের ঋণ এবং সরকারি সহায়তা পেতে পারেন। আবেদনের জন্য আধার কার্ড ও ব্যাংক পাসবুক নিয়ে নিকটবর্তী সাধারণ সেবা কেন্দ্র বা সরকারি পোর্টালে যোগাযোগ করুন।{sec_info_bn}"
        }
    return {
        "response_text": base_eng,
        "localized_response": base_eng
    }


def _extract_from_text(text: str, preferred_lang: str) -> Dict[str, Any]:
    """Intelligent dynamic extraction from citizen text."""
    detected_lang = preferred_lang or "en"
    if re.search(r"[\u0900-\u097F]", text):
        detected_lang = "hi"
    elif re.search(r"[\u0980-\u09FF]", text):
        detected_lang = "bn"
    elif re.search(r"[\u0B80-\u0BFF]", text):
        detected_lang = "ta"
    elif re.search(r"[\u0C00-\u0C7F]", text):
        detected_lang = "te"
    elif re.search(r"[a-zA-Z]", text) and not re.search(r"[\u0900-\u0D7F]", text):
        detected_lang = "en"

    lower = text.lower()

    occupation = None
    gender = "All"
    caste = None
    state = None
    age = None

    if any(k in lower for k in ["किसान", "kisan", "farmer", "खेती", "কৃষি", "krishi", "chashi", "কৃষক", "ফসল", "agriculture"]):
        occupation = "Farmer"
    elif any(k in lower for k in ["छात्र", "student", "scholarship", "college", "school", "পড়াশোনা", "छात्रवृत्ति", "শিক্ষার্থী", "education"]):
        occupation = "Student"
    elif any(k in lower for k in ["तांती", "taanti", "weaver", "artisan", "loom", "हस्तशिल्प", "सिलाई", "কারুশিল্পী", "তাঁত"]):
        occupation = "Artisan"
    elif any(k in lower for k in ["मजदूर", "labor", "worker", "construction", "श्रमिक", "লেবার", "শ্রমিক"]):
        occupation = "Worker"
    elif any(k in lower for k in ["business", "व्यापार", "दुकान", "startup", "उद्योग", "msme", "উদ্যোক্তা", "enterprise"]):
        occupation = "Business"

    if any(k in lower for k in ["महिला", "woman", "women", "female", "लड़की", "बेटी", "নারী", "মহিলা"]):
        gender = "Female"

    if re.search(r"\bobc\b", lower) or "ओबीसी" in lower:
        caste = "OBC"
    elif re.search(r"\bsc\b", lower) or "दलित" in lower or "अनुसूचित जाति" in lower:
        caste = "SC"
    elif re.search(r"\bst\b", lower) or "आदिवासी" in lower or "जनजाति" in lower:
        caste = "ST"
    elif re.search(r"\bews\b", lower):
        caste = "EWS"

    states_map = {
        "west bengal": "West Bengal", "bengal": "West Bengal", "পশ্চিমবঙ্গ": "West Bengal", "বাংলা": "West Bengal",
        "rajasthan": "Rajasthan", "राजस्थान": "Rajasthan",
        "uttar pradesh": "Uttar Pradesh", "उत्तर प्रदेश": "Uttar Pradesh", "up": "Uttar Pradesh",
        "bihar": "Bihar", "बिहार": "Bihar",
        "maharashtra": "Maharashtra", "महाराष्ट्र": "Maharashtra",
        "madhya pradesh": "Madhya Pradesh", "मध्य प्रदेश": "Madhya Pradesh",
        "gujarat": "Gujarat", "गुजरात": "Gujarat",
        "tamil nadu": "Tamil Nadu", "तमिलनाडु": "Tamil Nadu",
        "karnataka": "Karnataka", "कर्नाटक": "Karnataka",
        "delhi": "Delhi", "दिल्ली": "Delhi"
    }
    for st_key, st_val in states_map.items():
        if st_key in lower:
            state = st_val
            break

    return {
        "transcript": text,
        "detected_language": detected_lang,
        "english_translation": text,
        "extracted_demographics": {
            "state": state,
            "age": age,
            "gender": gender,
            "occupation": occupation,
            "income": None,
            "caste": caste
        },
        "intent": f"Welfare schemes inquiry for {occupation or 'citizen'}"
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
            "transcript": "আমি একজন শিক্ষার্থী এবং উচ্চশিক্ষার জন্য স্টুডেন্ট ক্রেডিট কার্ড ঋণ প্রকল্প খুঁজছি।",
            "detected_language": "bn",
            "english_translation": "I am a student looking for higher education student credit card loan schemes.",
            "extracted_demographics": {
                "state": "West Bengal",
                "age": None,
                "gender": "All",
                "occupation": "Student",
                "income": None,
                "caste": None
            },
            "intent": "Student credit card higher education loan"
        }
    return {
        "transcript": "I am a student looking for education loan and scholarship schemes.",
        "detected_language": "en",
        "english_translation": "I am a student looking for education loan and scholarship schemes.",
        "extracted_demographics": {
            "state": None,
            "age": None,
            "gender": "All",
            "occupation": "Student",
            "income": None,
            "caste": None
        },
        "intent": "Student education welfare schemes"
    }
