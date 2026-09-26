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
  Award,
  CheckCircle2
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8" id="bento-hub">
      {/* Bento Grid Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 bg-slate-800/80 text-amber-400 border border-white/[0.08] px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2.5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Bento Dashboard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight">
            Citizen Welfare Access Hub
          </h2>
          <p className="text-base text-slate-300 mt-1 font-normal max-w-2xl">
            Explore verified government welfare schemes through voice, demographics, or structured regional filters.
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold text-sm shadow-xs transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>{t("nav.searchSchemes")}</span>
          </Link>
        </motion.div>
      </div>

      {/* Main Asymmetric Bento Box Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bento Item 1 (Col-span 2): Voice Assistant Module */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 bg-slate-900/75 text-white rounded-2xl border border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl overflow-hidden flex flex-col justify-between"
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
            className="bg-slate-900/75 border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.3)] flex flex-col justify-between hover:border-white/[0.16] transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Verified Data
                </span>
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>

              <h3 className="text-xl font-bold text-slate-50 tracking-tight">
                National Scheme Integrity
              </h3>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                Directly validated against official central and state government gazettes and ministry portals.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/[0.08]">
              <div>
                <div className="text-2xl font-black text-slate-50">3,400+</div>
                <div className="text-xs font-medium text-slate-400">Active Schemes</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400">100%</div>
                <div className="text-xs font-medium text-slate-400">Direct DBT Transfer</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-50">36</div>
                <div className="text-xs font-medium text-slate-400">States & UTs</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400">₹0</div>
                <div className="text-xs font-medium text-slate-400">Citizen Access Fees</div>
              </div>
            </div>
          </motion.div>

          {/* Bento Item 3: Quick Demographics Selector */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-slate-900/75 border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.3)] hover:border-white/[0.16] transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-50 tracking-tight">
                {t("categories.title") || "Explore by Focus Area"}
              </h3>
              <Link 
                href="/search" 
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
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
                    className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/[0.06] hover:border-white/[0.15] transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <IconComponent className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform mb-2" />
                    <div>
                      <div className="text-xs font-semibold text-slate-200 leading-tight">
                        {t(`categories.${item.key}`) || item.category}
                      </div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">
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
          className="lg:col-span-2 bg-slate-900/75 border border-white/[0.08] rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.3)] hover:border-white/[0.16] transition-colors"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
            <div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full uppercase tracking-wider">
                Interactive Architecture
              </span>
              <h3 className="text-xl font-bold text-slate-50 mt-2 tracking-tight">
                How YojanaSetu Connects You to Assistance
              </h3>
            </div>

            {/* Interactive Step Switcher (Borderless pills) */}
            <div className="inline-flex bg-slate-800/80 p-1 rounded-xl backdrop-blur-md self-start sm:self-auto gap-1">
              {[1, 2, 3].map((stepNum) => (
                <button
                  key={stepNum}
                  type="button"
                  onClick={() => setActiveWizardStep(stepNum)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeWizardStep === stepNum
                      ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
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
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg">
                    <span>Phase 1</span>
                    <span>•</span>
                    <span>Multimodal Citizen Voice Ingestion</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-50">
                    Express Your Need in Your Regional Dialect
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    Citizens do not need to decipher bureaucratic forms. By pressing the microphone button or selecting one-tap questions, speech is transmitted directly to our multimodal Gemini Flash ingestion engine.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-white/[0.05]">
                  <div className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Technology</div>
                  <div className="text-sm font-bold text-slate-100">MediaRecorder API</div>
                  <div className="text-xs text-slate-400 mt-1">Audio streaming with noise-canceling capture</div>
                </div>
              </div>
            )}

            {activeWizardStep === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="sm:col-span-2 space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg">
                    <span>Phase 2</span>
                    <span>•</span>
                    <span>Strict Demographic Extraction & Hybrid RAG</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-50">
                    High-Speed Relational & Vector Matching
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    Gemini Flash extracts structured parameters (state, age, occupation, caste, income) into strict Pydantic JSON schemas. Queries run against PostgreSQL with HNSW vector indexing in under 50ms.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-white/[0.05]">
                  <div className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Performance</div>
                  <div className="text-sm font-bold text-emerald-400">&lt; 50ms Latency</div>
                  <div className="text-xs text-slate-400 mt-1">HNSW cosine vector search with relational SQL filters</div>
                </div>
              </div>
            )}

            {activeWizardStep === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="sm:col-span-2 space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-lg">
                    <span>Phase 3</span>
                    <span>•</span>
                    <span>Regional Spoken Guidance & Portal Handoff</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-50">
                    Listen, Read Along & Safely Apply
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    High-clarity regional speech paired with synchronized read-along text, with direct verified links to official government portal submission pages.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-white/[0.05]">
                  <div className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Handoff</div>
                  <div className="text-sm font-bold text-amber-400">100% Verified</div>
                  <div className="text-xs text-slate-400 mt-1">Direct handoff to .gov.in and .nic.in official forms</div>
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
          className="bg-slate-900/75 text-white border border-white/[0.08] rounded-2xl p-6 sm:p-7 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.3)] flex flex-col justify-between hover:border-white/[0.16] transition-colors"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full uppercase tracking-wider">
                WCAG 2.2 AAA
              </span>
              <Award className="w-5 h-5 text-amber-400" />
            </div>

            <h3 className="text-lg font-bold text-slate-50 tracking-tight">
              Flawless Accessibility
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Equipped with our native Accessibility Engine for text scaling (+200%), line-spacing adjustment, Dyslexia mode, and screen-reader optimizations.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] space-y-2">
            <div className="text-xs text-slate-400 font-medium">Toll-Free National Citizen Helpline:</div>
            <div className="text-lg font-black text-amber-400 tracking-wide flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>1800-11-2001</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}