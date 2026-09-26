"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, UserCheck, ArrowRight, CheckCircle2, AlertCircle, Key, Lock } from "lucide-react";
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
      className="fixed inset-0 bg-slate-950/80 z-[90] flex items-center justify-center p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="citizen-login-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-900/95 border border-white/[0.12] rounded-3xl max-w-lg w-full text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col max-h-[90vh] backdrop-blur-2xl"
      >
        {/* Modal Header */}
        <div className="bg-slate-850 p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 id="citizen-login-title" className="text-xl font-extrabold text-slate-50 tracking-tight">
                {t("auth.title") || "Citizen Verification & Login"}
              </h2>
              <span className="text-xs text-amber-400/90 font-medium">
                Auth0 Identity Cloud • Optional Personalization
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
          {/* Universal Accessibility Callout */}
          <div className="bg-slate-800/50 border border-white/[0.06] rounded-2xl p-4.5 flex items-start gap-3.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-slate-300">
              <strong className="text-slate-50 font-bold block mb-1 text-sm">
                Authentication is 100% Optional
              </strong>
              All government welfare schemes, regional voice queries, attribute filters, and official scheme documentation are completely accessible without creating an account. Sign in only if you wish to persist your verified citizen demographic profile.
            </div>
          </div>

          {/* Configuration Missing Helper Notice */}
          {configMissing && (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-slate-50 block font-bold">
                  Auth0 Credentials Not Configured
                </strong>
                <p>
                  To authenticate with Auth0, add your Auth0 Domain and Client ID to{" "}
                  <code className="bg-black/50 px-1.5 py-0.5 rounded text-amber-400">frontend/.env.local</code>:
                </p>
                <pre className="bg-black/60 p-2.5 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto mt-1 border border-white/[0.05]">
                  NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.us.auth0.com{"\n"}
                  NEXT_PUBLIC_AUTH0_CLIENT_ID=your_client_id
                </pre>
                <p className="pt-1 text-slate-300">
                  Or simply continue below as a guest citizen with complete access to all welfare schemes!
                </p>
              </div>
            </div>
          )}

          {/* Primary Action: Solid Warm Saffron CTA (No Gradients) */}
          <div className="space-y-3">
            <motion.button
              type="button"
              onClick={handleAuth0Click}
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 px-5 rounded-xl text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <UserCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Continue with Auth0 Universal Login</span>
              <ArrowRight className="w-4 h-4 ml-auto stroke-[2.5]" />
            </motion.button>
            <p className="text-[11px] text-center text-slate-400">
              Redirects securely to Auth0 for Google, Email, or Passwordless authentication.
            </p>
          </div>

          {/* Privacy & Trust Badge */}
          <div className="border border-white/[0.06] bg-slate-850/60 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-slate-300">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>OpenID Connect standard with PKCE. Tokens are validated securely on the backend.</span>
          </div>
        </div>

        {/* Modal Footer: Continue as Guest */}
        <div className="p-5 bg-slate-850 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Prefer exploring anonymously?
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl border border-white/[0.08] transition-colors cursor-pointer"
          >
            Continue as Guest Citizen
          </button>
        </div>
      </motion.div>
    </div>
  );
}
