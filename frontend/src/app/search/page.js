"use client";

import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemeCard from "@/components/SchemeCard";
import SchemeModal from "@/components/SchemeModal";
import allSchemes from "@/data/schemes.json";
import { useLanguage } from "@/i18n/LanguageContext";
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal, 
  RotateCcw
} from "lucide-react";

const CATEGORIES = [
  "All Categories",
  "Agriculture",
  "Social welfare & Empowerment",
  "Business & Entrepreneurship",
  "Education & Learning",
  "Women and Child",
  "Health & Wellness",
  "Housing & Shelter"
];

const STATES = [
  "All States & UTs",
  "Central / All India",
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal"
];

const GENDERS = ["All Genders", "Female", "Male", "Transgender"];

const OCCUPATIONS = [
  "All Occupations",
  "Farmer",
  "Student",
  "Construction / Unorganized Worker",
  "Fisherman",
  "Entrepreneur / MSME",
  "All Citizens"
];

const CASTES = ["All Castes", "General", "OBC", "SC", "ST", "EWS"];

export default function SearchPage() {
  const { t } = useLanguage();
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedState, setSelectedState] = useState("All States & UTs");
  const [selectedGender, setSelectedGender] = useState("All Genders");
  const [selectedOccupation, setSelectedOccupation] = useState("All Occupations");
  const [selectedCaste, setSelectedCaste] = useState("All Castes");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat && CATEGORIES.includes(cat)) {
        setSelectedCategory(cat);
      }
    }
  }, []);

  const filteredSchemes = useMemo(() => {
    return allSchemes.filter((scheme) => {
      if (keyword.trim()) {
        const query = keyword.toLowerCase();
        const searchCorpus = (
          (scheme.scheme_name || "") + " " +
          (scheme.details || "") + " " +
          (scheme.benefits || "") + " " +
          (scheme.eligibility || "") + " " +
          (scheme.category || "") + " " +
          (scheme.state || "")
        ).toLowerCase();
        if (!searchCorpus.includes(query)) return false;
      }

      if (selectedLevel !== "All" && scheme.level !== selectedLevel) {
        return false;
      }

      if (selectedCategory !== "All Categories" && scheme.category !== selectedCategory) {
        return false;
      }

      if (selectedState !== "All States & UTs") {
        if (selectedState === "Central / All India") {
          if (scheme.level !== "Central" && scheme.state !== "All India") return false;
        } else {
          if (scheme.state !== selectedState && scheme.state !== "All India") return false;
        }
      }

      if (selectedGender !== "All Genders") {
        if (scheme.gender && scheme.gender !== "All" && scheme.gender !== selectedGender) {
          return false;
        }
      }

      if (selectedOccupation !== "All Occupations") {
        if (scheme.occupation && scheme.occupation !== "All Citizens" && scheme.occupation !== selectedOccupation) {
          return false;
        }
      }

      if (selectedCaste !== "All Castes") {
        if (scheme.caste && scheme.caste !== "All" && scheme.caste !== selectedCaste) {
          return false;
        }
      }

      return true;
    });
  }, [keyword, selectedLevel, selectedCategory, selectedState, selectedGender, selectedOccupation, selectedCaste]);

  const handleResetFilters = () => {
    setKeyword("");
    setSelectedCategory("All Categories");
    setSelectedState("All States & UTs");
    setSelectedGender("All Genders");
    setSelectedOccupation("All Occupations");
    setSelectedCaste("All Castes");
    setSelectedLevel("All");
  };

  const activeFiltersCount = [
    selectedCategory !== "All Categories",
    selectedState !== "All States & UTs",
    selectedGender !== "All Genders",
    selectedOccupation !== "All Occupations",
    selectedCaste !== "All Castes",
    selectedLevel !== "All",
    keyword.trim().length > 0
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
      <Navbar />

      {/* Top Banner & Search Header in Deep Saturated Indigo */}
      <div className="bg-[#1A365D] text-white border-b border-[#23487A] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold bg-[#122844] text-[#F59E0B] border border-[#23487A] px-3 py-1 rounded-full uppercase tracking-wider">
                {t("search.badge")}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">
                {t("search.title")}
              </h1>
              <p className="text-slate-200 text-sm sm:text-base mt-1 font-medium">
                {t("search.subtitle")}
              </p>
            </div>

            {/* Level Segmented Controls */}
            <div className="inline-flex bg-[#122844] p-1 rounded-xl border border-[#23487A] self-start md:self-auto">
              <button
                type="button"
                onClick={() => setSelectedLevel("All")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedLevel === "All" ? "bg-[#F59E0B] text-[#171717] shadow-sm" : "text-slate-200 hover:text-white"
                }`}
              >
                {t("search.allSchemes")} ({allSchemes.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedLevel("Central")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedLevel === "Central" ? "bg-[#F59E0B] text-[#171717] shadow-sm" : "text-slate-200 hover:text-white"
                }`}
              >
                {t("search.centralSchemes")}
              </button>
              <button
                type="button"
                onClick={() => setSelectedLevel("State")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedLevel === "State" ? "bg-[#F59E0B] text-[#171717] shadow-sm" : "text-slate-200 hover:text-white"
                }`}
              >
                {t("search.stateSchemes")}
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative mt-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[#00A3C4]" />
            </div>
            <input
              type="text"
              id="scheme-keyword-search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t("search.searchPlaceholder")}
              className="w-full pl-11 pr-11 py-3.5 bg-[#FFFFFF] text-[#171717] text-base font-medium rounded-xl border border-[#E5E5E5] focus:border-[#00A3C4] focus:outline-none civic-shadow-sm placeholder-slate-400"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#171717]"
                aria-label="Clear search input"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Filters + Schemes Grid */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 bg-[#1A365D] text-white px-4 py-2.5 rounded-xl text-sm font-bold border border-[#23487A]"
          >
            <Filter className="w-4 h-4 text-[#F59E0B]" />
            <span>{t("search.filters")} ({activeFiltersCount})</span>
          </button>
          <span className="text-sm font-semibold text-[#171717]">
            {t("search.resultsCount", { count: filteredSchemes.length })}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Left-Hand Filter Sidebar */}
          <aside className="hidden md:block col-span-1 bg-[#F8F9FA] border border-[#E5E5E5] rounded-xl p-5 civic-shadow-sm space-y-6 self-start sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-2 text-[#171717] font-bold text-base">
                <SlidersHorizontal className="w-4 h-4 text-[#00A3C4]" />
                <span>{t("search.filters")}</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t("search.reset")}</span>
                </button>
              )}
            </div>

            {/* State Filter */}
            <div className="space-y-1.5">
              <label htmlFor="filter-state" className="text-xs font-bold text-[#525252] uppercase tracking-wide block">
                {t("search.stateLabel")}
              </label>
              <select
                id="filter-state"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl text-sm font-medium text-[#171717] focus:border-[#00A3C4] focus:outline-none"
              >
                {STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Scheme Category Filter */}
            <div className="space-y-1.5">
              <label htmlFor="filter-category" className="text-xs font-bold text-[#525252] uppercase tracking-wide block">
                {t("search.categoryLabel")}
              </label>
              <select
                id="filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl text-sm font-medium text-[#171717] focus:border-[#00A3C4] focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div className="space-y-1.5">
              <label htmlFor="filter-gender" className="text-xs font-bold text-[#525252] uppercase tracking-wide block">
                {t("search.genderLabel")}
              </label>
              <select
                id="filter-gender"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl text-sm font-medium text-[#171717] focus:border-[#00A3C4] focus:outline-none"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Occupation Filter */}
            <div className="space-y-1.5">
              <label htmlFor="filter-occupation" className="text-xs font-bold text-[#525252] uppercase tracking-wide block">
                {t("search.occupationLabel")}
              </label>
              <select
                id="filter-occupation"
                value={selectedOccupation}
                onChange={(e) => setSelectedOccupation(e.target.value)}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl text-sm font-medium text-[#171717] focus:border-[#00A3C4] focus:outline-none"
              >
                {OCCUPATIONS.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            {/* Caste Filter */}
            <div className="space-y-1.5">
              <label htmlFor="filter-caste" className="text-xs font-bold text-[#525252] uppercase tracking-wide block">
                {t("search.casteLabel")}
              </label>
              <select
                id="filter-caste"
                value={selectedCaste}
                onChange={(e) => setSelectedCaste(e.target.value)}
                className="w-full p-2.5 bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl text-sm font-medium text-[#171717] focus:border-[#00A3C4] focus:outline-none"
              >
                {CASTES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* Right-Hand Schemes Results Section */}
          <section className="col-span-1 md:col-span-3 space-y-6">
            {/* Status & Active Filter Pills */}
            <div className="bg-[#F8F9FA] border border-[#E5E5E5] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 civic-shadow-sm">
              <div className="text-sm font-medium text-[#171717]">
                {t("search.resultsCount", { count: filteredSchemes.length })}
              </div>

              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedCategory !== "All Categories" && (
                    <span className="text-xs bg-[#E6F7FA] text-[#00829D] px-3 py-1 rounded-full font-medium flex items-center gap-1.5 border border-[#00A3C4]/30">
                      <span>{selectedCategory}</span>
                      <button onClick={() => setSelectedCategory("All Categories")}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedState !== "All States & UTs" && (
                    <span className="text-xs bg-[#FFFFFF] text-[#171717] px-3 py-1 rounded-full font-medium flex items-center gap-1.5 border border-[#E5E5E5]">
                      <span>{selectedState}</span>
                      <button onClick={() => setSelectedState("All States & UTs")}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedOccupation !== "All Occupations" && (
                    <span className="text-xs bg-[#E6F7FA] text-[#00829D] px-3 py-1 rounded-full font-medium flex items-center gap-1.5 border border-[#00A3C4]/30">
                      <span>{selectedOccupation}</span>
                      <button onClick={() => setSelectedOccupation("All Occupations")}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedGender !== "All Genders" && (
                    <span className="text-xs bg-[#FFFFFF] text-[#171717] px-3 py-1 rounded-full font-medium flex items-center gap-1.5 border border-[#E5E5E5]">
                      <span>{selectedGender}</span>
                      <button onClick={() => setSelectedGender("All Genders")}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Scheme Cards Grid */}
            {filteredSchemes.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSchemes.map((scheme) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    onSelect={(s) => setSelectedScheme(s)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#F8F9FA] border border-[#E5E5E5] rounded-xl p-12 text-center space-y-4 civic-shadow-sm">
                <div className="w-14 h-14 bg-[#FFF6E6] text-[#F59E0B] rounded-xl flex items-center justify-center mx-auto text-xl font-bold border border-[#F59E0B]/30">
                  !
                </div>
                <h3 className="text-2xl font-bold text-[#171717] tracking-tight">
                  {t("search.noResultsTitle")}
                </h3>
                <p className="text-sm text-[#404040] max-w-md mx-auto leading-relaxed">
                  {t("search.noResultsDesc")}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-[#171717] font-bold px-5 py-2.5 rounded-xl text-sm transition-all civic-shadow-sm"
                >
                  {t("search.clearFilters")}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Mobile Slide-Over Filters */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-slate-950/75 z-50 flex justify-end md:hidden backdrop-blur-xs">
          <div className="bg-[#F8F9FA] w-full max-w-xs h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <h3 className="text-lg font-bold text-[#171717]">{t("search.filters")}</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="text-slate-500 p-1 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm font-semibold">
              <div>
                <label className="block text-xs font-bold text-[#525252] uppercase mb-1">{t("search.stateLabel")}</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full p-2.5 border border-[#E5E5E5] rounded-xl bg-[#FFFFFF] text-sm font-medium text-[#171717]"
                >
                  {STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#525252] uppercase mb-1">{t("search.categoryLabel")}</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 border border-[#E5E5E5] rounded-xl bg-[#FFFFFF] text-sm font-medium text-[#171717]"
                >
                  {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#525252] uppercase mb-1">{t("search.occupationLabel")}</label>
                <select
                  value={selectedOccupation}
                  onChange={(e) => setSelectedOccupation(e.target.value)}
                  className="w-full p-2.5 border border-[#E5E5E5] rounded-xl bg-[#FFFFFF] text-sm font-medium text-[#171717]"
                >
                  {OCCUPATIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#525252] uppercase mb-1">{t("search.genderLabel")}</label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full p-2.5 border border-[#E5E5E5] rounded-xl bg-[#FFFFFF] text-sm font-medium text-[#171717]"
                >
                  {GENDERS.map((g) => (<option key={g} value={g}>{g}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#525252] uppercase mb-1">{t("search.casteLabel")}</label>
                <select
                  value={selectedCaste}
                  onChange={(e) => setSelectedCaste(e.target.value)}
                  className="w-full p-2.5 border border-[#E5E5E5] rounded-xl bg-[#FFFFFF] text-sm font-medium text-[#171717]"
                >
                  {CASTES.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E5E5] space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-[#171717] py-3 rounded-xl font-bold text-sm shadow-sm"
              >
                {t("search.applyFilters", { count: filteredSchemes.length })}
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full bg-[#FFFFFF] text-[#171717] border border-[#E5E5E5] py-2.5 rounded-xl font-semibold text-xs"
              >
                {t("search.reset")}
              </button>
            </div>
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

      <Footer />
    </div>
  );
}
