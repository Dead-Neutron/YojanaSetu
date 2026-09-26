"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemeModal from "@/components/SchemeModal";
import CitizenLoginModal from "@/components/CitizenLoginModal";
import CitizenProfileModal from "@/components/CitizenProfileModal";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";
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
  const { t, language } = useLanguage();
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
    <div className="min-h-screen bg-[#0B1E36] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ========================================================================= */}
        {/* STATE 1: UNAUTHENTICATED CITIZEN (Civic Security Vault Gate)              */}
        {/* ========================================================================= */}
        {!authLoading && !isAuthenticated && (
          <div className="max-w-2xl mx-auto my-12 text-center animate-in fade-in duration-300">
            <div className="bg-[#122844] border border-[#23487A] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A3C4]/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Security Shield Graphic */}
              <div className="w-20 h-20 bg-[#1A365D] border border-[#23487A] rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-inner">
                <Lock className="w-10 h-10 text-[#F59E0B]" />
              </div>

              <span className="inline-flex items-center gap-1.5 bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t("recommendations.badge") || "Citizen Recommendation Vault"}
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
                {t("recommendations.authRequiredTitle") || "Citizen Authentication Required"}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
                {t("recommendations.authRequiredDesc") ||
                  "Personalized welfare scheme recommendations are calculated exclusively for authenticated citizens with a verified demographic profile. Sign in to instantly discover which of the 3,400+ government programs you are eligible to avail right now."}
              </p>

              {/* Benefits Checklist */}
              <div className="bg-[#0B1E36] border border-[#23487A] rounded-2xl p-5 mb-8 text-left space-y-3">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>Precision matching by <strong>State, Occupation, Age & Category</strong></span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>Zero administrative guesswork — see exact eligibility criteria met</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>Voice-guided assistance and application checklist in your language</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="bg-[#F59E0B] hover:bg-[#D97706] text-[#171717] px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 mx-auto transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <UserCheck className="w-5 h-5 text-[#171717]" />
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
            <div className="bg-[#122844] border border-[#23487A] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              {/* Progress Tracker */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#059669]">
                  <div className="w-6 h-6 rounded-full bg-[#059669]/20 border border-[#059669] flex items-center justify-center">
                    ✓
                  </div>
                  <span>1. Signed In</span>
                </div>
                <div className="w-8 h-0.5 bg-[#23487A]"></div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#F59E0B]">
                  <div className="w-6 h-6 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B] flex items-center justify-center">
                    2
                  </div>
                  <span>2. Profile Form</span>
                </div>
                <div className="w-8 h-0.5 bg-[#23487A]"></div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <div className="w-6 h-6 rounded-full bg-[#1A365D] border border-slate-600 flex items-center justify-center">
                    3
                  </div>
                  <span>3. Schemes</span>
                </div>
              </div>

              <div className="w-16 h-16 bg-[#1A365D] border border-[#23487A] rounded-2xl mx-auto flex items-center justify-center mb-5">
                <Sliders className="w-8 h-8 text-[#00A3C4]" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
                {t("recommendations.profileIncompleteTitle") || "Complete Your Demographic Profile"}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
                {t("recommendations.profileIncompleteDesc") ||
                  "To calculate which of the 3,400+ Central and State welfare schemes you can avail at this moment, please tell us your State of Residence and Primary Occupation."}
              </p>

              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="bg-[#F59E0B] hover:bg-[#D97706] text-[#171717] px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 mx-auto transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Sliders className="w-5 h-5 text-[#171717]" />
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
            {/* Header Hero Banner */}
            <div className="bg-gradient-to-r from-[#122844] via-[#1A365D] to-[#122844] border border-[#23487A] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#00A3C4]/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-[#059669]/20 text-[#34D399] border border-[#059669]/40 text-xs px-3 py-1 rounded-full font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                      {t("recommendations.badge") || "Citizen Recommendation Vault"}
                    </span>
                    <span className="text-xs text-slate-300">
                      • {user.name}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                    {t("recommendations.title") || "Schemes Available for You Right Now"}
                  </h1>

                  <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                    {t("recommendations.subtitle") ||
                      "Government assistance programs automatically verified against your residence, occupation, and social demographic criteria."}
                  </p>
                </div>

                {/* Counter Pill & Quick Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="bg-[#0B1E36]/90 border border-[#23487A] rounded-2xl px-5 py-3 text-center shadow-inner">
                    <div className="text-2xl sm:text-3xl font-black text-[#F59E0B]">
                      {isLoading ? "..." : totalCount}
                    </div>
                    <div className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">
                      {t("recommendations.totalEligible") || "Eligible Schemes"}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setProfileModalOpen(true)}
                    className="bg-[#122844] hover:bg-[#23487A] text-white px-4 py-3 rounded-2xl border border-[#23487A] hover:border-[#00A3C4] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Sliders className="w-4 h-4 text-[#00A3C4]" />
                    <span>{t("recommendations.editProfile") || "Edit Demographics"}</span>
                  </button>
                </div>
              </div>

              {/* Active Demographic Badges Strip */}
              <div className="mt-6 pt-5 border-t border-[#23487A]/60 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mr-1">
                  Active Criteria:
                </span>

                {user.demographics.state && (
                  <span className="bg-[#0B1E36] text-white border border-[#23487A] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>{user.demographics.state}</span>
                  </span>
                )}

                {user.demographics.occupation && (
                  <span className="bg-[#0B1E36] text-white border border-[#23487A] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <Briefcase className="w-3.5 h-3.5 text-[#00A3C4]" />
                    <span>{user.demographics.occupation}</span>
                  </span>
                )}

                {user.demographics.gender && user.demographics.gender !== "All" && (
                  <span className="bg-[#0B1E36] text-white border border-[#23487A] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <User className="w-3.5 h-3.5 text-[#34D399]" />
                    <span>{user.demographics.gender}</span>
                  </span>
                )}

                {user.demographics.caste && (
                  <span className="bg-[#0B1E36] text-white border border-[#23487A] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>{user.demographics.caste}</span>
                  </span>
                )}

                {user.demographics.age && (
                  <span className="bg-[#0B1E36] text-white border border-[#23487A] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <span>Age: {user.demographics.age} yrs</span>
                  </span>
                )}
              </div>
            </div>

            {/* Filter Pills & Search Controls */}
            <div className="bg-[#122844] border border-[#23487A] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Segmented Scroller */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    selectedCategory === "All"
                      ? "bg-[#F59E0B] text-[#171717] shadow-sm"
                      : "bg-[#1A365D] text-slate-200 hover:text-white hover:bg-[#23487A]"
                  }`}
                >
                  {t("recommendations.allCategories") || "All Eligible"} ({totalCount})
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#F59E0B] text-[#171717] shadow-sm"
                        : "bg-[#1A365D] text-slate-200 hover:text-white hover:bg-[#23487A]"
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
                    className="w-full bg-[#0B1E36] border border-[#23487A] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-[#00A3C4] focus:outline-none"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#0B1E36] border border-[#23487A] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:border-[#00A3C4] focus:outline-none cursor-pointer"
                >
                  <option value="match">Sort by: Best Match %</option>
                  <option value="state">Sort by: State Schemes First</option>
                  <option value="central">Sort by: Central Schemes First</option>
                </select>
              </div>
            </div>

            {/* Scheme Cards Grid */}
            {isLoading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#00A3C4]/30 border-t-[#00A3C4] rounded-full animate-spin mx-auto"></div>
                <p className="text-sm font-semibold text-slate-300">
                  Calculating eligibility across 3,400 schemes...
                </p>
              </div>
            ) : filteredSchemes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchemes.map((scheme) => {
                  const score = scheme.match_score || 80;
                  const isPerfect = score >= 90;
                  const isHigh = score >= 75 && score < 90;

                  return (
                    <div
                      key={scheme.id}
                      className="bg-[#122844] border border-[#23487A] hover:border-[#00A3C4] rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between shadow-md hover:shadow-xl relative group"
                    >
                      <div>
                        {/* Top Badges Row */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`text-xs font-black px-3 py-1 rounded-full border flex items-center gap-1 shadow-xs ${
                              isPerfect
                                ? "bg-[#059669]/20 text-[#34D399] border-[#059669]/50"
                                : isHigh
                                ? "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/50"
                                : "bg-[#00A3C4]/20 text-[#00A3C4] border-[#00A3C4]/50"
                            }`}
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>
                              {score}% {isPerfect ? "Perfect Match" : "Eligible"}
                            </span>
                          </span>

                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              scheme.level === "Central"
                                ? "bg-[#1A365D] text-slate-200 border border-[#23487A]"
                                : "bg-[#00829D]/30 text-[#00A3C4] border border-[#00A3C4]/40"
                            }`}
                          >
                            {scheme.level === "Central" ? "Central Level" : scheme.state || "State Level"}
                          </span>
                        </div>

                        {/* Scheme Title */}
                        <h2 className="text-lg font-black text-white leading-snug tracking-tight mb-3 line-clamp-2 group-hover:text-[#F59E0B] transition-colors">
                          {scheme.scheme_name}
                        </h2>

                        {/* Benefits Box */}
                        {scheme.benefits && (
                          <div className="bg-[#0B1E36] border-l-4 border-[#00A3C4] p-3 rounded-r-xl mb-4">
                            <div className="text-[10px] font-bold text-[#00A3C4] uppercase tracking-wider mb-1 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Financial / Welfare Benefit</span>
                            </div>
                            <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                              {scheme.benefits}
                            </p>
                          </div>
                        )}

                        {/* Why You Are Eligible (Personalized Reasons) */}
                        {scheme.match_reasons && scheme.match_reasons.length > 0 && (
                          <div className="mb-4 bg-[#1A365D]/40 border border-[#23487A]/60 rounded-xl p-3">
                            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                              <span>Why you can avail this:</span>
                            </div>
                            <ul className="space-y-1">
                              {scheme.match_reasons.slice(0, 3).map((reason, idx) => (
                                <li key={idx} className="text-[11px] text-slate-200 flex items-start gap-1.5 leading-snug">
                                  <span className="text-[#34D399] font-black shrink-0">✓</span>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Card Action Footer */}
                      <div className="pt-4 border-t border-[#23487A] flex items-center justify-between gap-2 mt-2">
                        <Link
                          href={`/?q=${encodeURIComponent(scheme.scheme_name)}`}
                          className="text-[11px] text-slate-300 hover:text-white font-bold flex items-center gap-1 transition-colors py-1.5 px-2 rounded-lg hover:bg-[#1A365D]"
                          title="Ask Voice Assistant about this scheme"
                        >
                          <Mic className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>Voice Query</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => setSelectedScheme(scheme)}
                          className="bg-[#F59E0B] hover:bg-[#D97706] text-[#171717] px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#122844] border border-[#23487A] rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
                <AlertCircle className="w-12 h-12 text-[#F59E0B] mx-auto" />
                <h3 className="text-lg font-bold text-white">
                  No Schemes Found Matching Filters
                </h3>
                <p className="text-xs text-slate-300">
                  Try clearing your search query or selecting &quot;All Eligible Categories&quot; to see all recommended schemes.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="bg-[#1A365D] hover:bg-[#23487A] text-white px-4 py-2 rounded-xl text-xs font-bold border border-[#23487A] transition-all cursor-pointer"
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
