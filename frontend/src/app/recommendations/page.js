"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemeCard from "@/components/SchemeCard";
import SchemeModal from "@/components/SchemeModal";
import CitizenLoginModal from "@/components/CitizenLoginModal";
import CitizenProfileModal from "@/components/CitizenProfileModal";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  Sliders, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Briefcase, 
  User, 
  RotateCcw,
  ExternalLink,
  Mic,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Award
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RecommendationsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();

  const [schemes, setSchemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("match"); // "match", "central", "state"

  // Modals
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  // Check if citizen has completed demographic criteria
  const isProfileComplete = Boolean(
    user?.demographics?.state && user?.demographics?.occupation
  );

  // Fetch Recommendations from Backend
  useEffect(() => {
    if (!isAuthenticated || !isProfileComplete) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const fetchRecommendations = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "All") {
          queryParams.set("category", selectedCategory);
        }

        const res = await fetch(`${apiUrl}/schemes/recommendations?${queryParams.toString()}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(user?.sub ? { "X-Citizen-Sub": user.sub } : {}),
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Authentication required to access recommendations.");
          } else if (res.status === 400) {
            throw new Error("Demographic profile incomplete.");
          }
          throw new Error(`Failed to load recommendations (${res.status})`);
        }

        const data = await res.json();
        if (isMounted) {
          setSchemes(data.items || []);
          setTotalCount(data.total_recommended || 0);
          setCategories(data.categories || []);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error loading recommendations:", err);
        if (isMounted) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    };

    fetchRecommendations();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isProfileComplete, user?.sub, user?.demographics, token, selectedCategory, apiUrl]);

  // Client-side search and sorting within recommendations
  const filteredSchemes = useMemo(() => {
    let result = [...schemes];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.scheme_name?.toLowerCase().includes(q) ||
          s.benefits?.toLowerCase().includes(q) ||
          s.details?.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q) ||
          s.scheme_category?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "match") {
      result.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
    } else if (sortBy === "central") {
      result.sort((a, b) => {
        if (a.level === "Central" && b.level !== "Central") return -1;
        if (a.level !== "Central" && b.level === "Central") return 1;
        return (b.match_score || 0) - (a.match_score || 0);
      });
    } else if (sortBy === "state") {
      result.sort((a, b) => {
        if (a.level !== "Central" && b.level === "Central") return -1;
        if (a.level === "Central" && b.level !== "Central") return 1;
        return (b.match_score || 0) - (a.match_score || 0);
      });
    }

    return result;
  }, [schemes, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#070d17] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ========================================================================= */}
        {/* STATE 1: UNAUTHENTICATED CITIZEN (Civic Security Vault Gate)              */}
        {/* ========================================================================= */}
        {!authLoading && !isAuthenticated && (
          <div className="max-w-2xl mx-auto my-12 text-center animate-in fade-in duration-300">
            <div className="bg-slate-900/80 border border-white/[0.1] rounded-3xl p-8 sm:p-12 shadow-[0_24px_60px_rgba(0,0,0,0.45)] relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Security Shield Graphic */}
              <div className="w-20 h-20 bg-slate-800/90 border border-white/[0.08] rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-inner">
                <Lock className="w-10 h-10 text-amber-400" />
              </div>

              <span className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t("recommendations.badge") || "Citizen Recommendation Vault"}
              </span>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-50 mb-3 tracking-tight">
                {t("recommendations.authRequiredTitle") || "Citizen Verification Required"}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto font-normal">
                {t("recommendations.authRequiredDesc") ||
                  "Personalized welfare scheme recommendations are calculated specifically against your demographic criteria. Sign in to instantly discover which of the 3,400+ government programs you are eligible to avail right now."}
              </p>

              {/* Benefits Checklist */}
              <div className="bg-slate-800/60 border border-white/[0.08] rounded-2xl p-5 mb-8 text-left space-y-3 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Precision matching by <strong className="text-slate-50 font-bold">State, Occupation, Age &amp; Category</strong></span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero administrative guesswork — see exact eligibility criteria met</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Voice-guided assistance and application checklist in your regional language</span>
                </div>
              </div>

              {/* Solid Button: No Multi-Stop Gradients */}
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 mx-auto transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
              >
                <UserCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                <span>{t("recommendations.signInBtn") || "Sign In with Citizen ID"}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATE 2: AUTHENTICATED BUT PROFILE INCOMPLETE (Onboarding Gate)           */}
        {/* ========================================================================= */}
        {!authLoading && isAuthenticated && !isProfileComplete && (
          <div className="max-w-2xl mx-auto my-12 text-center animate-in fade-in duration-300">
            <div className="bg-slate-900/80 border border-white/[0.1] rounded-3xl p-8 sm:p-12 shadow-[0_24px_60px_rgba(0,0,0,0.45)] relative overflow-hidden backdrop-blur-xl">
              {/* Progress Tracker */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    ✓
                  </div>
                  <span>1. Signed In</span>
                </div>
                <div className="w-8 h-0.5 bg-slate-700" />
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    2
                  </div>
                  <span>2. Profile Form</span>
                </div>
                <div className="w-8 h-0.5 bg-slate-700" />
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    3
                  </div>
                  <span>3. Schemes</span>
                </div>
              </div>

              <div className="w-16 h-16 bg-slate-800/90 border border-white/[0.08] rounded-2xl mx-auto flex items-center justify-center mb-5">
                <Sliders className="w-8 h-8 text-amber-400" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-50 mb-3 tracking-tight">
                {t("recommendations.profileIncompleteTitle") || "Complete Your Demographic Profile"}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto font-normal">
                {t("recommendations.profileIncompleteDesc") ||
                  "To calculate which of the 3,400+ Central and State welfare schemes you can avail at this moment, please tell us your State of Residence and Primary Occupation."}
              </p>

              {/* Solid Button: No Gradients */}
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 mx-auto transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
              >
                <Sliders className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                <span>{t("recommendations.completeProfileBtn") || "Complete Demographic Form"}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATE 3: AUTHENTICATED & PROFILE COMPLETE (Personalized Vault Dashboard)  */}
        {/* ========================================================================= */}
        {!authLoading && isAuthenticated && isProfileComplete && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Hero Banner (Obsidian Frosted Glass) */}
            <div className="bg-slate-900/80 border border-white/[0.08] rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl shadow-xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      {t("recommendations.badge") || "Citizen Recommendation Vault"}
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      • {user.name}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-50 tracking-tight leading-tight">
                    {t("recommendations.title") || "Schemes Matched For You"}
                  </h1>

                  <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-normal">
                    {t("recommendations.subtitle") ||
                      "Government assistance programs automatically verified against your residence, occupation, and social demographic criteria."}
                  </p>
                </div>

                {/* Counter Pill & Quick Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="bg-slate-800/80 border border-white/[0.08] rounded-2xl px-5 py-3 text-center shadow-inner">
                    <div className="text-2xl sm:text-3xl font-black text-amber-400">
                      {isLoading ? "..." : totalCount}
                    </div>
                    <div className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">
                      {t("recommendations.totalEligible") || "Eligible Schemes"}
                    </div>
                  </div>

                  {/* Solid Button */}
                  <button
                    type="button"
                    onClick={() => setProfileModalOpen(true)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-4 py-3 rounded-xl border border-white/[0.08] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>{t("recommendations.editProfile") || "Edit Demographics"}</span>
                  </button>
                </div>
              </div>

              {/* Active Demographic Badges Strip */}
              <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1">
                  Active Criteria:
                </span>

                {user.demographics.state && (
                  <span className="bg-slate-800/90 text-slate-200 border border-white/[0.08] text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{user.demographics.state}</span>
                  </span>
                )}

                {user.demographics.occupation && (
                  <span className="bg-slate-800/90 text-slate-200 border border-white/[0.08] text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{user.demographics.occupation}</span>
                  </span>
                )}

                {user.demographics.gender && user.demographics.gender !== "All" && (
                  <span className="bg-slate-800/90 text-slate-200 border border-white/[0.08] text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{user.demographics.gender}</span>
                  </span>
                )}

                {user.demographics.caste && (
                  <span className="bg-slate-800/90 text-slate-200 border border-white/[0.08] text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{user.demographics.caste}</span>
                  </span>
                )}

                {user.demographics.age && (
                  <span className="bg-slate-800/90 text-slate-200 border border-white/[0.08] text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <span>Age: {user.demographics.age} yrs</span>
                  </span>
                )}
              </div>
            </div>

            {/* Filter Pills & Search Controls (Solid Borderless Pills) */}
            <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-xl">
              {/* Category Segmented Scroller */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    selectedCategory === "All"
                      ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                      : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {t("recommendations.allCategories") || "All Eligible"} ({totalCount})
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                        : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search & Sort Controls */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t("recommendations.searchPlaceholder") || "Search within recommendations..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800/80 border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-800/80 border border-white/[0.1] rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 focus:border-amber-400 focus:outline-none cursor-pointer"
                >
                  <option value="match" className="bg-slate-900 text-slate-100">Sort by: Best Match %</option>
                  <option value="state" className="bg-slate-900 text-slate-100">Sort by: State Schemes First</option>
                  <option value="central" className="bg-slate-900 text-slate-100">Sort by: Central Schemes First</option>
                </select>
              </div>
            </div>

            {/* Scheme Cards Grid: Enlarged, Structured & Spacious */}
            {isLoading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-300">
                  Calculating eligibility across 3,400 schemes...
                </p>
              </div>
            ) : filteredSchemes.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {filteredSchemes.map((scheme) => (
                  <SchemeCard
                    key={scheme.id || scheme.slug || scheme.scheme_name}
                    scheme={scheme}
                    onSelect={(s) => setSelectedScheme(s)}
                    onVoiceQuery={(s) => router.push(`/?q=${encodeURIComponent(s.scheme_name || s.title)}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/80 border border-white/[0.08] rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 backdrop-blur-xl">
                <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-100">
                  No Schemes Found Matching Filters
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Try clearing your search query or selecting &quot;All Eligible Categories&quot; to see all recommended schemes.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Scheme Details Modal */}
      <SchemeModal
        scheme={selectedScheme}
        onClose={() => setSelectedScheme(null)}
      />

      {/* Citizen Authentication & Profile Modals */}
      <CitizenLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      <CitizenProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
