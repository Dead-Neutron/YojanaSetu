"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  AlertCircle,
  HelpCircle,
  Share2,
  Award
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function SchemeModal({ scheme, onClose }) {
  const { t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!scheme) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-950/80 z-[90] flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-scheme-title"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-900/95 rounded-2xl border border-white/[0.12] max-w-3xl w-full my-auto shadow-[0_24px_60px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-slate-800/80 text-white p-6 rounded-t-2xl flex items-start justify-between border-b border-white/[0.08] backdrop-blur-xl">
          <div className="space-y-2.5 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-3 py-0.5 rounded-full bg-slate-700/80 text-slate-200">
                {scheme.level === "Central" ? (t("scheme.central") || "Central Level") : (t("scheme.state") || "State Level")}
              </span>
              {scheme.state && scheme.state !== "All India" && (
                <span className="text-xs bg-slate-800 text-amber-400 px-3 py-0.5 rounded-full border border-white/[0.08] flex items-center gap-1 font-medium">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{scheme.state}</span>
                </span>
              )}
              <span className="text-xs bg-emerald-500/15 text-emerald-400 px-3 py-0.5 rounded-full font-medium">
                {scheme.category}
              </span>
            </div>

            <h2 id="modal-scheme-title" className="text-xl sm:text-2xl font-extrabold text-slate-50 leading-tight tracking-tight">
              {scheme.scheme_name}
            </h2>
          </div>

          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-200">
          {/* Section 1: Overview */}
          {scheme.details && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 pb-2 mb-2 flex items-center gap-2 border-b border-white/[0.08]">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>{t("scheme.modalOverview") || "Program Overview"}</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                {scheme.details}
              </p>
            </div>
          )}

          {/* Section 2: Key Benefits */}
          {scheme.benefits && (
            <div className="bg-slate-800/60 border border-white/[0.08] rounded-xl p-5 backdrop-blur-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{t("scheme.modalBenefits") || "Financial & Welfare Benefits"}</span>
              </h3>
              <p className="text-sm sm:text-base font-normal text-slate-200 leading-relaxed whitespace-pre-line">
                {scheme.benefits}
              </p>
            </div>
          )}

          {/* Section 3: Eligibility */}
          {scheme.eligibility && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 pb-2 mb-2 flex items-center gap-2 border-b border-white/[0.08]">
                <AlertCircle className="w-4 h-4 text-emerald-400" />
                <span>{t("scheme.modalEligibility") || "Eligibility Criteria"}</span>
              </h3>
              <div className="bg-slate-800/40 border border-white/[0.06] rounded-xl p-4 text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
                {scheme.eligibility}
              </div>
            </div>
          )}

          {/* Section 4: Required Documents */}
          {scheme.documents && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 pb-2 mb-2 flex items-center gap-2 border-b border-white/[0.08]">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>{t("scheme.modalDocuments") || "Required Documentation"}</span>
              </h3>
              <div className="bg-slate-800/40 border border-white/[0.06] rounded-xl p-4 text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
                {scheme.documents}
              </div>
            </div>
          )}

          {/* Section 5: Application Procedure */}
          {scheme.application && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 pb-2 mb-2 flex items-center gap-2 border-b border-white/[0.08]">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>{t("scheme.modalApplication") || "How to Apply"}</span>
              </h3>
              <div className="bg-slate-800/40 border border-white/[0.06] rounded-xl p-4 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {scheme.application}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer (Borderless Buttons) */}
        <div className="bg-slate-850 px-6 py-4 rounded-b-2xl border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-xl">
          <div className="text-xs text-slate-400 font-medium">
            Official Reference: <strong className="text-slate-200">{scheme.slug || `REF-${scheme.id || "IN"}`}</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <motion.button
              type="button"
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert("Scheme details link copied to clipboard!");
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{t("scheme.share") || "Share"}</span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => {
                alert(`Redirecting to the official application portal for ${scheme.scheme_name}.`);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span>{t("scheme.applyOnline") || "Apply on Official Portal"}</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
