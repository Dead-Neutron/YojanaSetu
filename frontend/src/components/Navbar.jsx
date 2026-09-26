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
  Sparkles
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
      {/* Tricolor National Accent Strip */}
      <div className="w-full h-1 flex" aria-hidden="true">
        <div className="w-1/3 bg-[#D97706]"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#059669]"></div>
      </div>

      {/* Top Utility & Accessibility Bar */}
      <div className="bg-[#122844] text-slate-200 text-xs py-2 px-4 border-b border-[#23487A]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00A3C4] animate-pulse"></span>
            <span suppressHydrationWarning className="font-medium text-slate-200">
              {t("nav.portalNotice")}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <span suppressHydrationWarning className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{t("nav.helpline")}: <strong className="text-white font-semibold">1800-11-2001</strong> ({t("nav.tollFree")})</span>
            </span>

            {/* Language Switcher Segmented Pills */}
            <div className="flex items-center bg-[#1A365D] p-0.5 rounded-full border border-[#23487A]">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`group px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    language === lang.code
                      ? "bg-[#F59E0B] text-[#171717] shadow-sm"
                      : "text-slate-200 hover:text-white"
                  }`}
                  aria-label={`Change language to ${lang.name}`}
                >
                  <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                    {lang.nativeName}
                  </span>
                </button>
              ))}
            </div>

            {/* Accessibility Dropdown Menu Trigger */}
            <div className="relative" ref={accessibilityMenuRef}>
              <button
                type="button"
                onClick={() => setAccessibilityDropdownOpen(!accessibilityDropdownOpen)}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1A365D] hover:bg-[#23487A] text-slate-200 hover:text-white border border-[#23487A] transition-all shadow-xs"
                aria-expanded={accessibilityDropdownOpen}
                aria-label="Toggle accessibility options dropdown"
                id="accessibility-dropdown-trigger"
              >
                <Accessibility className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="hidden sm:inline">
                  <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                    Accessibility
                  </span>
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform ${accessibilityDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Accessibility Dropdown Popover */}
              {accessibilityDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-76 sm:w-80 bg-[#1A365D] text-white border border-[#23487A] rounded-xl shadow-2xl p-4 sm:p-5 z-50 space-y-4"
                  role="region"
                  aria-label="Accessibility Settings"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#23487A]">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#F59E0B]/20 text-[#F59E0B] rounded-lg">
                        <Accessibility className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Accessibility Menu</h3>
                        <p className="text-[10px] text-slate-300">WCAG 2.2 AAA Controls</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAccessibilityDropdownOpen(false)}
                      className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-[#23487A]"
                      aria-label="Close accessibility menu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Text Size Scaling */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-200 flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>Text Size</span>
                      </label>
                      <span className="text-[10px] font-bold text-[#F59E0B] bg-[#122844] px-2 py-0.5 rounded-full border border-[#23487A]">
                        {fontSize === "normal" ? "100%" : fontSize === "large" ? "125%" : fontSize === "xlarge" ? "150%" : "200%"}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: "normal", label: "A", sub: "100%" },
                        { id: "large", label: "A+", sub: "125%" },
                        { id: "xlarge", label: "A++", sub: "150%" },
                        { id: "max", label: "A+++", sub: "200%" },
                      ].map((tier) => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setFontSize(tier.id)}
                          className={`group p-2 rounded-lg border text-center transition-all ${
                            fontSize === tier.id
                              ? "bg-[#F59E0B] text-[#171717] font-bold border-[#FFD080] shadow-sm"
                              : "bg-[#122844] text-slate-200 border-[#23487A] hover:bg-[#23487A]"
                          }`}
                        >
                          <div className="text-xs font-bold">
                            <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                              {tier.label}
                            </span>
                          </div>
                          <div className="text-[9px] opacity-80">{tier.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Line Spacing */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <AlignJustify className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Line Spacing</span>
                    </label>

                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: "normal", label: "Standard" },
                        { id: "relaxed", label: "Relaxed" },
                        { id: "loose", label: "Expanded" },
                      ].map((sp) => (
                        <button
                          key={sp.id}
                          type="button"
                          onClick={() => setLineHeight(sp.id)}
                          className={`group py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all ${
                            lineHeight === sp.id
                              ? "bg-[#F59E0B] text-[#171717] font-bold border-[#FFD080]"
                              : "bg-[#122844] text-slate-200 border-[#23487A] hover:bg-[#23487A]"
                          }`}
                        >
                          <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                            {sp.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dyslexia-Friendly Font Toggle */}
                  <div className="bg-[#122844] border border-[#23487A] p-2.5 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>Dyslexia Font</span>
                      </div>
                      <p className="text-[10px] text-slate-300">Higher letter distinction</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDyslexicFont(!dyslexicFont)}
                      className={`w-10 h-6 rounded-full transition-colors relative p-0.5 focus:outline-none ${
                        dyslexicFont ? "bg-[#00A3C4]" : "bg-slate-700"
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

                  {/* True High-Contrast Mode Toggle */}
                  <div className="bg-[#122844] border border-[#23487A] p-2.5 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>High Contrast</span>
                      </div>
                      <p className="text-[10px] text-slate-300">Stark black & white</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setHighContrast(!highContrast)}
                      className={`w-10 h-6 rounded-full transition-colors relative p-0.5 focus:outline-none ${
                        highContrast ? "bg-[#F59E0B]" : "bg-slate-700"
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
                  <div className="pt-2 border-t border-[#23487A]">
                    <button
                      type="button"
                      onClick={resetAccessibility}
                      className="group w-full bg-[#122844] hover:bg-[#23487A] text-slate-200 hover:text-white py-1.5 rounded-lg text-xs font-semibold border border-[#23487A] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                        Reset to System Defaults
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar with Subtle Frosted Glassmorphism */}
      <header className="glass-nav text-white border-b border-[#23487A] sticky top-0 z-40 civic-shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Clean Brand Text Header (Logo Removed) */}
            <Link 
              href="/" 
              className="flex flex-col group focus:outline-none"
              aria-label="YojanaSetu Home"
            >
              <span suppressHydrationWarning className="text-2xl font-black tracking-tight text-white transition-opacity group-hover:opacity-90">
                {t("nav.title")}
              </span>
              <span suppressHydrationWarning className="text-xs text-slate-300 font-medium">
                {t("nav.subtitle")}
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-2" aria-label="Main Navigation">
              <Link
                href="/"
                className={`group px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  pathname === "/"
                    ? "bg-[#F59E0B] text-[#171717] shadow-sm"
                    : "text-slate-200 hover:bg-[#23487A] hover:text-white"
                }`}
              >
                <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                  {t("nav.voiceAssistant")}
                </span>
              </Link>
              <Link
                href="/search"
                className={`group px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  pathname === "/search"
                    ? "bg-[#F59E0B] text-[#171717] shadow-sm"
                    : "text-slate-200 hover:bg-[#23487A] hover:text-white"
                }`}
              >
                <Search className={`w-4 h-4 ${pathname === "/search" ? "text-[#171717]" : "text-[#00A3C4]"}`} />
                <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                  {t("nav.searchSchemes")}
                </span>
              </Link>
              <Link
                href="/recommendations"
                className={`group px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all ${
                  pathname === "/recommendations"
                    ? "bg-[#F59E0B] text-[#171717] shadow-sm"
                    : "text-slate-200 hover:bg-[#23487A] hover:text-white"
                }`}
              >
                <Sparkles className={`w-4 h-4 ${pathname === "/recommendations" ? "text-[#171717]" : "text-[#F59E0B]"}`} />
                <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                  {t("nav.recommendations")}
                </span>
                {isAuthenticated && user?.demographics?.state && (
                  <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse ml-0.5" title="Personalized Recommendations Available"></span>
                )}
              </Link>
              <a
                href="#about"
                className="group px-4 py-2 rounded-xl font-semibold text-sm text-slate-200 hover:bg-[#23487A] hover:text-white transition-all"
              >
                <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                  {t("nav.about")}
                </span>
              </a>
            </nav>

            {/* Right Action: Citizen Profile / Auth0 */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  className="group flex items-center gap-2.5 bg-[#122844] hover:bg-[#23487A] text-white pl-2 pr-3.5 py-1.5 rounded-xl font-semibold text-xs border border-[#23487A] transition-all hover:border-[#F59E0B] shadow-sm"
                  id="citizen-auth-button"
                  aria-label="View Citizen Profile"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#F59E0B] text-[#171717] font-black text-xs flex items-center justify-center shadow-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white max-w-[120px] truncate leading-tight">
                      {user?.name}
                    </div>
                    <div className="text-[10px] text-[#00A3C4] font-medium leading-none mt-0.5">
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
                  className="group flex items-center gap-2 bg-[#122844] hover:bg-[#23487A] text-white px-4 py-2 rounded-xl font-semibold text-xs border border-[#23487A] transition-all hover:border-[#00A3C4] shadow-sm"
                  id="citizen-auth-button"
                >
                  <User className="w-4 h-4 text-[#F59E0B]" />
                  <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                    {t("nav.citizenLogin")}
                  </span>
                </button>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-[#122844] text-slate-200 hover:text-white border border-[#23487A]"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#122844] border-t border-[#23487A] px-4 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`group flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-base ${
                pathname === "/" ? "bg-[#F59E0B] text-[#171717]" : "text-white bg-[#1A365D]"
              }`}
            >
              <Mic className="w-5 h-5 text-[#F59E0B]" />
              <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                {t("nav.voiceAssistant")}
              </span>
            </Link>
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className={`group flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-base ${
                pathname === "/search" ? "bg-[#F59E0B] text-[#171717]" : "text-white bg-[#1A365D]"
              }`}
            >
              <Search className="w-5 h-5 text-[#00A3C4]" />
              <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                {t("nav.searchSchemes")}
              </span>
            </Link>
            <Link
              href="/recommendations"
              onClick={() => setMobileMenuOpen(false)}
              className={`group flex items-center justify-between px-4 py-3 rounded-xl font-bold text-base ${
                pathname === "/recommendations" ? "bg-[#F59E0B] text-[#171717]" : "text-white bg-[#1A365D]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F59E0B]" />
                <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                  {t("nav.recommendations")}
                </span>
              </div>
              {isAuthenticated && user?.demographics?.state && (
                <span className="text-[10px] bg-[#059669] text-white px-2 py-0.5 rounded-full font-bold">
                  Eligible
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setProfileModalOpen(true);
                }}
                className="group w-full text-left px-4 py-3 rounded-xl font-bold text-base text-white bg-[#1A365D] hover:bg-[#23487A] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#F59E0B] text-[#171717] font-bold text-xs flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{user?.name}</div>
                    <div className="text-xs text-[#00A3C4] font-medium">
                      {user?.demographics?.occupation
                        ? `${user.demographics.occupation}${user.demographics.state ? ` • ${user.demographics.state}` : ""}`
                        : (user?.demographics?.state || "Set Demographics")}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#F59E0B]">Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLoginModalOpen(true);
                }}
                className="group w-full text-left px-4 py-3 rounded-xl font-bold text-base text-white bg-[#1A365D] hover:bg-[#23487A] flex items-center gap-2"
              >
                <User className="w-4 h-4 text-[#F59E0B]" />
                <span className="inline-block transition-transform duration-200 group-hover:scale-105">
                  {t("nav.citizenLogin")}
                </span>
              </button>
            )}
          </div>
        )}
      </header>

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