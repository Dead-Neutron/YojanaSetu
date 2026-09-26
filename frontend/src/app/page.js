"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BentoDashboard from "@/components/BentoDashboard";
import SchemeCard from "@/components/SchemeCard";
import SchemeModal from "@/components/SchemeModal";
import allSchemes from "@/data/schemes.json";
import { useLanguage } from "@/i18n/LanguageContext";
import { 
  Mic, 
  Search, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Award, 
  Lock, 
  Zap, 
  Building2, 
  Users, 
  HeartHandshake,
  Compass,
  FileCheck
} from "lucide-react";

export default function HomePage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Showcase categories
  const categories = [
    "All",
    "Agriculture",
    "Women and Child",
    "Education & Learning",
    "Social welfare & Empowerment"
  ];

  // Filter schemes for the interactive showcase
  const showcaseSchemes = useMemo(() => {
    if (!allSchemes || allSchemes.length === 0) return [];
    if (selectedCategory === "All") {
      return allSchemes.slice(0, 6);
    }
    const filtered = allSchemes.filter(
      (s) => s.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
    return filtered.length > 0 ? filtered.slice(0, 6) : allSchemes.slice(0, 6);
  }, [selectedCategory]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#070d17] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      {/* =========================================================================
          ARCHITECTURAL AMBIENT CANVAS (SENIOR CIVIC-SYSTEM DESIGN)
          ========================================================================= */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {/* Subtle, Dignified Warm Radial Ceiling Light */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(245,158,11,0.06),transparent_70%)]" />

        {/* Precision Micro-Grid Texture */}
        <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      {/* Global Civic Top Navigation */}
      <Navbar />

      <main className="relative z-10 flex-1">
        {/* =========================================================================
            SECTION 1: BESPOKE HERO SECTION
            ========================================================================= */}
        <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Live Indicator Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 rounded-full bg-slate-900/80 px-4 py-1.5 text-xs font-semibold text-amber-400 backdrop-blur-xl border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="tracking-wide">
                {t("hero.badge") || "LIVE WELFARE ENGINE 2026 • 14+ REGIONAL DIALECTS"}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-50 leading-[1.15]"
            >
              Bridging Citizens to Welfare with{" "}
              <span className="text-amber-400">
                Voice &amp; AI
              </span>
            </motion.h1>

            {/* High-Contrast Subtitle (WCAG AAA 7:1) */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal"
            >
              {t("hero.subtitle") ||
                "Dismantling literacy and digital barriers. Speak in your regional mother tongue to discover, verify eligibility, and receive direct government welfare assistance without paperwork."}
            </motion.p>

            {/* Action Buttons (Solid, Tactile, Zero-Gradient Senior Designer Controls) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              {/* Primary CTA Button: Speak & Discover Schemes */}
              <motion.a
                href="#bento-hub"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-7 py-3.5 text-sm sm:text-base font-bold text-slate-950 shadow-xs transition-colors cursor-pointer"
              >
                <Mic className="h-5 w-5 stroke-[2.5] text-slate-950" />
                <span>Try Voice Assistant</span>
              </motion.a>

              {/* Secondary Button: Browse Scheme Directory */}
              <motion.div
                whileHover={{ scale: 1.025, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/search"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 px-7 py-3.5 text-sm sm:text-base font-semibold border border-white/[0.08] transition-colors shadow-xs cursor-pointer"
                >
                  <Search className="h-4 w-4 text-amber-400 stroke-[2.2]" />
                  <span>Browse Directory</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 stroke-[2.5]" />
                </Link>
              </motion.div>

              {/* Tertiary Quick-Action: Personalized Dashboard */}
              <motion.div
                whileHover={{ scale: 1.025, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/recommendations"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 px-6 py-3.5 text-sm sm:text-base font-medium border border-white/[0.08] transition-colors cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span>My Eligibility</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* High-Impact Civic Metrics Strip (Frosted Obsidian Cards) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="pt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 text-left"
            >
              <div className="rounded-2xl bg-slate-900/60 p-5 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.16] transition-colors shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-3xl font-black text-slate-50 tracking-tight">3,400+</div>
                  <Building2 className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-xs font-semibold text-slate-300">Central & State Schemes</div>
                <div className="text-[11px] text-slate-400 mt-1">Direct from official Gazettes</div>
              </div>

              <div className="rounded-2xl bg-slate-900/60 p-5 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.16] transition-colors shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-3xl font-black text-emerald-400 tracking-tight">100%</div>
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-xs font-semibold text-slate-300">Direct Benefit Transfer</div>
                <div className="text-[11px] text-slate-400 mt-1">Disbursed straight to bank accounts</div>
              </div>

              <div className="rounded-2xl bg-slate-900/60 p-5 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.16] transition-colors shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-3xl font-black text-amber-400 tracking-tight">14+</div>
                  <Volume2 className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-xs font-semibold text-slate-300">Regional Indian Dialects</div>
                <div className="text-[11px] text-slate-400 mt-1">Speech recognition & synthesis</div>
              </div>

              <div className="rounded-2xl bg-slate-900/60 p-5 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.16] transition-colors shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-3xl font-black text-cyan-400 tracking-tight">AAA</div>
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-xs font-semibold text-slate-300">WCAG 2.2 Accessible</div>
                <div className="text-[11px] text-slate-400 mt-1">High-contrast, screen-reader ready</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: INTERACTIVE BENTO DASHBOARD HUB
            ========================================================================= */}
        <section className="relative py-8 scroll-mt-20">
          <BentoDashboard />
        </section>

        {/* =========================================================================
            SECTION 3: LIVE SCHEME DIRECTORY SHOWCASE (FEATURING SCHEMECARD)
            ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Section Heading & Category Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Welfare Showcase
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight">
                Featured Citizen Programs
              </h2>
              <p className="text-base text-slate-300 mt-1.5 font-normal max-w-xl">
                Explore real government initiatives. Click any card to inspect full eligibility guidelines or trigger a voice query.
              </p>
            </div>

            {/* Seamless Borderless Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.35)]"
                      : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80"
                  }`}
                >
                  {cat === "All" ? "All Programs" : cat}
                </motion.button>
              ))}
            </div>
          </div>

          {/* High-Density 3-Column Grid of SchemeCards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showcaseSchemes.map((scheme, idx) => (
              <SchemeCard
                key={scheme.id || scheme.slug || idx}
                scheme={scheme}
                onSelect={(s) => setSelectedScheme(s)}
                onVoiceQuery={(s) => {
                  const targetElement = document.getElementById("bento-hub");
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              />
            ))}
          </div>

          {/* View Full Directory Link Banner */}
          <div className="mt-12 text-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Link
                href="/search"
                className="inline-flex items-center gap-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-6 py-3.5 text-sm border border-white/[0.08] shadow-xs transition-colors cursor-pointer"
              >
                <span>Explore all 3,400+ government programs in the directory</span>
                <ArrowRight className="h-4 w-4 text-amber-400 stroke-[2.5]" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: 3-STEP CIVIC ACCESS JOURNEY
            ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold bg-amber-400/10 text-amber-400 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              {t("steps.badge") || "The Citizen Pathway"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-50 mt-3 tracking-tight">
              {t("steps.title") || "Three Simple Steps to Avail Your Rights"}
            </h2>
            <p className="text-base text-slate-300 mt-2 leading-relaxed font-normal">
              {t("steps.subtitle") ||
                "Engineered to remove bureaucratic friction, paperwork confusion, and language barriers."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl bg-slate-900/75 p-8 backdrop-blur-xl border border-white/[0.08] hover:border-amber-400/30 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.25)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                    <Mic className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    Step 01
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-50 mb-3 tracking-tight">
                  {t("steps.step1Title") || "Speak in Your Regional Tongue"}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {t("steps.step1Desc") ||
                    "Simply tap the microphone and speak naturally in Hindi, English, Bengali, Tamil or your native dialect. No complicated bureaucratic search terms required."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Automatic dialect & noise filtering</span>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl bg-slate-900/75 p-8 backdrop-blur-xl border border-white/[0.08] hover:border-cyan-400/30 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.25)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    Step 02
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-50 mb-3 tracking-tight">
                  {t("steps.step2Title") || "Instant Demographic Vector Match"}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {t("steps.step2Desc") ||
                    "Our AI matches your demographic profile (state, occupation, gender, caste) across 3,400+ government programs in under 50 milliseconds using vector similarity."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sub-50ms HNSW cosine precision</span>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl bg-slate-900/75 p-8 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-400/30 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.25)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <FileCheck className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    Step 03
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-50 mb-3 tracking-tight">
                  {t("steps.step3Title") || "Direct Benefit Handoff"}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {t("steps.step3Desc") ||
                    "Listen to synchronized vernacular spoken summaries, understand required documents, and get direct one-click handoff to official .gov.in application portals."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% verified official portal links</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: CITIZEN SOVEREIGNTY & TRUST MATRIX
            ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
          <div className="rounded-3xl bg-slate-900/80 p-8 sm:p-14 backdrop-blur-xl border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.35)] relative overflow-hidden">
            {/* Subtle Inner Ambient Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-3.5 py-1.5 text-xs font-semibold text-amber-400">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>NATIONAL TRUST & SOVEREIGNTY STANDARDS</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight leading-tight">
                  Engineered for Public Service, Uncompromised Privacy
                </h2>

                <p className="text-base text-slate-300 leading-relaxed font-normal">
                  YojanaSetu is built strictly for public empowerment. We never monetize, sell, or profile citizen demographic queries. All voice and text queries are processed anonymously through encrypted zero-knowledge verification pipelines.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm font-medium text-slate-200">
                      100% Free Public Digital Utility (Zero hidden charges or application fees)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm font-medium text-slate-200">
                      Direct Gazette Grounding (All scheme data sourced from official ministries)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm font-medium text-slate-200">
                      Strict Aadhaar & Data Privacy Sandbox (No biometric retention)
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Link
                      href="/search"
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Explore Welfare Directory</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Link
                      href="/recommendations"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-7 py-3.5 text-sm font-semibold text-slate-200 border border-white/[0.08] shadow-xs cursor-pointer transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Check Your Eligibility</span>
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* Authoritative Security Feature Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-slate-800/60 border border-white/[0.06] backdrop-blur-md space-y-2">
                  <Lock className="w-6 h-6 text-amber-400 mb-3" />
                  <h4 className="text-base font-bold text-slate-50">Zero-Log Encryption</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Voice recordings are immediately purged from volatile memory after semantic extraction.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-800/60 border border-white/[0.06] backdrop-blur-md space-y-2">
                  <Award className="w-6 h-6 text-emerald-400 mb-3" />
                  <h4 className="text-base font-bold text-slate-50">Gazette Verified</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Updated every 24 hours against Central and State government notification portals.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-800/60 border border-white/[0.06] backdrop-blur-md space-y-2">
                  <Users className="w-6 h-6 text-cyan-400 mb-3" />
                  <h4 className="text-base font-bold text-slate-50">Direct Citizen Benefit</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Zero middlemen, agents, or intermediaries between citizen rights and official benefits.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-800/60 border border-white/[0.06] backdrop-blur-md space-y-2">
                  <ShieldCheck className="w-6 h-6 text-yellow-400 mb-3" />
                  <h4 className="text-base font-bold text-slate-50">WCAG 2.2 Ready</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Engineered from the ground up for assistive readers, dyslexia mode, and voice interaction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Civic Footer */}
      <div className="relative z-20">
        <Footer />
      </div>

      {/* Detailed Scheme View Modal */}
      {selectedScheme && (
        <SchemeModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
        />
      )}
    </div>
  );
}
