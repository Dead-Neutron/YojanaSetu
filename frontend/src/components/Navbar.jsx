"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAccessibility } from "@/context/AccessibilityContext";
import { useAuth } from "@/context/AuthContext";
import CitizenLoginModal from "./CitizenLoginModal";
import CitizenProfileModal from "./CitizenProfileModal";
import { 
  Search, 
  Menu, 
  X, 
  User, 
  ShieldCheck,
  Phone,
  Mic,
  Accessibility,
  ChevronDown,
  RotateCcw,
  Type,
  AlignJustify,
  Eye,
  Sparkles,
  Info,
  Sun,
  Moon
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const {
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    dyslexicFont,
    setDyslexicFont,
    highContrast,
    setHighContrast,
    theme,
    setTheme,
    toggleTheme,
    resetAccessibility,
  } = useAccessibility();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [accessibilityDropdownOpen, setAccessibilityDropdownOpen] = useState(false);
  const accessibilityMenuRef = useRef(null);

  // Close accessibility dropdown on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (accessibilityMenuRef.current && !accessibilityMenuRef.current.contains(event.target)) {
        setAccessibilityDropdownOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === "Escape") {
        setAccessibilityDropdownOpen(false);
      }
    }
    if (accessibilityDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [accessibilityDropdownOpen]);

  return (
    <>
      {/* Unified Sticky Civic Header Container (Keeps accessibility bar and navbar pinned together) */}
      <div className="sticky top-0 z-50 w-full shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        {/* =========================================================================
            PRE-NAV: LUMINOUS TRICOLOR NATIONAL ACCENT STRIP
            ========================================================================= */}
        <div 
          className="w-full h-[2px] bg-gradient-to-r from-amber-500/90 via-slate-100/90 to-emerald-500/90 shadow-[0_0_12px_rgba(245,158,11,0.3)] relative z-[60]" 
          aria-hidden="true" 
        />

        {/* =========================================================================
            PRE-NAV: TOP CIVIC UTILITY & ACCESSIBILITY BAR (STICKY WITH HIGHER Z-INDEX THAN NAVBAR)
            ========================================================================= */}
        <div className="bg-slate-950/95 backdrop-blur-xl text-slate-300 text-xs py-2 px-4 border-b border-white/[0.12] relative z-[55]">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Live Official Scheme Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span suppressHydrationWarning className="font-medium text-slate-300 text-xs tracking-wide">
              {t("nav.portalNotice") || "National Citizen Welfare Portal • 100% Free Public Utility"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Toll-Free National Helpline */}
            <span suppressHydrationWarning className="hidden lg:flex items-center gap-1.5 text-slate-300 text-xs">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {t("nav.helpline") || "Helpline"}:{" "}
                <strong className="text-amber-400 font-bold">1800-11-2001</strong>{" "}
                ({t("nav.tollFree") || "Toll-Free"})
              </span>
            </span>

            {/* Subtle Divider before Accessibility & Language Controls */}
            <div className="hidden sm:block h-4 w-px bg-white/[0.16] mx-1" aria-hidden="true" />

            {/* Language Switcher Segmented Pills (Solid Fills, No Gradients) */}
            <div className="inline-flex items-center bg-slate-900/90 p-0.5 rounded-xl border border-white/[0.08] backdrop-blur-md">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    language === lang.code
                      ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                  aria-label={`Change language to ${lang.name}`}
                >
                  <span>{lang.nativeName}</span>
                </button>
              ))}
            </div>

            {/* Small Divider between Language and Accessibility */}
            <div className="h-4 w-px bg-white/[0.18] mx-0.5" aria-hidden="true" />

            {/* Accessibility Dropdown Trigger */}
            <div className="relative" ref={accessibilityMenuRef}>
              <button
                type="button"
                onClick={() => setAccessibilityDropdownOpen(!accessibilityDropdownOpen)}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/[0.08] backdrop-blur-md transition-all cursor-pointer shadow-xs"
                aria-expanded={accessibilityDropdownOpen}
                aria-label="Toggle accessibility options dropdown"
                id="accessibility-dropdown-trigger"
              >
                <Accessibility className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">
                  <span>Accessibility</span>
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${accessibilityDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Accessibility Popover Window (z-[70] floats above both accessibility bar and navbar) */}
              {accessibilityDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-76 sm:w-80 bg-slate-900/98 text-slate-100 border border-white/[0.16] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-5 z-[70] space-y-4 backdrop-blur-2xl"
                  role="region"
                  aria-label="Accessibility Settings"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
                        <Accessibility className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-50">Accessibility Controls</h3>
                        <p className="text-[10px] text-slate-400">WCAG 2.2 AAA Assistive Engine</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAccessibilityDropdownOpen(false)}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      aria-label="Close accessibility menu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Theme Mode Segment */}
                  <div className="bg-slate-800/60 border border-white/[0.06] p-2.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                        {theme === "light" ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
                        <span>Theme (रंग स्वरूप)</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {theme === "light" ? "Linen & Sage" : "Obsidian Night"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setTheme("dark")}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          theme === "dark"
                            ? "bg-slate-700 text-white font-bold shadow-xs"
                            : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300"
                        }`}
                      >
                        <Moon className="w-3 h-3" />
                        <span>Dark</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme("light")}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          theme === "light"
                            ? "bg-amber-500 text-white font-bold shadow-xs"
                            : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300"
                        }`}
                      >
                        <Sun className="w-3 h-3 text-amber-200" />
                        <span>Light</span>
                      </button>
                    </div>
                  </div>

                  {/* Text Size Scaling */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-amber-400" />
                        <span>Text Size</span>
                      </label>
                      <span className="text-[10px] font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded-full border border-white/[0.08]">
                        {fontSize === "normal" ? "100%" : fontSize === "large" ? "125%" : fontSize === "xlarge" ? "150%" : "200%"}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: "normal", label: "A", sub: "100%" },
                        { id: "large", label: "A+", sub: "125%" },
                        { id: "xlarge", label: "A++", sub: "150%" },
                        { id: "max", label: "Max", sub: "200%" }
                      ].map((sz) => (
                        <button
                          key={sz.id}
                          type="button"
                          onClick={() => setFontSize(sz.id)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            fontSize === sz.id
                              ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                              : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300"
                          }`}
                        >
                          <div>{sz.label}</div>
                          <div className="text-[9px] opacity-75">{sz.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Line Height Spacing */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <AlignJustify className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Line Spacing</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: "normal", label: "Normal" },
                        { id: "relaxed", label: "Relaxed" },
                        { id: "loose", label: "Loose" }
                      ].map((sp) => (
                        <button
                          key={sp.id}
                          type="button"
                          onClick={() => setLineHeight(sp.id)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            lineHeight === sp.id
                              ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                              : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300"
                          }`}
                        >
                          <span>{sp.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dyslexia-Friendly Font Toggle */}
                  <div className="bg-slate-800/60 border border-white/[0.06] p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Dyslexia Font</span>
                      </div>
                      <p className="text-[10px] text-slate-400">High letter distinction</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDyslexicFont(!dyslexicFont)}
                      className={`w-10 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                        dyslexicFont ? "bg-amber-500" : "bg-slate-700"
                      }`}
                      aria-pressed={dyslexicFont}
                    >
                      <div 
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          dyslexicFont ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* High-Contrast Mode Toggle */}
                  <div className="bg-slate-800/60 border border-white/[0.06] p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>High Contrast Mode</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Stark high-visibility mode</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setHighContrast(!highContrast)}
                      className={`w-10 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                        highContrast ? "bg-cyan-500" : "bg-slate-700"
                      }`}
                      aria-pressed={highContrast}
                    >
                      <div 
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          highContrast ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

              {/* Reset Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={resetAccessibility}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Small Divider between Accessibility and Theme Switcher */}
        <div className="h-4 w-px bg-white/[0.18] mx-0.5" aria-hidden="true" />

        {/* Quick Top Bar Theme Icon Button (Kept only in Accessibility Bar) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center justify-center p-1.5 px-2 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/[0.08] backdrop-blur-md transition-all cursor-pointer shadow-xs group"
          aria-label={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          title={theme === "light" ? "Switch to Dark Mode (Obsidian)" : "Switch to Light Mode (Linen & Sage)"}
          id="accessibility-theme-toggle-btn"
        >
          {theme === "light" ? (
            <Moon className="w-3.5 h-3.5 text-slate-800" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
          )}
        </button>
      </div>
    </div>
  </div>

      {/* =========================================================================
          MAIN CIVIC NAVBAR (OBSIDIAN FROSTED GLASS) - z-40 (LOWER THAN ACCESSIBILITY BAR z-[55])
          ========================================================================= */}
      <header className="bg-slate-950/90 backdrop-blur-xl text-white border-b border-white/[0.08] relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo & Title */}
            <Link 
              href="/" 
              className="flex flex-col group focus:outline-none"
              aria-label="YojanaSetu Home"
            >
              <span suppressHydrationWarning className="text-2xl font-black tracking-tight text-slate-50 transition-opacity group-hover:opacity-90">
                {t("nav.title") || "YojanaSetu"}
              </span>
              <span suppressHydrationWarning className="text-xs text-amber-400/90 font-medium">
                {t("nav.subtitle") || "Citizen Welfare Access Portal"}
              </span>
            </Link>

            {/* Navigation Links (Borderless with Active Saffron Fill) */}
            <nav className="hidden md:flex items-center gap-2" aria-label="Main Navigation">
              <Link
                href="/"
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  pathname === "/"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{t("nav.voiceAssistant") || "Voice Assistant"}</span>
              </Link>
              <Link
                href="/search"
                className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  pathname === "/search"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Search className={`w-4 h-4 ${pathname === "/search" ? "text-slate-950 stroke-[2.5]" : "text-amber-400"}`} />
                <span>{t("nav.searchSchemes") || "Scheme Directory"}</span>
              </Link>
              <Link
                href="/recommendations"
                className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all ${
                  pathname === "/recommendations"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Sparkles className={`w-4 h-4 ${pathname === "/recommendations" ? "text-slate-950" : "text-emerald-400"}`} />
                <span>{t("nav.recommendations") || "My Eligibility"}</span>
                {isAuthenticated && user?.demographics?.state && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="Recommendations Available"></span>
                )}
              </Link>
              <Link
                href="/about"
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  pathname === "/about"
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{t("nav.about") || "About Platform"}</span>
              </Link>
            </nav>

            {/* Right Action: Citizen Profile / Auth */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  className="group flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-800 text-white pl-2 pr-3.5 py-1.5 rounded-xl font-semibold text-xs border border-white/[0.08] transition-all shadow-sm cursor-pointer"
                  id="citizen-auth-button"
                  aria-label="View Citizen Profile"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-100 max-w-[120px] truncate leading-tight">
                      {user?.name}
                    </div>
                    <div className="text-[10px] text-amber-400 font-medium leading-none mt-0.5">
                      {user?.demographics?.occupation
                        ? `${user.demographics.occupation}${user.demographics.state ? ` • ${user.demographics.state}` : ""}`
                        : (user?.demographics?.state || "Set Demographics")}
                    </div>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                  className="group flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-100 px-4 py-2 rounded-xl font-semibold text-xs border border-white/[0.08] transition-all cursor-pointer shadow-sm"
                  id="citizen-auth-button"
                >
                  <User className="w-4 h-4 text-amber-400" />
                  <span>{t("nav.citizenLogin") || "Citizen Sign In"}</span>
                </button>
              )}
            </div>

            {/* Mobile Header Menu Trigger */}
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-900 text-slate-200 hover:text-white border border-white/[0.08] cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 border-t border-white/[0.08] px-4 py-4 space-y-3 backdrop-blur-2xl">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-base ${
                pathname === "/" ? "bg-amber-500 text-slate-950" : "text-white bg-slate-800/60"
              }`}
            >
              <Mic className="w-5 h-5 text-slate-950" />
              <span>{t("nav.voiceAssistant") || "Voice Assistant"}</span>
            </Link>
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-base ${
                pathname === "/search" ? "bg-amber-500 text-slate-950" : "text-white bg-slate-800/60"
              }`}
            >
              <Search className="w-5 h-5 text-amber-400" />
              <span>{t("nav.searchSchemes") || "Scheme Directory"}</span>
            </Link>
            <Link
              href="/recommendations"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-base ${
                pathname === "/recommendations" ? "bg-amber-500 text-slate-950" : "text-white bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>{t("nav.recommendations") || "My Eligibility"}</span>
              </div>
              {isAuthenticated && user?.demographics?.state && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  Eligible
                </span>
              )}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-base ${
                pathname === "/about" ? "bg-amber-500 text-slate-950" : "text-white bg-slate-800/60"
              }`}
            >
              <Info className="w-5 h-5 text-amber-400" />
              <span>{t("nav.about") || "About Platform"}</span>
            </Link>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setProfileModalOpen(true);
                }}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-base text-white bg-slate-800 hover:bg-slate-700 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{user?.name}</div>
                    <div className="text-xs text-amber-400 font-medium">
                      {user?.demographics?.occupation
                        ? `${user.demographics.occupation}${user.demographics.state ? ` • ${user.demographics.state}` : ""}`
                        : (user?.demographics?.state || "Set Demographics")}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-amber-400">Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLoginModalOpen(true);
                }}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-base text-white bg-slate-800 hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>{t("nav.citizenLogin") || "Citizen Sign In"}</span>
              </button>
            )}
          </div>
        )}
      </header>
      </div>

      {/* Citizen Authentication & Profile Modals */}
      <CitizenLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      <CitizenProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
}