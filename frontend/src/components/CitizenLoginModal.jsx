"use client";

import { X, ShieldCheck, UserCheck, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";

export default function CitizenLoginModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const { loginWithAuth0, loginWithDemo, authConfig } = useAuth();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-950/75 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="citizen-login-title"
    >
      <div className="bg-[#1A365D] border border-[#23487A] rounded-2xl max-w-lg w-full text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#122844] p-6 border-b border-[#23487A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center border border-[#F59E0B]/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 id="citizen-login-title" className="text-xl font-black text-white tracking-tight">
                {t("auth.title") || "Citizen Verification & Login"}
              </h2>
              <span className="text-xs text-slate-300 font-medium">
                Auth0 Identity Cloud • Optional Personalization
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-[#23487A] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Universal Accessibility Callout */}
          <div className="bg-[#0B1E36] border border-[#00A3C4]/40 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#00A3C4] shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-slate-200">
              <strong className="text-white font-bold block mb-0.5">
                Authentication is 100% Optional
              </strong>
              All government welfare schemes, voice queries, filters, and documents are publicly accessible without creating an account. Sign in only if you wish to save demographic preferences and bookmark schemes.
            </div>
          </div>

          {/* Primary Action: Auth0 Universal Login */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                loginWithAuth0();
                onClose();
              }}
              className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-[#171717] font-black py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <UserCheck className="w-4 h-4" />
              <span>Continue with Auth0 Universal Login</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </button>
            <p className="text-[11px] text-center text-slate-300">
              Supports Google, Email Passwordless, or Single Sign-On via standard OpenID Connect.
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#23487A] w-full"></div>
            <span className="bg-[#1A365D] px-3 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Instant Demo Profiles
            </span>
            <div className="border-t border-[#23487A] w-full"></div>
          </div>

          {/* One-Click Demo Profiles for Rapid Testing */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Select a citizen profile to test personalized discovery:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  loginWithDemo("farmer");
                  onClose();
                }}
                className="bg-[#122844] hover:bg-[#23487A] border border-[#23487A] hover:border-[#F59E0B] p-3 rounded-xl text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-[#F59E0B]">
                  Ramesh Kumar
                </div>
                <div className="text-[10px] text-[#00A3C4] font-medium">Farmer • Bihar</div>
                <div className="text-[10px] text-slate-400 mt-1">42 yrs, Male, OBC</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginWithDemo("artisan");
                  onClose();
                }}
                className="bg-[#122844] hover:bg-[#23487A] border border-[#23487A] hover:border-[#F59E0B] p-3 rounded-xl text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-[#F59E0B]">
                  Sunita Devi
                </div>
                <div className="text-[10px] text-[#00A3C4] font-medium">Artisan • W. Bengal</div>
                <div className="text-[10px] text-slate-400 mt-1">38 yrs, Female, SC</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginWithDemo("student");
                  onClose();
                }}
                className="bg-[#122844] hover:bg-[#23487A] border border-[#23487A] hover:border-[#F59E0B] p-3 rounded-xl text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-[#F59E0B]">
                  Aarav Sharma
                </div>
                <div className="text-[10px] text-[#00A3C4] font-medium">Student • Maharashtra</div>
                <div className="text-[10px] text-slate-400 mt-1">20 yrs, Male, General</div>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer: Continue as Guest */}
        <div className="p-4 bg-[#122844] border-t border-[#23487A] flex items-center justify-between">
          <span className="text-xs text-slate-300">
            Prefer exploring anonymously?
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-200 hover:text-white bg-[#1A365D] hover:bg-[#23487A] px-4 py-2 rounded-xl border border-[#23487A] transition-colors"
          >
            Continue as Guest Citizen
          </button>
        </div>
      </div>
    </div>
  );
}
