"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemeCard from "@/components/SchemeCard";
import SchemeModal from "@/components/SchemeModal";
import allSchemes from "@/data/schemes.json";
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal, 
  RotateCcw, 
  Building2, 
  Check, 
  ChevronDown, 
  ChevronUp,
  MapPin,
  Users,
  Briefcase,
  GraduationCap
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
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedState, setSelectedState] = useState("All States & UTs");
  const [selectedGender, setSelectedGender] = useState("All Genders");
  const [selectedOccupation, setSelectedOccupation] = useState("All Occupations");
  const [selectedCaste, setSelectedCaste] = useState("All Castes");
  const [selectedLevel, setSelectedLevel] = useState("All"); // 'All' | 'Central' | 'State'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Filter schemes
  const filteredSchemes = useMemo(() => {
    return allSchemes.filter((scheme) => {
      // Keyword search
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        const matchName = scheme.scheme_name.toLowerCase().includes(q);
        const matchDetails = scheme.details.toLowerCase().includes(q);
        const matchBenefits = scheme.benefits.toLowerCase().includes(q);
        const matchTags = scheme.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchDetails && !matchBenefits && !matchTags) return false;
      }

      // Level filter
      if (selectedLevel !== "All") {
        if (scheme.level !== selectedLevel) return false;
      }

      // Category filter
      if (selectedCategory !== "All Categories") {
        if (!scheme.category.toLowerCase().includes(selectedCategory.toLowerCase())) return false;
      }

      // State filter
      if (selectedState !== "All States & UTs") {
        if (selectedState === "Central / All India") {
          if (scheme.level !== "Central" && scheme.state !== "Central / All India" && scheme.state !== "All India") return false;
        } else {
          if (scheme.state !== selectedState && scheme.state !== "All India") return false;
        }
      }

      // Gender filter
      if (selectedGender !== "All Genders") {
        if (scheme.gender !== "All" && scheme.gender !== selectedGender) return false;
      }

      // Occupation filter
      if (selectedOccupation !== "All Occupations") {
        if (scheme.occupation !== "All Citizens" && scheme.occupation !== selectedOccupation) return false;
      }

      // Caste filter
      if (selectedCaste !== "All Castes") {
        if (scheme.caste !== "All" && scheme.caste !== selectedCaste) return false;
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
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      {/* Top Banner & Search Header */}
      <div className="bg-[#0F172A] text-white border-b-4 border-[#D97706] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black bg-[#D97706] text-slate-950 px-2.5 py-0.5 rounded uppercase tracking-wider">
                MyScheme Inspired Portal
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
                योजना खोज पोर्टल | Citizen Scheme Directory
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-1">
                Filter and discover verified welfare schemes across Central and State Governments.
              </p>
            </div>

            {/* Level Quick Toggle (Central vs State) */}
            <div className="inline-flex bg-[#1E293B] p-1 rounded-lg border border-slate-700 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setSelectedLevel("All")}
                className={`px-4 py-2 rounded text-xs font-bold transition-colors ${
                  selectedLevel === "All" ? "bg-[#D97706] text-slate-950" : "text-slate-300 hover:text-white"
                }`}
              >
                All Schemes ({allSchemes.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedLevel("Central")}
                className={`px-4 py-2 rounded text-xs font-bold transition-colors ${
                  selectedLevel === "Central" ? "bg-[#D97706] text-slate-950" : "text-slate-300 hover:text-white"
                }`}
              >
                Central Schemes
              </button>
              <button
                type="button"
                onClick={() => setSelectedLevel("State")}
                className={`px-4 py-2 rounded text-xs font-bold transition-colors ${
                  selectedLevel === "State" ? "bg-[#D97706] text-slate-950" : "text-slate-300 hover:text-white"
                }`}
              >
                State Schemes
              </button>
            </div>
          </div>

          {/* Keyword Search Input Bar */}
          <div className="relative mt-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-6 h-6 text-amber-500" />
            </div>
            <input
              type="text"
              id="scheme-keyword-search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by scheme name, keywords (e.g. Kisan, Mahila, Pension, Housing, Scholarship)..."
              className="w-full pl-12 pr-12 py-3.5 bg-white text-slate-950 text-base font-semibold rounded-lg border-2 border-slate-300 focus:border-amber-500 focus:outline-none shadow-md placeholder-slate-500"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700"
                aria-label="Clear Search Input"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar Filters + Schemes Grid */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Mobile Filter Toggle Button */}
        <div className="md:hidden mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2.5 rounded-lg text-sm font-bold border border-slate-700"
          >
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Filters ({activeFiltersCount})</span>
          </button>
          <span className="text-sm font-bold text-slate-700">
            {filteredSchemes.length} Schemes Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Left-Hand Filter Sidebar */}
          <aside className="hidden md:block col-span-1 bg-white border-2 border-slate-300 rounded-lg p-5 shadow-sm space-y-6 self-start sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
                <SlidersHorizontal className="w-5 h-5 text-amber-600" />
                <span>Filters / फिल्टर</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>

            {/* State Filter */}
            <div className="space-y-1.5">
              <label htmlFor="filter-state" className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                State / UT (राज्य)
              </label>
              <select
                id="filter-state"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border-2 border-slate-300 rounded font-semibold text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
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
              <label htmlFor="filter-category" className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                Category (श्रेणी)
              </label>
              <select
                id="filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border-2 border-slate-300 rounded font-semibold text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
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
              <label htmlFor="filter-gender" className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                Gender (लिंग)
              </label>
              <select
                id="filter-gender"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border-2 border-slate-300 rounded font-semibold text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
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
              <label htmlFor="filter-occupation" className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                Occupation (व्यवसाय)
              </label>
              <select
                id="filter-occupation"
                value={selectedOccupation}
                onChange={(e) => setSelectedOccupation(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border-2 border-slate-300 rounded font-semibold text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
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
              <label htmlFor="filter-caste" className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                Caste Category (जाति वर्ग)
              </label>
              <select
                id="filter-caste"
                value={selectedCaste}
                onChange={(e) => setSelectedCaste(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border-2 border-slate-300 rounded font-semibold text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
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
            <div className="bg-white border-2 border-slate-300 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-bold text-slate-900">
                Showing <span className="text-amber-700 text-lg font-black">{filteredSchemes.length}</span> schemes based on your criteria
              </div>

              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedCategory !== "All Categories" && (
                    <span className="text-xs bg-amber-100 text-amber-900 px-2 py-1 rounded font-bold flex items-center gap-1 border border-amber-300">
                      {selectedCategory}
                      <button onClick={() => setSelectedCategory("All Categories")}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedState !== "All States & UTs" && (
                    <span className="text-xs bg-slate-200 text-slate-900 px-2 py-1 rounded font-bold flex items-center gap-1 border border-slate-400">
                      {selectedState}
                      <button onClick={() => setSelectedState("All States & UTs")}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedOccupation !== "All Occupations" && (
                    <span className="text-xs bg-emerald-100 text-emerald-900 px-2 py-1 rounded font-bold flex items-center gap-1 border border-emerald-300">
                      {selectedOccupation}
                      <button onClick={() => setSelectedOccupation("All Occupations")}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedGender !== "All Genders" && (
                    <span className="text-xs bg-slate-200 text-slate-900 px-2 py-1 rounded font-bold flex items-center gap-1 border border-slate-400">
                      {selectedGender}
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
              <div className="bg-white border-2 border-slate-300 rounded-lg p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
                  !
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  No Matching Schemes Found / कोई योजना नहीं मिली
                </h3>
                <p className="text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                  Try broadening your search criteria, removing some demographic filters, or searching with general terms like "loan", "farmer", or "pension".
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-[#D97706] hover:bg-[#B45309] text-slate-950 font-black px-6 py-2.5 rounded text-sm transition-colors"
                >
                  Clear All Filters / सभी फिल्टर हटाएं
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex justify-end md:hidden">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
              <h3 className="text-lg font-black text-slate-900">Filters / फिल्टर</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="text-slate-600 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Filters */}
            <div className="space-y-4 text-sm font-semibold">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">State / UT</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full p-2 border-2 border-slate-300 rounded bg-slate-50"
                >
                  {STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border-2 border-slate-300 rounded bg-slate-50"
                >
                  {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Occupation</label>
                <select
                  value={selectedOccupation}
                  onChange={(e) => setSelectedOccupation(e.target.value)}
                  className="w-full p-2 border-2 border-slate-300 rounded bg-slate-50"
                >
                  {OCCUPATIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Gender</label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full p-2 border-2 border-slate-300 rounded bg-slate-50"
                >
                  {GENDERS.map((g) => (<option key={g} value={g}>{g}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Caste Category</label>
                <select
                  value={selectedCaste}
                  onChange={(e) => setSelectedCaste(e.target.value)}
                  className="w-full p-2 border-2 border-slate-300 rounded bg-slate-50"
                >
                  {CASTES.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#0F172A] text-white py-3 rounded font-black text-sm"
              >
                Apply Filters ({filteredSchemes.length} Results)
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full bg-slate-200 text-slate-800 py-2 rounded font-bold text-xs"
              >
                Reset All
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
