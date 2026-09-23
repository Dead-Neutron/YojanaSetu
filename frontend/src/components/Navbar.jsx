"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import { 
  Handshake, 
  Search, 
  Menu, 
  X, 
  User, 
  ShieldCheck,
  Phone,
  Mic
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <>
      {/* Tricolor National Accent Strip */}
      <div className="w-full h-1 flex" aria-hidden="true">
        <div className="w-1/3 bg-[#D97706]"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#059669]"></div>
      </div>

      {/* Top Accessibility Bar */}
      <div className="bg-[#122844] text-slate-200 text-xs py-2 px-4 border-b border-[#23487A]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00A3C4] animate-pulse"></span>
            <span className="font-medium text-slate-200">
              {t("nav.portalNotice")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-[#FF9F00]" />
              <span>{t("nav.helpline")}: <strong className="text-white font-semibold">1800-11-2001</strong> ({t("nav.tollFree")})</span>
            </span>

            {/* Language Switcher Segmented Pills */}
            <div className="flex items-center bg-[#1A365D] p-0.5 rounded-full border border-[#23487A]">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    language === lang.code
                      ? "bg-[#FF9F00] text-[#171717] shadow-sm"
                      : "text-slate-200 hover:text-white"
                  }`}
                  aria-label={`Change language to ${lang.name}`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar with Subtle Frosted Glassmorphism */}
      <header className="glass-nav text-white border-b border-[#23487A] sticky top-0 z-40 civic-shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo: Two hands holding each other */}
            <Link 
              href="/" 
              className="flex items-center gap-3.5 group focus:outline-none"
              aria-label="YojanaSetu Home"
            >
              <div className="w-11 h-11 bg-[#FF9F00] text-[#171717] rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
                <Handshake className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white">
                  {t("nav.title")}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {t("nav.subtitle")}
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-2" aria-label="Main Navigation">
              <Link
                href="/"
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  pathname === "/"
                    ? "bg-[#FF9F00] text-[#171717] shadow-sm"
                    : "text-slate-200 hover:bg-[#23487A] hover:text-white"
                }`}
              >
                {t("nav.voiceAssistant")}
              </Link>
              <Link
                href="/search"
                className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  pathname === "/search"
                    ? "bg-[#FF9F00] text-[#171717] shadow-sm"
                    : "text-slate-200 hover:bg-[#23487A] hover:text-white"
                }`}
              >
                <Search className={`w-4 h-4 ${pathname === "/search" ? "text-[#171717]" : "text-[#00A3C4]"}`} />
                <span>{t("nav.searchSchemes")}</span>
              </Link>
              <a
                href="#about"
                className="px-4 py-2 rounded-xl font-semibold text-sm text-slate-200 hover:bg-[#23487A] hover:text-white transition-all"
              >
                {t("nav.about")}
              </a>
            </nav>

            {/* Right Action: Citizen Profile */}
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 bg-[#122844] hover:bg-[#23487A] text-white px-4 py-2 rounded-xl font-semibold text-xs border border-[#23487A] transition-all hover:border-[#00A3C4] shadow-sm"
                id="citizen-auth-button"
              >
                <User className="w-4 h-4 text-[#FF9F00]" />
                <span>{t("nav.citizenLogin")}</span>
              </button>
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
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-base ${
                pathname === "/" ? "bg-[#FF9F00] text-[#171717]" : "text-white bg-[#1A365D]"
              }`}
            >
              <Mic className="w-5 h-5 text-[#FF9F00]" />
              <span>{t("nav.voiceAssistant")}</span>
            </Link>
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-base ${
                pathname === "/search" ? "bg-[#FF9F00] text-[#171717]" : "text-white bg-[#1A365D]"
              }`}
            >
              <Search className="w-5 h-5 text-[#00A3C4]" />
              <span>{t("nav.searchSchemes")}</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setAuthModalOpen(true);
              }}
              className="w-full text-left px-4 py-3 rounded-xl font-bold text-base text-white bg-[#1A365D] hover:bg-[#23487A] flex items-center gap-2"
            >
              <User className="w-4 h-4 text-[#FF9F00]" />
              <span>{t("nav.citizenLogin")}</span>
            </button>
          </div>
        )}
      </header>

      {/* Citizen Login Modal */}
      {authModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#1A365D] border border-[#23487A] rounded-xl max-w-md w-full p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#23487A]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FF9F00]/20 text-[#FF9F00] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{t("auth.title")}</h3>
              </div>
              <button 
                onClick={() => setAuthModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-[#23487A]"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-4">
              <p className="text-slate-200 text-sm leading-relaxed">
                {t("auth.desc")}
              </p>
              <div className="bg-[#122844] p-4 rounded-xl border border-[#23487A] space-y-2">
                <div className="text-[11px] text-[#00A3C4] font-bold uppercase tracking-wider">
                  {t("auth.configuredIdp")}
                </div>
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <span>{t("auth.universalLogin")}</span>
                  <span className="bg-[#00829D]/30 text-[#00A3C4] text-xs px-2.5 py-0.5 rounded-full font-bold border border-[#00A3C4]">
                    {t("auth.enabled")}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  alert("Auth0 Universal Login redirect activated. Connected to secure profile pre-filtering.");
                  setAuthModalOpen(false);
                }}
                className="w-full bg-[#FF9F00] hover:bg-[#E68F00] text-[#171717] font-bold py-3 rounded-xl text-sm transition-all shadow-sm"
              >
                {t("auth.proceed")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
