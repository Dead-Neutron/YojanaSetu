"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VoiceAssistant from "@/components/VoiceAssistant";
import { 
  Mic, 
  Search, 
  Sparkles, 
  Volume2, 
  FileCheck2, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  HeartHandshake,
  CheckCircle,
  HelpCircle
} from "lucide-react";

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState("hi");

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Top Navbar */}
      <Navbar currentLang={currentLang} onLangChange={setCurrentLang} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Voice-First Hero Interface */}
        <section className="bg-slate-900 border-b-4 border-[#D97706] py-6 sm:py-10">
          <VoiceAssistant currentLang={currentLang} />
        </section>

        {/* How It Works - 3 Step Visual Guide for Low-Literacy Inclusion */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black bg-[#047857] text-white px-3 py-1 rounded uppercase tracking-wider">
              सरल एवं सुगम प्रक्रिया | 3-Step Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mt-3">
              बिना किसी परेशानी के सरकारी सहायता कैसे पाएं?
            </h2>
            <p className="text-lg text-slate-700 mt-2 font-medium">
              Neither form-filling complexity nor language barrier should prevent you from receiving government benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white border-2 border-slate-300 rounded-xl p-8 shadow-sm text-center relative flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#D97706] text-slate-950 font-black text-lg flex items-center justify-center absolute -top-5">
                1
              </div>
              <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mb-6 mt-2">
                <Mic className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                माइक दबाएं और बोलें (Speak)
              </h3>
              <p className="text-base text-slate-700 leading-relaxed">
                Click the microphone button and simply talk about your background, occupation, family, or immediate financial need in your mother tongue.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border-2 border-slate-300 rounded-xl p-8 shadow-sm text-center relative flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#047857] text-white font-black text-lg flex items-center justify-center absolute -top-5">
                2
              </div>
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center mb-6 mt-2">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                AI योजना मिलान (AI Matching)
              </h3>
              <p className="text-base text-slate-700 leading-relaxed">
                Gemini Flash AI extracts your demographic criteria and scans verified Central & State databases via Tiger Data hybrid vector RAG.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border-2 border-slate-300 rounded-xl p-8 shadow-sm text-center relative flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#0F172A] text-white font-black text-lg flex items-center justify-center absolute -top-5">
                3
              </div>
              <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center mb-6 mt-2">
                <Volume2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                आवाज़ में सुनें और आवेदन करें (Listen & Apply)
              </h3>
              <p className="text-base text-slate-700 leading-relaxed">
                Listen to the spoken regional response streamed via ElevenLabs, read along with high-contrast text, and apply directly through verified portals.
              </p>
            </div>
          </div>
        </section>

        {/* Popular Categories Grid */}
        <section id="categories" className="bg-slate-200/70 border-y-2 border-slate-300 py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                  प्रमुख कल्याणकारी श्रेणियां / Key Citizen Categories
                </h2>
                <p className="text-base text-slate-700 font-medium">
                  Direct portals tailored to specific life needs and occupations
                </p>
              </div>

              <Link
                href="/search"
                className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white px-5 py-2.5 rounded font-black text-sm self-start sm:self-auto"
              >
                <span>View All Schemes / पूरी सूची देखें</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { title: "कृषि एवं किसान", en: "Agriculture", icon: "🌾", desc: "PM-Kisan, Subsidies" },
                { title: "महिला एवं बाल", en: "Women & Child", icon: "👩", desc: "Loans, Matritva" },
                { title: "शिक्षा एवं छात्रवृत्ति", en: "Education", icon: "🎓", desc: "Scholarships, AICTE" },
                { title: "श्रमिक एवं कारीगर", en: "Workers & Artisans", icon: "🔨", desc: "Toolkits, Insurance" },
                { title: "स्वास्थ्य सहायता", en: "Healthcare", icon: "🏥", desc: "Ayushman, Medical" },
                { title: "व्यापार एवं MSME", en: "Business", icon: "💼", desc: "PMEGP, Consortia" },
              ].map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/search`}
                  className="bg-white border-2 border-slate-300 hover:border-amber-600 rounded-lg p-5 text-center flex flex-col items-center justify-between shadow-sm hover:shadow transition-all group"
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <div className="font-black text-slate-900 text-sm group-hover:text-amber-700">
                    {cat.title}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">
                    {cat.en}
                  </div>
                  <div className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded mt-3 border border-emerald-200">
                    {cat.desc}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* About & Trust Section */}
        <section id="about" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white border-4 border-slate-300 rounded-2xl p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-black bg-amber-100 text-amber-950 px-3 py-1 rounded uppercase tracking-wider border border-amber-300">
                  Mission YojanaSetu
                </span>
                <h2 className="text-3xl font-black text-slate-950 leading-tight">
                  हर भारतीय नागरिक तक जन-कल्याणकारी योजनाओं की सीधी पहुंच
                </h2>
                <p className="text-base text-slate-700 leading-relaxed">
                  Millions of eligible citizens across rural and semi-urban India miss out on entitled subsidies, pensions, and medical grants simply because portal interfaces are English-dominated, form-heavy, and require digital literacy.
                </p>
                <p className="text-base text-slate-700 leading-relaxed">
                  <strong>YojanaSetu</strong> eliminates this bottleneck. By combining multimodal audio AI (Gemini Flash), ultra-fast semantic retrieval (Tiger Data pgvector), and natural regional voice generation (ElevenLabs), anyone who can speak can now unlock government support.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>Zero Application Fees</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>Verified Official Gazettes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>8+ Regional Dialects</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0F172A] text-white p-8 rounded-xl border-2 border-slate-700 space-y-6">
                <h3 className="text-xl font-black text-amber-400 border-b border-slate-700 pb-3">
                  Two Unified Ways to Explore
                </h3>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#D97706] text-slate-950 rounded font-black shrink-0">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Voice-First Experience</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Optimal for citizens who prefer speaking and listening over reading dense administrative text.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#047857] text-white rounded font-black shrink-0">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Structured MyScheme Search</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Ideal for CSC operators, social workers, and citizens seeking precise multi-criteria filter drilling.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/search"
                    className="block w-full text-center bg-white text-slate-950 hover:bg-slate-200 font-black py-3 rounded text-sm transition-colors"
                  >
                    Open Scheme Search Portal / योजना खोजें
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
