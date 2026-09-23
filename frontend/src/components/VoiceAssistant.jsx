"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Mic, 
  Square, 
  Volume2, 
  RotateCcw, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle, 
  Loader2, 
  ArrowRight,
  Play,
  Pause
} from "lucide-react";
import SchemeCard from "./SchemeCard";
import SchemeModal from "./SchemeModal";
import allSchemes from "../data/schemes.json";
import { useLanguage } from "@/i18n/LanguageContext";

const SAMPLE_QUERIES_BY_LANG = {
  en: [
    {
      title: "Farmer Financial Support",
      query: "I am a small farmer, what financial support and input subsidies can I get from the government?",
      spokenResponse: "Hello! Under schemes like PM Kisan Samman Nidhi and state agriculture subsidy initiatives, small and marginal farmers receive direct income support of ₹6,000 per year directly into their bank accounts alongside equipment subsidies.",
      matchedFilter: { occupation: "Farmer" }
    },
    {
      title: "Women Entrepreneurship",
      query: "Are there government schemes to help women start their own micro-business or self-help group?",
      spokenResponse: "Yes, under the Indira Mahila Shakti Udyam Protsahan Yojana and the National Rural Livelihood Mission, eligible women entrepreneurs receive collateral-free loans up to ₹10 Lakh with a 25% to 30% margin money subsidy.",
      matchedFilter: { gender: "Female" }
    },
    {
      title: "Construction Worker Assistance",
      query: "I work as an unorganized construction laborer. Is there any toolkit grant or accident insurance?",
      spokenResponse: "Yes! Registered building and construction workers can receive free modern toolkits and up to ₹4,00,000 in ex-gratia compensation in case of permanent injury or work accidents.",
      matchedFilter: { occupation: "Construction / Unorganized Worker" }
    },
    {
      title: "Technical Training & MSME",
      query: "What training and cluster development grants are available for small enterprises?",
      spokenResponse: "Under the AICTE SFURTI scheme and MSME consortia initiatives, institutions and small business clusters receive grants up to ₹4,00,000 to modernize traditional manufacturing and entrepreneurship.",
      matchedFilter: { occupation: "Entrepreneur / MSME" }
    }
  ],
  hi: [
    {
      title: "किसान सहायता योजनाएं",
      query: "मैं एक छोटा किसान हूँ, मुझे खेती के लिए कौन सी सरकारी सहायता और सब्सिडी मिल सकती है?",
      spokenResponse: "नमस्ते! पीएम किसान सम्मान निधि और राज्य कृषि सहायता योजनाओं के तहत छोटे किसानों को प्रति वर्ष ₹6,000 की नकद सहायता सीधे बैंक खाते में मिलती है, साथ ही बीज और उपकरण सब्सिडी भी प्रदान की जाती है।",
      matchedFilter: { occupation: "Farmer" }
    },
    {
      title: "महिला स्वरोजगार प्रोत्साहन",
      query: "महिलाओं को अपना छोटा व्यवसाय शुरू करने के लिए कौन सी सरकारी योजनाएं उपलब्ध हैं?",
      spokenResponse: "हाँ, इंदिरा महिला शक्ति उद्यम प्रोत्साहन योजना और राष्ट्रीय आजीविका मिशन के तहत महिला उद्यमियों को ₹10 लाख तक का बिना गारंटी ऋण और 25% से 30% तक मार्जिन मनी अनुदान दिया जाता है।",
      matchedFilter: { gender: "Female" }
    },
    {
      title: "श्रमिक कल्याण एवं टूलकिट",
      query: "मैं निर्माण कार्य में लगा श्रमिक हूँ, क्या मुझे कोई टूलकिट या राहत सहायता मिल सकती है?",
      spokenResponse: "हाँ! भवन एवं संनिर्माण कर्मकार कल्याण बोर्ड के तहत पंजीकृत मजदूरों को मुफ्त व्यावसायिक टूलकिट और दुर्घटना की स्थिति में ₹4,00,000 तक का वित्तीय राहत कवर मिलता है।",
      matchedFilter: { occupation: "Construction / Unorganized Worker" }
    },
    {
      title: "एमएसएमई एवं तकनीकी प्रशिक्षण",
      query: "लघु उद्योगों और तकनीकी शिक्षा के लिए क्या कोई सरकारी अनुदान योजना है?",
      spokenResponse: "एआईसीटीई स्फूर्ति योजना और एमएसएमई संघ पहल के तहत छोटे उद्योगों और प्रशिक्षण संस्थानों को ₹4,00,000 तक का वित्तीय अनुदान क्लस्टर विकास के लिए प्रदान किया जाता है।",
      matchedFilter: { occupation: "Entrepreneur / MSME" }
    }
  ],
  bn: [
    {
      title: "কৃষক সহায়তা প্রকল্প",
      query: "আমি একজন ক্ষুদ্র কৃষক, আমি চাষের জন্য কী কী সরকারি অনুদান পেতে পারি?",
      spokenResponse: "নমস্কার! পিএম কিষাণ সম্মান নিধি এবং কৃষি সহায়তা প্রকল্পের আওতায় ক্ষুদ্র কৃষকরা সরাসরি ব্যাংক অ্যাকাউন্টে বার্ষিক ₹৬,০০০ টাকা সহায়তা এবং সার ও কৃষি সরঞ্জামে ভর্তুকি পান।",
      matchedFilter: { occupation: "Farmer" }
    },
    {
      title: "নারী উদ্যোগ ও স্বনির্ভরতা",
      query: "নারীদের ক্ষুদ্র ব্যবসা শুরু করার জন্য কোনো সরকারি ঋণ প্রকল্প আছে কি?",
      spokenResponse: "হ্যাঁ, মহিলা শক্তি উদ্যোগ যোজনা এবং গ্রামীণ জীবিকা মিশনের অধীনে নারী উদ্যোক্তাদের কোনো জামানত ছাড়াই ₹১০ লাখ পর্যন্ত ঋণ এবং ২৫% থেকে ৩০% পর্যন্ত মার্জিন মানি ভর্তুকি দেওয়া হয়।",
      matchedFilter: { gender: "Female" }
    },
    {
      title: "নির্মাণ শ্রমিক সহায়তা",
      query: "আমি একজন নির্মাণ শ্রমিক, আমার জন্য কোনো টুলকিট বা দুর্ঘটনা বীমা প্রকল্প আছে কি?",
      spokenResponse: "হ্যাঁ! নির্মাণ শ্রমিক কল্যাণ পর্ষদে নিবন্ধিত কর্মীদের বিনামূল্যে আধুনিক টুলকিট এবং কর্মক্ষেত্রে দুর্ঘটনার ক্ষেত্রে ₹৪,০০,০০০ টাকা পর্যন্ত এককালীন আর্থিক অনুদান প্রদান করা হয়।",
      matchedFilter: { occupation: "Construction / Unorganized Worker" }
    },
    {
      title: "ক্ষুদ্র শিল্প ও কারিগরি প্রশিক্ষণ",
      query: "ক্ষুদ্র উদ্যোগের জন্য সরকারি ক্লাস্টার উন্নয়ন অনুদান কীভাবে পাওয়া যায়?",
      spokenResponse: "এআইসিটিই স্ফুর্তি স্কিম এবং এমএসএমই উদ্যোগের অধীনে ক্ষুদ্র শিল্প এবং প্রশিক্ষণ প্রতিষ্ঠানগুলোকে ₹৪,০০,০০০ টাকা পর্যন্ত ক্লাস্টার আধুনিকায়ন অনুদান দেওয়া হয়।",
      matchedFilter: { occupation: "Entrepreneur / MSME" }
    }
  ]
};

export default function VoiceAssistant() {
  const { language, t } = useLanguage();
  // State machine: 'idle' | 'listening' | 'processing' | 'speaking'
  const [state, setState] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [spokenResponseText, setSpokenResponseText] = useState("");
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const synthRef = useRef(typeof window !== "undefined" ? window.speechSynthesis : null);

  const sampleQueries = SAMPLE_QUERIES_BY_LANG[language] || SAMPLE_QUERIES_BY_LANG.en;

  const stopAudioCapture = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
  };

  useEffect(() => {
    return () => {
      stopAudioCapture();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  // MediaRecorder Audio Start
  const handleStartListening = async () => {
    setErrorMessage(null);
    setTranscript("");
    setSpokenResponseText("");
    setMatchedSchemes([]);
    if (synthRef.current) synthRef.current.cancel();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage(
        language === "hi"
          ? "आपके ब्राउज़र में ऑडियो रिकॉर्डिंग समर्थित नहीं है। कृपया नीचे दिए गए विषयों में से चुनें।"
          : language === "bn"
          ? "আপনার ব্রাউজার অডিও রেকর্ডিং সমর্থন করে না। অনুগ্রহ করে নিচের বিষয়গুলো নির্বাচন করুন।"
          : "Your browser does not support audio recording. Please choose a topic below."
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        stopAudioCapture();
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processAudioQuery(audioBlob);
      };

      recorder.start();
      setState("listening");

      setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 10000);
    } catch (err) {
      console.error("Microphone access error:", err);
      setState("idle");
      setErrorMessage(
        language === "hi"
          ? "माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया ब्राउज़र सेटिंग में अनुमति दें या नीचे दिए गए त्वरित बटन दबाएं।"
          : language === "bn"
          ? "মাইক্রোফোনের অনুমতি পাওয়া যায়নি। অনুগ্রহ করে ব্রাউজারে অনুমতি দিন বা নিচের বিকল্প বেছে নিন।"
          : "Microphone permission denied. Please allow microphone access or select a quick topic below."
      );
    }
  };

  const handleStopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setState("processing");
    }
  };

  const processAudioQuery = async (audioBlob) => {
    setState("processing");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    let processed = false;

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "voice.webm");
      formData.append("language", language);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${apiUrl}/voice-query`, {
        method: "POST",
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        setTranscript(data.transcript || "");
        setSpokenResponseText(data.localized_response || data.response_text);
        if (data.schemes && data.schemes.length > 0) {
          setMatchedSchemes(data.schemes);
        } else {
          filterSchemesByKeywords(data.transcript || "");
        }

        if (data.audio_url) {
          playAudioUrl(data.audio_url);
        } else {
          speakText(data.localized_response || data.response_text);
        }
        processed = true;
      }
    } catch (err) {
      console.warn("Backend not reachable, executing client fallback:", err);
    }

    if (!processed) {
      executeClientVoiceSimulation(sampleQueries[0]);
    }
  };

  const handleSelectQuickQuery = (item) => {
    setErrorMessage(null);
    setState("processing");
    if (synthRef.current) synthRef.current.cancel();

    setTimeout(() => {
      executeClientVoiceSimulation(item);
    }, 500);
  };

  const executeClientVoiceSimulation = (item) => {
    setTranscript(item.query);
    setSpokenResponseText(item.spokenResponse);

    const matched = allSchemes.filter((s) => {
      if (item.matchedFilter.occupation && s.occupation === item.matchedFilter.occupation) return true;
      if (item.matchedFilter.gender && s.gender === item.matchedFilter.gender) return true;
      return false;
    }).slice(0, 4);

    setMatchedSchemes(matched.length > 0 ? matched : allSchemes.slice(0, 3));
    speakText(item.spokenResponse);
  };

  const speakText = (text) => {
    setState("speaking");
    setIsPlaying(true);

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const regionalVoice = voices.find(
        (v) => v.lang.startsWith(language) || v.lang.includes("IN")
      );
      if (regionalVoice) utterance.voice = regionalVoice;

      utterance.onend = () => {
        setIsPlaying(false);
        setState("idle");
      };
      utterance.onerror = () => {
        setIsPlaying(false);
        setState("idle");
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsPlaying(false);
        setState("idle");
      }, 5000);
    }
  };

  const playAudioUrl = (url) => {
    setState("speaking");
    setIsPlaying(true);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = url;
      audioPlayerRef.current.play().catch(() => speakText(spokenResponseText));
      audioPlayerRef.current.onended = () => {
        setIsPlaying(false);
        setState("idle");
      };
    }
  };

  const handleReplay = () => {
    if (spokenResponseText) speakText(spokenResponseText);
  };

  const handleStopAudio = () => {
    if (synthRef.current) synthRef.current.cancel();
    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    setIsPlaying(false);
    setState("idle");
  };

  const filterSchemesByKeywords = (text) => {
    const lower = text.toLowerCase();
    const matched = allSchemes.filter((s) => {
      const combined = (s.scheme_name + " " + s.details + " " + s.category).toLowerCase();
      return combined.includes(lower);
    }).slice(0, 4);
    setMatchedSchemes(matched.length > 0 ? matched : allSchemes.slice(0, 3));
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8">
      <audio ref={audioPlayerRef} className="hidden" />

      {/* Modern Civic Card (Deep Saturated Indigo, soft rounded-xl, subtle border) */}
      <div className="bg-[#1A365D] border border-[#23487A] rounded-xl p-8 sm:p-12 text-white shadow-2xl text-center relative overflow-hidden">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 bg-[#122844] text-[#FF9F00] border border-[#23487A] px-4 py-1.5 rounded-full font-semibold text-xs tracking-wide mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#FF9F00]" />
          <span>{t("hero.badge")}</span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 max-w-3xl mx-auto leading-tight">
          {t("hero.title")}
        </h1>
        <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed mb-8">
          {t("hero.subtitle")}
        </p>

        {/* Central Large-Target Microphone Button */}
        <div className="flex flex-col items-center justify-center my-6">
          {state === "idle" && (
            <button
              type="button"
              id="voice-mic-main-button"
              onClick={handleStartListening}
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-[#FF9F00] hover:bg-[#E68F00] text-[#171717] flex flex-col items-center justify-center border-4 border-[#FFD080] civic-shadow-lg transition-all active:scale-95 animate-civic-mic"
              aria-label={t("hero.tapToSpeak")}
            >
              <Mic className="w-12 h-12 mb-1 stroke-[2.2]" />
              <span className="text-xs font-black uppercase tracking-wider">{t("hero.tapToSpeak")}</span>
            </button>
          )}

          {state === "listening" && (
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleStopListening}
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-red-600 hover:bg-red-500 text-white flex flex-col items-center justify-center border-4 border-red-300 civic-shadow-lg transition-all active:scale-95"
                aria-label={t("hero.stopListening")}
              >
                <Square className="w-10 h-10 mb-1 fill-current" />
                <span className="text-xs font-bold uppercase tracking-wider">{t("hero.stopListening")}</span>
              </button>

              {/* 7-Bar Modern Dynamic Equalizer in Electric Cyan and Marigold */}
              <div className="flex items-center gap-1.5 mt-6 h-12" aria-label="Audio Visualizer">
                <div className="w-2 bg-[#00A3C4] rounded-full animate-civic-eq-1"></div>
                <div className="w-2 bg-[#FF9F00] rounded-full animate-civic-eq-2"></div>
                <div className="w-2 bg-[#00A3C4] rounded-full animate-civic-eq-3"></div>
                <div className="w-2 bg-[#FF9F00] rounded-full animate-civic-eq-4"></div>
                <div className="w-2 bg-[#00A3C4] rounded-full animate-civic-eq-5"></div>
                <div className="w-2 bg-[#FF9F00] rounded-full animate-civic-eq-6"></div>
                <div className="w-2 bg-[#00A3C4] rounded-full animate-civic-eq-7"></div>
              </div>
              <span className="text-sm font-semibold text-[#00A3C4] mt-2">
                {t("hero.listening")}
              </span>
            </div>
          )}

          {state === "processing" && (
            <div className="flex flex-col items-center py-6">
              <div className="w-24 h-24 rounded-full bg-[#122844] border border-[#00A3C4] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#00A3C4] animate-spin" />
              </div>
              <div className="mt-4 text-xl font-bold text-[#00A3C4]">
                {t("hero.processing")}
              </div>
              <div className="text-xs text-slate-300 mt-1">
                {t("hero.processingSub")}
              </div>
            </div>
          )}

          {state === "speaking" && (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-[#00829D] border border-[#00A3C4]/60 flex items-center justify-center shadow-lg">
                <Volume2 className="w-12 h-12 text-white animate-pulse" />
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button
                  type="button"
                  onClick={handleStopAudio}
                  className="bg-[#122844] hover:bg-[#23487A] text-white px-4 py-2 rounded-xl text-xs font-semibold border border-[#23487A] flex items-center gap-1.5 transition-all"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>{t("hero.stopVoice")}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReplay}
                  className="bg-[#FF9F00] hover:bg-[#E68F00] text-[#171717] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t("hero.replayVoice")}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="bg-red-950/80 border border-red-700 rounded-xl p-4 max-w-xl mx-auto text-left text-red-100 text-sm mt-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Quick Query Topics */}
        <div className="mt-8 pt-6 border-t border-[#23487A]">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-3">
            {t("hero.commonTopics")}
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {sampleQueries.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuickQuery(item)}
                className="bg-[#122844] hover:bg-[#23487A] text-slate-100 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold border border-[#23487A] flex items-center gap-2 transition-all active:scale-95 civic-shadow-sm"
              >
                <Mic className="w-3.5 h-3.5 text-[#FF9F00] shrink-0" />
                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Synchronized Read-Along Spoken Answer Box */}
      {(transcript || spokenResponseText) && (
        <div className="bg-[#F8F9FA] border border-[#E5E5E5] rounded-xl p-6 sm:p-8 mt-8 civic-shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E5E5] gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00A3C4]"></span>
              <h2 className="text-lg font-bold text-[#171717]">
                {t("hero.spokenGuidance")}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleReplay}
              className="inline-flex items-center gap-1.5 bg-[#FF9F00] hover:bg-[#E68F00] text-[#171717] px-3 py-1.5 rounded-xl font-bold text-xs self-start sm:self-auto transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t("hero.replayVoice")}</span>
            </button>
          </div>

          {transcript && (
            <div className="py-4 border-b border-[#E5E5E5]">
              <div className="text-xs font-bold text-[#525252] uppercase tracking-wide mb-1">
                {t("hero.yourQuestion")}
              </div>
              <div className="text-base font-semibold text-[#171717] italic bg-[#FFFFFF] p-3 rounded-xl border border-[#E5E5E5]">
                "{transcript}"
              </div>
            </div>
          )}

          {spokenResponseText && (
            <div className="pt-4">
              <div className="text-xs font-bold text-[#00829D] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#00A3C4]" />
                <span>{t("hero.assistantAnswer")}</span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-[#171717] leading-relaxed bg-[#E6F7FA] p-5 rounded-xl border border-[#00A3C4]/30">
                {spokenResponseText}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Matched Verified Scheme Cards */}
      {matchedSchemes.length > 0 && (
        <div className="mt-10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#171717] tracking-tight">
                {t("hero.recommendedSchemes")} ({matchedSchemes.length})
              </h2>
              <p className="text-sm text-[#525252] font-medium">
                {t("hero.recommendedSub")}
              </p>
            </div>
            <a
              href="/search"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-[#1A365D] hover:text-[#00A3C4] transition-colors"
            >
              <span>{t("hero.exploreAll")}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchedSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                onSelect={(s) => setSelectedScheme(s)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedScheme && (
        <SchemeModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
        />
      )}
    </section>
  );
}
