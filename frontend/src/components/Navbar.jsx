"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Volume2, 
  Search, 
  Menu, 
  X, 
  Globe, 
  User, 
  ShieldCheck,
  Building2,
  FileText
} from "lucide-react";

export const LANGUAGES = [
  { code: "hi", label: "हिन्दी (Hindi)", native: "हिन्दी" },
  { code: "en", label: "English", native: "English" },
  { code: "bn", label: "বাংলা (Bengali)", native: "বাংলা" },
  { code: "te", label: "తెలుగు (Telugu)", native: "తెలుగు" },
  { code: "mr", label: "मराठी (Marathi)", native: "मराठी" },
  { code: "ta", label: "தமிழ் (Tamil)", native: "தமிழ்" },
  { code: "gu", label: "ગુજરાતી (Gujarati)", native: "ગુજરાતી" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)", native: "ಕನ್ನಡ" },
];

export default function Navbar({ currentLang = "hi", onLangChange }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(currentLang);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleSelectLang = (code) => {
    setSelectedLang(code);
    setLangDropdownOpen(false);
    if (onLangChange) onLangChange(code);
  };

  return (
    <>
      {/* Tricolor National Civic Accent Strip */}
      <div className="w-full h-1.5 flex" aria-hidden="true">
        <div className="w-1/3 bg-[#D97706]"></div>
        <div className="w-1/3 bg-white border-y border-slate-200"></div>
        <div className="w-1/3 bg-[#047857]"></div>
      </div>

      {/* Top Accessibility Bar */}
      <div className="bg-[#0B1120] text-slate-200 text-xs px-4 py-1.5 border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#059669]"></span>
            <span className="font-medium text-slate-300">
              भारत सरकार का नागरिक सेतु | Government of India Citizen Platform
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-slate-400">
              National Schemes Helpline: <strong className="text-white">1800-11-2001</strong> (Toll Free)
            </span>
            <div className="relative">
              <button
                type="button"
                id="language-selector-button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#334155] text-amber-300 px-2.5 py-0.5 rounded border border-slate-700 font-semibold"
                aria-label="Select Regional Language"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{LANGUAGES.find(l => l.code === selectedLang)?.native || "भाषा / Language"}</span>
              </button>

              {langDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1 w-48 bg-[#0F172A] border-2 border-amber-600 rounded shadow-xl z-50 py-1"
                  role="menu"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLang(lang.code)}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#1E293B] flex items-center justify-between ${
                        selectedLang === lang.code ? "text-amber-400 font-bold bg-[#1E293B]" : "text-slate-200"
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-slate-400 text-[10px]">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="bg-[#0F172A] text-white border-b-2 border-[#1E293B] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Brand */}
            <Link 
              href="/" 
              className="flex items-center gap-3.5 group focus:outline-none"
              aria-label="YojanaSetu Home"
            >
              <div className="w-12 h-12 bg-[#D97706] rounded flex items-center justify-center font-black text-2xl text-slate-950 border-2 border-amber-400 shadow-sm">
                YS
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  YojanaSetu
                  <span className="text-xs bg-[#047857] text-white font-bold px-2 py-0.5 rounded border border-emerald-500">
                    योजना सेतु
                  </span>
                </span>
                <span className="text-xs text-slate-300 font-medium tracking-wide">
                  AI Multilingual Citizen Welfare Access
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
              <Link
                href="/"
                className={`px-4 py-2 rounded font-bold text-base transition-colors ${
                  pathname === "/"
                    ? "bg-[#D97706] text-slate-950"
                    : "text-slate-200 hover:bg-[#1E293B] hover:text-white"
                }`}
              >
                Voice Assistant / आवाज़ से खोजें
              </Link>
              <Link
                href="/search"
                className={`px-4 py-2 rounded font-bold text-base flex items-center gap-2 transition-colors ${
                  pathname === "/search"
                    ? "bg-[#D97706] text-slate-950"
                    : "text-slate-200 hover:bg-[#1E293B] hover:text-white"
                }`}
              >
                <Search className="w-4 h-4" />
                Scheme Search / योजना खोजें
              </Link>
              <a
                href="#about"
                className="px-4 py-2 rounded font-semibold text-base text-slate-200 hover:bg-[#1E293B] hover:text-white"
              >
                About Platform
              </a>
            </nav>

            {/* Desktop Auth / Citizen Profile Action */}
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 bg-[#047857] hover:bg-[#059669] text-white px-4 py-2 rounded font-bold text-sm border border-emerald-500 transition-colors"
                id="citizen-auth-button"
              >
                <User className="w-4 h-4" />
                <span>Citizen Login / नागरिक लॉगिन</span>
              </button>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded bg-[#1E293B] text-slate-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0F172A] border-t-2 border-[#1E293B] px-4 pt-3 pb-6 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded font-bold text-lg ${
                pathname === "/" ? "bg-[#D97706] text-slate-950" : "text-white bg-[#1E293B]"
              }`}
            >
              🎤 Voice Assistant / आवाज़ से खोजें
            </Link>
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded font-bold text-lg ${
                pathname === "/search" ? "bg-[#D97706] text-slate-950" : "text-white bg-[#1E293B]"
              }`}
            >
              🔍 Scheme Search / योजना खोजें
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setAuthModalOpen(true);
              }}
              className="w-full text-left px-4 py-3 rounded font-bold text-lg text-white bg-[#047857] flex items-center gap-2"
            >
              <User className="w-5 h-5" />
              Citizen Login / प्रोफाइल लॉगिन
            </button>
          </div>
        )}
      </header>

      {/* Citizen Login Modal (Auth0 Flow Indicator) */}
      {authModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#0F172A] border-2 border-amber-600 rounded-lg max-w-md w-full p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-bold text-white">Citizen Identity / Auth0</h3>
              </div>
              <button 
                onClick={() => setAuthModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close Modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="py-4 space-y-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                Log in securely using your citizen profile or mobile number to pre-fill eligibility criteria (state, age, category) and save your favorite welfare schemes.
              </p>
              <div className="bg-[#1E293B] p-4 rounded border border-slate-700 space-y-3">
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Configured Identity Provider
                </div>
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <span>Auth0 Universal Login</span>
                  <span className="bg-[#047857] text-white text-xs px-2 py-0.5 rounded font-bold">Enabled</span>
                </div>
                <div className="text-xs text-slate-400">
                  Audience: <code className="text-amber-300">https://yojanasetu-api.local</code>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  alert("Auth0 Universal Login redirect will activate once backend AUTH0_CLIENT_ID credentials are populated in .env. Mock profile logged in.");
                  setAuthModalOpen(false);
                }}
                className="w-full bg-[#D97706] hover:bg-[#B45309] text-slate-950 font-black py-3 rounded text-base text-center transition-colors"
              >
                Proceed to Secure Login / आगे बढ़ें
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
