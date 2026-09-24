"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BentoDashboard from "@/components/BentoDashboard";
import { useLanguage } from "@/i18n/LanguageContext";
import { 
  Mic, 
  Search, 
  Sparkles, 
  Volume2, 
  CheckCircle2
} from "lucide-react";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
      {/* Top Navbar with unmixed languages & accessibility */}
      <Navbar />

      <main className="flex-1">
        {/* Modern Civic Hero Section (Deep Saturated Indigo, SVG Grid Backdrop) */}
        <section className="relative bg-[#1A365D] text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#23487A]">
          {/* Geometric Civic Grid Background Pattern (Clean SVG) */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="civic-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#FFFFFF" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#civic-grid)" />
            </svg>
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
            {/* Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 bg-[#122844] text-[#F59E0B] border border-[#23487A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span>{t("hero.badge")}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto"
            >
              {t("hero.title")}
            </motion.h1>

            {/* Subtitle with 7:1 Contrast Safety */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-normal"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <a 
                href="#bento-hub" 
                     className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-[#171717] font-bold px-7 py-3.5 rounded-xl text-base civic-shadow-md transition-all active:scale-95" 
              > 
                <Mic className="w-5 h-5 stroke-[2.2]" /> 
                <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                  Try Voice Assistant
                </span>
              </a>

              <Link 
                href="/search" 
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#122844] hover:bg-[#23487A] text-white font-bold px-7 py-3.5 rounded-xl text-base border border-[#23487A] transition-all shadow-sm" 
              > 
                <Search className="w-5 h-5 text-[#00A3C4]" /> 
                <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                Browse Scheme Directory
                </span>
              </Link>
            </motion.div>

            {/* High-Impact Civic Metrics Strip */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-[#23487A] mt-12 text-left">
              <div className="p-4 rounded-xl bg-[#122844]/60 border border-[#23487A]">
                <div className="text-2xl font-black text-white">3,400+</div>
                <div className="text-xs font-semibold text-slate-300 mt-0.5">Central & State Schemes</div>
              </div>
              <div className="p-4 rounded-xl bg-[#122844]/60 border border-[#23487A]">
                <div className="text-2xl font-black text-[#00A3C4]">100%</div>
                <div className="text-xs font-semibold text-slate-300 mt-0.5">Direct Benefit Transfer</div>
              </div>
              <div className="p-4 rounded-xl bg-[#122844]/60 border border-[#23487A]">
                <div className="text-2xl font-black text-[#F59E0B]">3 Dialects</div>
                <div className="text-xs font-semibold text-slate-300 mt-0.5">English, Hindi & Bengali</div>
              </div>
              <div className="p-4 rounded-xl bg-[#122844]/60 border border-[#23487A]">
                <div className="text-2xl font-black text-white">WCAG 2.2</div>
                <div className="text-xs font-semibold text-slate-300 mt-0.5">AAA Accessibility Rated</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Section: Interactive Bento Box Dashboard */}
        <section id="bento-hub" className="bg-[#FFFFFF] py-12 scroll-mt-20">
          <BentoDashboard />
        </section>

        {/* 3-Step Simple Process Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5E5]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold bg-[#E6F7FA] text-[#00829D] border border-[#00A3C4]/30 px-3.5 py-1 rounded-full uppercase tracking-wider">
              {t("steps.badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#171717] mt-3 tracking-tight">
              {t("steps.title")}
            </h2>
            <p className="text-base text-[#404040] mt-2 leading-relaxed font-medium">
              {t("steps.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F8F9FA] border border-[#E5E5E5] rounded-xl p-8 civic-shadow-sm hover:border-[#00A3C4] transition-all text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#F59E0B] font-bold text-sm flex items-center justify-center mb-5 border border-[#F59E0B]/30">
                01
              </div>
              <div className="w-16 h-16 rounded-xl bg-[#FEF3C7] text-[#F59E0B] flex items-center justify-center mb-5 border border-[#F59E0B]/30">
                <Mic className="w-8 h-8 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-bold text-[#171717] mb-2 tracking-tight">
                {t("steps.step1Title")}
              </h3>
              <p className="text-sm text-[#404040] leading-relaxed font-medium">
                {t("steps.step1Desc")}
              </p>
            </div>

            <div className="bg-[#F8F9FA] border border-[#E5E5E5] rounded-xl p-8 civic-shadow-sm hover:border-[#00A3C4] transition-all text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#E6F7FA] text-[#00A3C4] font-bold text-sm flex items-center justify-center mb-5 border border-[#00A3C4]/30">
                02
              </div>
              <div className="w-16 h-16 rounded-xl bg-[#E6F7FA] text-[#00A3C4] flex items-center justify-center mb-5 border border-[#00A3C4]/30">
                <Sparkles className="w-8 h-8 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-bold text-[#171717] mb-2 tracking-tight">
                {t("steps.step2Title")}
              </h3>
              <p className="text-sm text-[#404040] leading-relaxed font-medium">
                {t("steps.step2Desc")}
              </p>
            </div>

            <div className="bg-[#F8F9FA] border border-[#E5E5E5] rounded-xl p-8 civic-shadow-sm hover:border-[#00A3C4] transition-all text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#E6F7FA] text-[#1A365D] font-bold text-sm flex items-center justify-center mb-5 border border-[#1A365D]/20">
                03
              </div>
              <div className="w-16 h-16 rounded-xl bg-[#FFFFFF] text-[#1A365D] flex items-center justify-center mb-5 border border-[#E5E5E5]">
                <Volume2 className="w-8 h-8 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-bold text-[#171717] mb-2 tracking-tight">
                {t("steps.step3Title")}
              </h3>
              <p className="text-sm text-[#404040] leading-relaxed font-medium">
                {t("steps.step3Desc")}
              </p>
            </div>
          </div>
        </section>

        {/* Mission & About Section */}
        <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E5E5E5]">
          <div className="bg-[#F8F9FA] border border-[#E5E5E5] rounded-xl p-8 sm:p-12 civic-shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold bg-[#E6F7FA] text-[#00829D] px-3 py-1 rounded-full uppercase tracking-wider border border-[#00A3C4]/30">
                  {t("about.badge")}
                </span>
                <h2 className="text-3xl font-black text-[#171717] leading-tight tracking-tight">
                  {t("about.title")}
                </h2>
                <p className="text-base text-[#404040] leading-relaxed font-medium">
                  {t("about.p1")}
                </p>
                <p className="text-base text-[#404040] leading-relaxed font-medium">
                  {t("about.p2")}
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#171717]">
                    <CheckCircle2 className="w-5 h-5 text-[#00A3C4]" />
                    <span>{t("about.benefit1")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#171717]">
                    <CheckCircle2 className="w-5 h-5 text-[#00A3C4]" />
                    <span>{t("about.benefit2")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#171717]">
                    <CheckCircle2 className="w-5 h-5 text-[#00A3C4]" />
                    <span>{t("about.benefit3")}</span>
                  </div>
                </div>
              </div>

              {/* Structural Dark Anchor Card */}
              <div className="bg-[#1A365D] text-white p-8 rounded-xl border border-[#23487A] space-y-6 shadow-md">
                <h3 className="text-xl font-bold text-[#F59E0B] border-b border-[#23487A] pb-3">
                  {t("about.cardTitle")}
                </h3>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#F59E0B] text-[#171717] rounded-xl shrink-0 font-bold">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{t("about.voiceTitle")}</h4>
                    <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                      {t("about.voiceDesc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#00829D] text-white rounded-xl shrink-0 font-bold">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{t("about.searchTitle")}</h4>
                    <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                      {t("about.searchDesc")}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link 
                    href="/search" 
                    className="group block w-full text-center bg-[#F59E0B] hover:bg-[#D97706] text-[#171717] font-bold py-3 rounded-xl text-sm transition-all shadow-sm" 
                  > 
                    <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                    {t("about.openSearch")}
                    </span>
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
