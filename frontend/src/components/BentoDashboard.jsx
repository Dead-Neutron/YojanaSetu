"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import VoiceAssistant from "./VoiceAssistant";
import { 
  Sprout, 
  Users, 
  GraduationCap, 
  Hammer, 
  HeartPulse, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Phone, 
  Search, 
  Award 
} from "lucide-react";

export default function BentoDashboard() {
  const { t } = useLanguage();
  const [activeWizardStep, setActiveWizardStep] = useState(1);

  const demographicPathways = [
    { key: "agriculture", icon: Sprout, category: "Agriculture", tag: "DBT Subsidies" },
    { key: "women", icon: Users, category: "Women and Child", tag: "Micro-loans" },
    { key: "education", icon: GraduationCap, category: "Education & Learning", tag: "Scholarships" },
    { key: "workers", icon: Hammer, category: "Social welfare & Empowerment", tag: "Toolkits" },
    { key: "health", icon: HeartPulse, category: "Health & Wellness", tag: "Medical Aid" },
    { key: "business", icon: Briefcase, category: "Business & Entrepreneurship", tag: "Collateral-free" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" id="bento-hub">
      {/* Bento Grid Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#E6F7FA] text-[#00829D] border border-[#00A3C4]/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#00A3C4]" />
            <span>Interactive Bento Dashboard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
            Citizen Welfare Access Hub
          </h2>
          <p className="text-base text-[#404040] mt-1 font-medium">
            Explore verified government welfare schemes through audio, demographics, or structured filters.
          </p>
        </div>

        <Link
          href="/search"
          className="inline-flex items-center gap-2 bg-[#FF9F00] hover:bg-[#E68F00] text-[#171717] px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all hover:shadow"
        >
          <Search className="w-4 h-4 text-[#171717]" />
          <span>{t("nav.searchSchemes")}</span>
        </Link>
      </div>

      {/* Main Asymmetric Bento Box Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bento Item 1 (Col-span 2): Voice Assistant Module */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 bg-[#1A365D] text-white rounded-xl border border-[#23487A] shadow-xl overflow-hidden flex flex-col justify-between"
        >
          <VoiceAssistant />
        </motion.div>

        {/* Right Stack (Col-span 1) */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Bento Item 2: Verified Metrics Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[#F8F9FA] border border-[#E5E5E5] rounded-xl p-6 civic-shadow-sm flex flex-col justify-between hover:border-[#00A3C4] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#1A365D] bg-[#E6F7FA] px-3 py-1 rounded-full uppercase tracking-wider border border-[#00A3C4]/30">
                  Verified Data
                </span>
                <ShieldCheck className="w-5 h-5 text-[#00A3C4]" />
              </div>

              <h3 className="text-xl font-bold text-[#171717] tracking-tight">
                National Scheme Integrity
              </h3>
              <p className="text-sm text-[#404040] mt-1 leading-relaxed">
                Aggregated from official central and state government gazettes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-[#E5E5E5]">
              <div>
                <div className="text-2xl font-black text-[#1A365D]">3,400+</div>
                <div className="text-xs font-semibold text-[#525252]">Active Schemes</div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#00829D]">100%</div>
                <div className="text-xs font-semibold text-[#525252]">Direct DBT Transfer</div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#1A365D]">36</div>
                <div className="text-xs font-semibold text-[#525252]">States & UTs</div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#FF9F00]">₹0</div>
                <div className="text-xs font-semibold text-[#525252]">Application Fees</div>
              </div>
            </div>
          </motion.div>

          {/* Bento Item 3: Quick Demographics Selector */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-[#F8F9FA] border border-[#E5E5E5] rounded-xl p-6 civic-shadow-sm hover:border-[#00A3C4] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#171717] tracking-tight">
                {t("categories.title")}
              </h3>
              <Link href="/search" className="text-xs font-bold text-[#00A3C4] hover:underline flex items-center gap-1">
                <span>All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-2">
              {demographicPathways.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={idx}
                    href={`/search?category=${encodeURIComponent(item.category)}`}
                    className="p-3 rounded-lg bg-[#FFFFFF] hover:bg-[#E6F7FA] border border-[#E5E5E5] hover:border-[#00A3C4] transition-all flex flex-col justify-between group shadow-2xs"
                  >
                    <IconComponent className="w-5 h-5 text-[#1A365D] group-hover:text-[#00A3C4] transition-colors mb-2" />
                    <div>
                      <div className="text-xs font-bold text-[#171717] leading-tight">
                        {t(`categories.${item.key}`)}
                      </div>
                      <div className="text-[10px] font-semibold text-[#525252] mt-0.5">
                        {item.tag}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bento Item 4 (Col-span 2): Step-by-Step Interactive Wizard */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2 bg-[#F8F9FA] border border-[#E5E5E5] rounded-xl p-6 sm:p-8 civic-shadow-sm hover:border-[#00A3C4] transition-all"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E5E5]">
            <div>
              <span className="text-xs font-bold text-[#00829D] bg-[#E6F7FA] px-3 py-1 rounded-full uppercase tracking-wider border border-[#00A3C4]/30">
                Interactive Wizard
              </span>
              <h3 className="text-xl font-bold text-[#171717] mt-2 tracking-tight">
                How YojanaSetu Connects You to Assistance
              </h3>
            </div>

            {/* Interactive Step Switcher */}
            <div className="inline-flex bg-[#FFFFFF] p-1 rounded-lg border border-[#E5E5E5] self-start sm:self-auto">
              {[1, 2, 3].map((stepNum) => (
                <button
                  key={stepNum}
                  type="button"
                  onClick={() => setActiveWizardStep(stepNum)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    activeWizardStep === stepNum
                      ? "bg-[#1A365D] text-white shadow-xs"
                      : "text-[#404040] hover:text-[#171717]"
                  }`}
                  aria-label={`View step ${stepNum}`}
                >
                  Step {stepNum}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {activeWizardStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="sm:col-span-2 space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00829D] bg-[#E6F7FA] px-2.5 py-1 rounded-md">
                    <span>Phase 1</span>
                    <span>•</span>
                    <span>Multimodal Citizen Voice Ingestion</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#171717]">
                    Express Your Need in Your Regional Dialect
                  </h4>
                  <p className="text-sm text-[#404040] leading-relaxed font-medium">
                    Citizens do not need to decipher bureaucratic forms. By pressing the microphone button or selecting one-tap questions, speech is transmitted directly to our multimodal Gemini Flash ingestion engine.
                  </p>
                </div>
                <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-4 text-center">
                  <div className="text-xs font-bold text-[#525252] mb-1 uppercase tracking-wider">Features</div>
                  <div className="text-sm font-bold text-[#171717]">MediaRecorder API</div>
                  <div className="text-xs text-[#525252] mt-1">Audio Blob streaming with noise-canceling capture</div>
                </div>
              </div>
            )}

            {activeWizardStep === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="sm:col-span-2 space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00829D] bg-[#E6F7FA] px-2.5 py-1 rounded-md">
                    <span>Phase 2</span>
                    <span>•</span>
                    <span>Strict Demographic Extraction & Hybrid RAG</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#171717]">
                    High-Speed Relational & Vector Matching
                  </h4>
                  <p className="text-sm text-[#404040] leading-relaxed font-medium">
                    Gemini Flash extracts structured parameters (state, age, occupation, caste, income) into strict Pydantic JSON schemas. Queries run against Tiger Data PostgreSQL with HNSW vector indexing in under 50ms.
                  </p>
                </div>
                <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-4 text-center">
                  <div className="text-xs font-bold text-[#525252] mb-1 uppercase tracking-wider">Performance</div>
                  <div className="text-sm font-bold text-[#171717]">&lt; 50ms Latency</div>
                  <div className="text-xs text-[#525252] mt-1">HNSW cosine vector search with relational SQL filters</div>
                </div>
              </div>
            )}

            {activeWizardStep === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="sm:col-span-2 space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00829D] bg-[#E6F7FA] px-2.5 py-1 rounded-md">
                    <span>Phase 3</span>
                    <span>•</span>
                    <span>Regional Spoken Guidance & Portal Handoff</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#171717]">
                    Listen, Read Along & Safely Apply
                  </h4>
                  <p className="text-sm text-[#404040] leading-relaxed font-medium">
                    ElevenLabs streams clear regional spoken responses paired with synchronized 20px+ read-along text, with direct verified links to official government portal submission pages.
                  </p>
                </div>
                <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-4 text-center">
                  <div className="text-xs font-bold text-[#525252] mb-1 uppercase tracking-wider">Handoff</div>
                  <div className="text-sm font-bold text-[#171717]">100% Verified</div>
                  <div className="text-xs text-[#525252] mt-1">Direct handoff to .gov.in and .nic.in official forms</div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Bento Item 5 (Col-span 1): Accessibility & Helpline Trust */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-[#1A365D] text-white border border-[#23487A] rounded-xl p-6 sm:p-7 shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#FF9F00] bg-[#122844] px-3 py-1 rounded-full uppercase tracking-wider border border-[#23487A]">
                WCAG 2.2 AAA
              </span>
              <Award className="w-5 h-5 text-[#FF9F00]" />
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">
              Flawless Accessibility
            </h3>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              Equipped with our native Accessibility Engine for text scaling (+200%), line-spacing adjustment, Dyslexia mode, and screen-reader optimizations.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#23487A] space-y-2">
            <div className="text-xs text-slate-300 font-semibold">Toll-Free National Helpline:</div>
            <div className="text-lg font-black text-[#FF9F00] tracking-wide flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#FF9F00]" />
              <span>1800-11-2001</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
