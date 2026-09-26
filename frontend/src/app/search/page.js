"use client";

import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemeCard from "@/components/SchemeCard";
import SchemeModal from "@/components/SchemeModal";
import allSchemes from "@/data/schemes.json";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal, 
  RotateCcw,
  Sparkles,
  UserCheck,
  Building2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers
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
  const { user, token, isAuthenticated } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedState, setSelectedState] = useState("All States & UTs");
  const [selectedGender, setSelectedGender] = useState("All Genders");
  const [selectedOccupation, setSelectedOccupation] = useState("All Occupations");
  const [selectedCaste, setSelectedCaste] = useState("All Castes");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const [schemes, setSchemes] = useState(allSchemes);
  const [totalCount, setTotalCount] = useState(allSchemes.length);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoriesList, setCategoriesList] = useState(CATEGORIES);
  const [statesList, setStatesList] = useState(STATES);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) {
        setSelectedCategory(cat);
      }
    }
  }, []);

  // Fetch dynamic categories and states from FastAPI backend if available
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    fetch(`${apiUrl}/schemes/categories`)
      .then((res) => (res.ok ? res.json() : null))
      .then((cats) => {
        if (cats && Array.isArray(cats) && cats.length > 0) {
          const uniqueCats = Array.from(new Set(["All Categories", ...cats]));
          setCategoriesList(uniqueCats);
        }
      })
      .catch(() => {});

    fetch(`${apiUrl}/schemes/states`)
      .then((res) => (res.ok ? res.json() : null))
      .then((sts) => {
        if (sts && Array.isArray(sts) && sts.length > 0) {
          const uniqueStates = Array.from(new Set(["All States & UTs", "Central / All India", ...sts]));
          setStatesList(uniqueStates);
        }
      })
      .catch(() => {});
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [keyword, selectedCategory, selectedState, selectedGender, selectedOccupation, selectedCaste, selectedLevel]);

  // Fetch schemes from FastAPI backend with automatic local fallback
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    let isCancelled = false;

    const fetchLiveSchemes = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (keyword.trim()) queryParams.set("q", keyword.trim());
        if (selectedCategory !== "All Categories") queryParams.set("category", selectedCategory);
        if (selectedState !== "All States & UTs") {
          if (selectedState !== "Central / All India") {
            queryParams.set("state", selectedState);
          }
        }
        if (selectedGender !== "All Genders") queryParams.set("gender", selectedGender);
        if (selectedOccupation !== "All Occupations") queryParams.set("occupation", selectedOccupation);
        if (selectedCaste !== "All Castes") queryParams.set("caste", selectedCaste);
        queryParams.set("page", page.toString());
        queryParams.set("page_size", "12");

        const res = await fetch(`${apiUrl}/schemes/search?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Search backend request failed");

        const data = await res.json();
        if (!isCancelled) {
          let items = data.items || [];
          if (selectedLevel === "Central") {
            items = items.filter((s) => s.level === "Central");
          } else if (selectedLevel === "State") {
            items = items.filter((s) => s.level === "State");
          }

          setSchemes(items);
          setTotalCount(data.total || items.length);
          setTotalPages(data.total_pages || Math.ceil((data.total || items.length) / 12) || 1);
          setIsLiveBackend(true);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        // Fallback to client-side filtering on allSchemes.json
        if (!isCancelled) {
          setIsLiveBackend(false);
          let filtered = allSchemes.filter((scheme) => {
            if (keyword.trim()) {
              const q = keyword.toLowerCase();
              const matchName = scheme.scheme_name.toLowerCase().includes(q);
              const matchDesc = scheme.details.toLowerCase().includes(q);
              const matchCat = scheme.category.toLowerCase().includes(q);
              if (!matchName && !matchDesc && !matchCat) return false;
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
            if (selectedLevel !== "All" && scheme.level !== selectedLevel) {
              return false;
            }
            if (selectedGender !== "All Genders" && scheme.gender && scheme.gender !== "All") {
              if (scheme.gender !== selectedGender) return false;
            }
            if (selectedOccupation !== "All Occupations" && scheme.occupation && scheme.occupation !== "All Citizens") {
              if (scheme.occupation !== selectedOccupation) return false;
            }
            if (selectedCaste !== "All Castes" && scheme.caste && scheme.caste !== "All") {
              if (scheme.caste !== selectedCaste) return false;
            }
            return true;
          });

          setTotalCount(filtered.length);
          const pageSize = 12;
          setTotalPages(Math.ceil(filtered.length / pageSize) || 1);
          const startIndex = (page - 1) * pageSize;
          setSchemes(filtered.slice(startIndex, startIndex + pageSize));
          setIsLoading(false);
        }
      }
    };

    const timeout = setTimeout(() => {
      fetchLiveSchemes();
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [keyword, selectedCategory, selectedState, selectedGender, selectedOccupation, selectedCaste, selectedLevel, page]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All Categories") count++;
    if (selectedState !== "All States & UTs") count++;
    if (selectedGender !== "All Genders") count++;
    if (selectedOccupation !== "All Occupations") count++;
    if (selectedCaste !== "All Castes") count++;
    if (selectedLevel !== "All") count++;
    if (keyword.trim()) count++;
    return count;
  }, [selectedCategory, selectedState, selectedGender, selectedOccupation, selectedCaste, selectedLevel, keyword]);

  const handleResetFilters = () => {
    setKeyword("");
    setSelectedCategory("All Categories");
    setSelectedState("All States & UTs");
    setSelectedGender("All Genders");
    setSelectedOccupation("All Occupations");
    setSelectedCaste("All Castes");
    setSelectedLevel("All");
    setPage(1);
  };

  const handleApplyProfileFilters = () => {
    if (!isAuthenticated || !user?.demographics) return;
    const demo = user.demographics;
    if (demo.state) setSelectedState(demo.state);
    if (demo.gender && demo.gender !== "All") setSelectedGender(demo.gender);
    if (demo.occupation && demo.occupation !== "All Citizens") setSelectedOccupation(demo.occupation);
    if (demo.caste && demo.caste !== "All") setSelectedCaste(demo.caste);
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070d17] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />

      {/* Hero Header & Search Bar */}
      <div className="relative bg-slate-950/80 border-b border-white/[0.08] backdrop-blur-xl pt-12 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3.5 py-1 text-xs font-semibold text-amber-400 mb-2 border border-white/[0.06]">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>OFFICIAL SCHEME DIRECTORY</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-50 tracking-tight">
                National Welfare Registry
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl font-normal">
                Search, filter, and inspect verified Central and State welfare assistance programs.
              </p>
            </div>

            {/* Level Segmented Selector (Solid Borderless Pills) */}
            <div className="inline-flex bg-slate-900/90 p-1 rounded-2xl border border-white/[0.08] backdrop-blur-md self-start md:self-auto gap-1">
              {[
                { id: "All", label: `All Schemes (${isLiveBackend ? totalCount : allSchemes.length})` },
                { id: "Central", label: "Central Level" },
                { id: "State", label: "State Level" }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedLevel === lvl.id
                      ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-amber-400" />
            </div>
            <input
              type="text"
              id="scheme-keyword-search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by scheme name, keywords, benefits (e.g. Kisan, Scholarship, Loan, Widow Pension)..."
              className="w-full pl-12 pr-12 py-4 bg-slate-900/90 text-slate-100 text-base font-normal rounded-2xl border border-white/[0.1] focus:border-amber-400 focus:outline-none placeholder-slate-400 shadow-inner backdrop-blur-md transition-colors"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white cursor-pointer"
                aria-label="Clear search input"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Filters + Large Schemes Grid */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/[0.08] cursor-pointer"
          >
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Filters ({activeFiltersCount})</span>
          </button>
          <span className="text-sm font-semibold text-slate-300">
            {totalCount} Schemes Found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Left-Hand Filter Sidebar */}
          <aside className="hidden md:block col-span-1 bg-slate-900/75 border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6 self-start sticky top-36 z-20">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Filters</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Optional Citizen Profile Auto-Filter Helper */}
            {isAuthenticated && user?.demographics && (
              <div className="bg-slate-800/60 border border-white/[0.08] rounded-xl p-3.5 text-xs space-y-2.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Citizen Profile Match</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-tight">
                  {user.name || "Citizen"}: {user.demographics.occupation || "General"} ({user.demographics.state || "All India"})
                </p>
                <button
                  type="button"
                  onClick={handleApplyProfileFilters}
                  className="w-full py-2 px-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <UserCheck className="w-3 h-3" />
                  <span>Apply Profile Filters</span>
                </button>
              </div>
            )}

            {/* State Filter */}
            <div className="space-y-2">
              <label htmlFor="filter-state" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                State / Territory
              </label>
              <select
                id="filter-state"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-3 bg-slate-800/80 border border-white/[0.08] rounded-xl text-sm font-medium text-slate-100 focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                {statesList.map((state, idx) => (
                  <option key={`desktop-state-${idx}-${state}`} value={state} className="bg-slate-900 text-slate-100">
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label htmlFor="filter-category" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Sector / Category
              </label>
              <select
                id="filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 bg-slate-800/80 border border-white/[0.08] rounded-xl text-sm font-medium text-slate-100 focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                {categoriesList.map((cat, idx) => (
                  <option key={`desktop-cat-${idx}-${cat}`} value={cat} className="bg-slate-900 text-slate-100">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Occupation Filter */}
            <div className="space-y-2">
              <label htmlFor="filter-occupation" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Target Occupation
              </label>
              <select
                id="filter-occupation"
                value={selectedOccupation}
                onChange={(e) => setSelectedOccupation(e.target.value)}
                className="w-full p-3 bg-slate-800/80 border border-white/[0.08] rounded-xl text-sm font-medium text-slate-100 focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                {OCCUPATIONS.map((occ) => (
                  <option key={occ} value={occ} className="bg-slate-900 text-slate-100">
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div className="space-y-2">
              <label htmlFor="filter-gender" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Gender Demographic
              </label>
              <select
                id="filter-gender"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full p-3 bg-slate-800/80 border border-white/[0.08] rounded-xl text-sm font-medium text-slate-100 focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g} className="bg-slate-900 text-slate-100">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Social Category / Caste Filter */}
            <div className="space-y-2">
              <label htmlFor="filter-caste" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Social Category
              </label>
              <select
                id="filter-caste"
                value={selectedCaste}
                onChange={(e) => setSelectedCaste(e.target.value)}
                className="w-full p-3 bg-slate-800/80 border border-white/[0.08] rounded-xl text-sm font-medium text-slate-100 focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                {CASTES.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-slate-100">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* Right-Hand Schemes Results Section */}
          <section className="col-span-1 md:col-span-3 space-y-6">
            {/* Status & Active Filter Pills */}
            <div className="bg-slate-900/75 border border-white/[0.08] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 backdrop-blur-xl shadow-md">
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold text-slate-200">
                  {totalCount} {totalCount === 1 ? "Scheme" : "Schemes"} Available
                </div>
                {isLiveBackend && (
                  <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-0.5 rounded-full font-semibold flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-emerald-400" />
                    <span>Live Database</span>
                  </span>
                )}
                {isLoading && (
                  <span className="text-xs text-amber-400 italic animate-pulse">
                    Refreshing schemes...
                  </span>
                )}
              </div>

              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {selectedCategory !== "All Categories" && (
                    <span className="text-xs bg-slate-800 text-slate-200 px-3 py-1 rounded-xl font-medium flex items-center gap-1.5 border border-white/[0.08]">
                      <span>{selectedCategory}</span>
                      <button onClick={() => setSelectedCategory("All Categories")} className="cursor-pointer hover:text-white"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedState !== "All States & UTs" && (
                    <span className="text-xs bg-slate-800 text-slate-200 px-3 py-1 rounded-xl font-medium flex items-center gap-1.5 border border-white/[0.08]">
                      <span>{selectedState}</span>
                      <button onClick={() => setSelectedState("All States & UTs")} className="cursor-pointer hover:text-white"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedOccupation !== "All Occupations" && (
                    <span className="text-xs bg-slate-800 text-slate-200 px-3 py-1 rounded-xl font-medium flex items-center gap-1.5 border border-white/[0.08]">
                      <span>{selectedOccupation}</span>
                      <button onClick={() => setSelectedOccupation("All Occupations")} className="cursor-pointer hover:text-white"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedGender !== "All Genders" && (
                    <span className="text-xs bg-slate-800 text-slate-200 px-3 py-1 rounded-xl font-medium flex items-center gap-1.5 border border-white/[0.08]">
                      <span>{selectedGender}</span>
                      <button onClick={() => setSelectedGender("All Genders")} className="cursor-pointer hover:text-white"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Large Scheme Cards Grid (Spacious 2-column on desktop) */}
            {schemes.length > 0 ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {schemes.map((scheme) => (
                    <SchemeCard
                      key={scheme.id || scheme.slug}
                      scheme={scheme}
                      onSelect={(s) => setSelectedScheme(s)}
                    />
                  ))}
                </div>

                {/* Pagination Controls (Solid Borderless Buttons) */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between bg-slate-900/75 border border-white/[0.08] rounded-2xl p-4 sm:p-5 backdrop-blur-xl">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                    <div className="text-xs font-semibold text-slate-300">
                      Page <strong className="text-slate-100">{page}</strong> of <strong className="text-slate-100">{totalPages}</strong>
                    </div>
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-900/75 border border-white/[0.08] rounded-2xl p-12 text-center space-y-4 backdrop-blur-xl">
                <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
                  !
                </div>
                <h3 className="text-xl font-bold text-slate-100">
                  No Welfare Schemes Found
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  We could not find any active schemes matching your combination of filters. Try broadening your state, occupation, or keyword queries.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {/* Scheme Details Modal */}
      {selectedScheme && (
        <SchemeModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
        />
      )}
    </div>
  );
}
