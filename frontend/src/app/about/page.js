"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { 
  ShieldCheck, 
  Mic, 
  Search, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Building2, 
  Globe2, 
  Lock, 
  Cpu, 
  Layers, 
  FileText, 
  ArrowRight,
  UserCheck,
  Eye,
  HeartHandshake
} from "lucide-react";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#070d17] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Subtle Architectural Ambient Lighting (No cartoonish moving neon blobs) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(245,158,11,0.06),transparent_70%)]" 
        aria-hidden="true" 
      />
      <div 
        className="fixed inset-0 opacity-[0.025] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none z-0" 
        aria-hidden="true" 
      />

      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 sm:space-y-24">
        {/* =========================================================================
            HERO: CIVIC MISSION STATEMENT
            ========================================================================= */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-1.5 text-xs font-semibold text-amber-400 border border-white/[0.08] backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>NATIONAL DIGITAL PUBLIC INFRASTRUCTURE (DPI)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-50 leading-[1.15]">
            Bridging 1.4 Billion Citizens to <br className="hidden sm:inline" />
            <span className="text-amber-400">Direct Welfare Entitlements</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto">
            YojanaSetu is an open, non-commercial civic technology initiative engineered to eliminate literacy barriers, bureaucratic opacity, and predatory middlemen. We empower every citizen to discover, verify, and avail over 3,400+ Central and State welfare programs in their own regional spoken dialect.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
            >
              <Mic className="w-4 h-4 stroke-[2.5]" />
              <span>Try Voice Assistant</span>
            </Link>

            <Link
              href="/search"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-6 py-3.5 rounded-xl text-sm border border-white/[0.08] transition-colors shadow-xs cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Browse 3,400+ Schemes</span>
            </Link>

            <Link
              href="/recommendations"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium px-5 py-3.5 rounded-xl text-sm border border-white/[0.08] transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Check Eligibility</span>
            </Link>
          </div>
        </section>

        {/* =========================================================================
            KEY IMPACT METRICS
            ========================================================================= */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-slate-900/75 border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl">
            <div className="text-3xl sm:text-4xl font-black text-slate-50 tracking-tight">3,400+</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mt-1">Verified Programs</div>
            <p className="text-xs text-slate-400 mt-2 font-normal leading-relaxed">
              Curated from official Central Ministries and 28 State Governments.
            </p>
          </div>

          <div className="bg-slate-900/75 border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">100%</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mt-1">Direct Benefit Transfer</div>
            <p className="text-xs text-slate-400 mt-2 font-normal leading-relaxed">
              Zero middlemen. Subsidies disburse directly to citizen bank accounts.
            </p>
          </div>

          <div className="bg-slate-900/75 border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl">
            <div className="text-3xl sm:text-4xl font-black text-slate-50 tracking-tight">14+</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mt-1">Indic Dialects</div>
            <p className="text-xs text-slate-400 mt-2 font-normal leading-relaxed">
              Speech recognition tuned for Hindi, Bengali, Tamil, Telugu, and more.
            </p>
          </div>

          <div className="bg-slate-900/75 border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl">
            <div className="text-3xl sm:text-4xl font-black text-cyan-400 tracking-tight">AAA</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mt-1">WCAG 2.2 Standard</div>
            <p className="text-xs text-slate-400 mt-2 font-normal leading-relaxed">
              Built for cognitive ease, dyslexia fonts, and high-contrast accessibility.
            </p>
          </div>
        </section>

        {/* =========================================================================
            SECTION: THE CORE PROBLEM WE ARE SOLVING
            ========================================================================= */}
        <section className="bg-slate-900/80 border border-white/[0.08] rounded-3xl p-8 sm:p-12 backdrop-blur-xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>The Civic Challenge</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight">
              Why Hundreds of Billions in Welfare Go Unclaimed Every Year
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              India allocates thousands of crores annually toward agricultural equipment subsidies, maternity assistance, post-matric educational scholarships, and worker insurance. Yet millions of eligible citizens never apply due to three structural bottlenecks:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="bg-slate-800/50 border border-white/[0.06] rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-slate-100">
                The Literacy &amp; Language Chasm
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Official gazettes and departmental websites are predominantly written in dense bureaucratic English or formal Hindi that is incomprehensible to unorganized workers, farmers, and rural artisans.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-white/[0.06] rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-slate-100">
                Predatory Intermediaries &amp; Touts
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Because eligibility rules are opaque, citizens are frequently exploited by local brokers demanding commissions or documentation bribes for services that the Government provides entirely for free.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-white/[0.06] rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-slate-100">
                Fragmented Departmental Silos
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                A single citizen may qualify for six distinct welfare programs spanning Health, Labour, Social Justice, and Agriculture, but has no single unified registry to discover them concurrently.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION: THE FOUR ARCHITECTURAL PILLARS
            ========================================================================= */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              System Design &amp; Ethics
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight">
              The Four Architectural Pillars of YojanaSetu
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Every line of code and interface decision adheres to strict principles of public service, zero-knowledge privacy, and cognitive accessibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1 */}
            <div className="bg-slate-900/75 border border-white/[0.08] rounded-2xl p-7 sm:p-8 backdrop-blur-xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                  <Mic className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-xl font-bold text-slate-50 tracking-tight">
                  1. Indic Multimodal Voice Ingestion
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  Citizens simply press the microphone and explain their personal situation in their colloquial tongue (e.g., <em className="text-slate-200 font-medium">&quot;I am a small farmer in Bihar with 2 acres of land and two daughters studying in school&quot;</em>). Our acoustic models isolate speech noise, recognize Indian accents, and synthesize spoken answers in real-time.
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Web Speech API fallback for 2G/3G mobile networks</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-900/75 border border-white/[0.08] rounded-2xl p-7 sm:p-8 backdrop-blur-xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                  <Cpu className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-xl font-bold text-slate-50 tracking-tight">
                  2. Deterministic &amp; Semantic Hybrid Engine
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  We reject pure LLM &quot;hallucinations&quot; for civic welfare. YojanaSetu employs a hybrid matching algorithm combining semantic vector embeddings with strict deterministic eligibility filters across State domicile, Primary Occupation, Caste Category, Age, and Gender.
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero algorithmic hallucination of welfare benefits</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-900/75 border border-white/[0.08] rounded-2xl p-7 sm:p-8 backdrop-blur-xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <Lock className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-xl font-bold text-slate-50 tracking-tight">
                  3. Zero Data Mining &amp; Universal Access
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  YojanaSetu does not sell advertising, harvest citizen telemetry, or monetize public data. Authentication via Auth0 is 100% optional; any citizen can freely search, filter, and listen to all 3,400+ welfare schemes as an anonymous guest with full functionality.
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero biometric retention • Complete citizen sovereignty</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-slate-900/75 border border-white/[0.08] rounded-2xl p-7 sm:p-8 backdrop-blur-xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <Eye className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-xl font-bold text-slate-50 tracking-tight">
                  4. Universal Assistive Accessibility (WCAG 2.2 AAA)
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  Built for elderly citizens, low-vision individuals, and neurodivergent learners. Includes 4-tier text scaling up to 200%, OpenDyslexic typeface rendering, true high-contrast 7:1 mode, and native keyboard navigation across every modal and drawer.
                </p>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-indigo-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Validated with screen readers &amp; high-contrast monitors</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION: DATA SOURCE & GAZETTE INTEGRITY
            ========================================================================= */}
        <section className="bg-slate-900/80 border border-white/[0.08] rounded-3xl p-8 sm:p-12 backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Authoritative Grounding</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight">
                Authentic Government Gazettes Only
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                Every scheme entry in the YojanaSetu registry links to official <code className="text-amber-400 bg-slate-800 px-2 py-0.5 rounded font-mono text-xs">.gov.in</code> or <code className="text-amber-400 bg-slate-800 px-2 py-0.5 rounded font-mono text-xs">.nic.in</code> portals. We do not host speculative third-party claims or unofficial blog recommendations.
              </p>
              <div className="pt-2 flex flex-wrap gap-3 text-xs font-semibold text-slate-300">
                <span className="bg-slate-800 px-3.5 py-1.5 rounded-xl border border-white/[0.06]">Ministry of Agriculture &amp; Farmers Welfare</span>
                <span className="bg-slate-800 px-3.5 py-1.5 rounded-xl border border-white/[0.06]">Ministry of Women and Child Development</span>
                <span className="bg-slate-800 px-3.5 py-1.5 rounded-xl border border-white/[0.06]">Ministry of Social Justice and Empowerment</span>
                <span className="bg-slate-800 px-3.5 py-1.5 rounded-xl border border-white/[0.06]">Direct Benefit Transfer (DBT) Mission</span>
              </div>
            </div>

            <div className="shrink-0 bg-slate-800/80 border border-white/[0.08] rounded-2xl p-6 text-center space-y-3 max-w-xs">
              <HeartHandshake className="w-10 h-10 text-amber-400 mx-auto" />
              <div className="text-base font-bold text-slate-50">100% Free Public Good</div>
              <p className="text-xs text-slate-300 font-normal leading-relaxed">
                Created to serve every Indian citizen with dignity and pride. No fees, no ads, no middlemen.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CALL TO ACTION FOOTER BANNER
            ========================================================================= */}
        <section className="text-center py-10 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight">
            Ready to Discover Your Welfare Entitlements?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-normal">
            Start right now by speaking to our voice assistant or browsing the full national registry.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-sm transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <Mic className="w-4 h-4 stroke-[2.5]" />
              <span>Launch Voice Assistant</span>
            </Link>

            <Link
              href="/search"
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-8 py-3.5 rounded-xl text-sm border border-white/[0.08] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Explore Directory</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
