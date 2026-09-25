"use client";

import { useState } from "react";
import { X, ShieldCheck, UserCheck, ArrowRight, CheckCircle2, AlertCircle, Key } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";

export default function CitizenLoginModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const { loginWithAuth0, authConfig } = useAuth();
  const [configMissing, setConfigMissing] = useState(false);

  if (!isOpen) return null;

  const handleAuth0Click = () => {
    setConfigMissing(false);
    const initiated = loginWithAuth0();
    if (initiated) {
      onClose();
    } else {
      setConfigMissing(true);
    }
  };

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
              <strong className="text-white font-bold block mb-0.5 text-sm">
                Authentication is 100% Optional
              </strong>
              All government welfare schemes, multilingual voice queries, attribute filters, and official scheme documentation are completely accessible without creating an account. Sign in only if you wish to link your verified Auth0 citizen profile.
            </div>
          </div>

          {/* Configuration Missing Helper Notice */}
          {configMissing && (
            <div className="bg-amber-950/40 border border-[#F59E0B]/40 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-200">
              <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-white block font-bold">
                  Auth0 Credentials Not Configured
                </strong>
                <p>
                  To authenticate with Auth0, add your Auth0 Domain and Client ID to{" "}
                  <code className="bg-black/40 px-1.5 py-0.5 rounded text-[#F59E0B]">frontend/.env.local</code>:
                </p>
                <pre className="bg-black/50 p-2 rounded text-[11px] font-mono text-slate-300 overflow-x-auto mt-1">
                  NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.us.auth0.com{"\n"}
                  NEXT_PUBLIC_AUTH0_CLIENT_ID=your_client_id
                </pre>
                <p className="pt-1">
                  Or simply continue below as a guest citizen with 100% full access to all features!
                </p>
              </div>
            </div>
          )}

          {/* Primary Action: Auth0 Universal Login */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleAuth0Click}
              className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-[#171717] font-black py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Continue with Auth0 Universal Login</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </button>
            <p className="text-[11px] text-center text-slate-300">
              Redirects securely to Auth0 for Google, Email, or Passwordless authentication.
            </p>
          </div>

          {/* Privacy & Trust Badge */}
          <div className="border border-[#23487A] bg-[#122844] rounded-xl p-3 flex items-center gap-2 text-xs text-slate-300">
            <Key className="w-4 h-4 text-[#00A3C4] shrink-0" />
            <span>OpenID Connect standard with PKCE. Tokens are validated securely on the backend.</span>
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
