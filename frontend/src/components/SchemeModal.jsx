"use client";

import { useEffect } from "react";
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  AlertCircle,
  HelpCircle,
  Share2
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
      className="fixed inset-0 bg-slate-950/75 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-scheme-title"
    >
      <div className="bg-[#F8F9FA] rounded-xl border border-[#E5E5E5] max-w-3xl w-full my-auto shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header in Deep Saturated Indigo */}
        <div className="bg-[#1A365D] text-white p-6 rounded-t-xl flex items-start justify-between border-b border-[#23487A]">
          <div className="space-y-2 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                scheme.level === "Central" ? "bg-white text-[#1A365D]" : "bg-[#00829D] text-white"
              }`}>
                {scheme.level === "Central" ? t("scheme.central") : t("scheme.state")}
              </span>
              {scheme.state && (
                <span className="text-xs bg-[#122844] text-[#00A3C4] px-3 py-0.5 rounded-full border border-[#23487A] flex items-center gap-1 font-medium">
                  <MapPin className="w-3 h-3 text-[#FF9F00]" />
                  <span>{scheme.state}</span>
                </span>
              )}
              <span className="text-xs bg-[#122844] text-slate-200 px-3 py-0.5 rounded-full font-medium">
                {scheme.category}
              </span>
            </div>

            <h2 id="modal-scheme-title" className="text-2xl font-black text-white leading-tight tracking-tight">
              {scheme.scheme_name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white bg-[#122844] hover:bg-[#23487A] rounded-xl transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#171717]">
          {/* Section 1: Overview */}
          {scheme.details && (
            <div>
              <h3 className="text-lg font-bold text-[#171717] border-b border-[#E5E5E5] pb-2 mb-2.5 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00A3C4]" />
                <span>{t("scheme.modalOverview")}</span>
              </h3>
              <p className="text-base text-[#404040] leading-relaxed whitespace-pre-line">
                {scheme.details}
              </p>
            </div>
          )}

          {/* Section 2: Key Benefits */}
          {scheme.benefits && (
            <div className="bg-[#E6F7FA] border border-[#00A3C4]/30 rounded-xl p-5">
              <h3 className="text-lg font-bold text-[#00829D] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00A3C4]" />
                <span>{t("scheme.modalBenefits")}</span>
              </h3>
              <p className="text-base font-medium text-[#171717] leading-relaxed whitespace-pre-line">
                {scheme.benefits}
              </p>
            </div>
          )}

          {/* Section 3: Eligibility */}
          {scheme.eligibility && (
            <div>
              <h3 className="text-lg font-bold text-[#171717] border-b border-[#E5E5E5] pb-2 mb-2.5 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#FF9F00]" />
                <span>{t("scheme.modalEligibility")}</span>
              </h3>
              <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-4 text-base text-[#171717] leading-relaxed whitespace-pre-line">
                {scheme.eligibility}
              </div>
            </div>
          )}

          {/* Section 4: Required Documents */}
          {scheme.documents && (
            <div>
              <h3 className="text-lg font-bold text-[#171717] border-b border-[#E5E5E5] pb-2 mb-2.5 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00A3C4]" />
                <span>{t("scheme.modalDocuments")}</span>
              </h3>
              <div className="bg-[#FFF6E6] border border-[#FF9F00]/30 rounded-xl p-4 text-base text-[#171717] leading-relaxed whitespace-pre-line">
                {scheme.documents}
              </div>
            </div>
          )}

          {/* Section 5: Application Procedure */}
          {scheme.application && (
            <div>
              <h3 className="text-lg font-bold text-[#171717] border-b border-[#E5E5E5] pb-2 mb-2.5 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#00A3C4]" />
                <span>{t("scheme.modalApplication")}</span>
              </h3>
              <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-4 text-sm text-[#404040] leading-relaxed whitespace-pre-line font-mono">
                {scheme.application}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="bg-[#FFFFFF] px-6 py-4 rounded-b-xl border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#525252] font-medium">
            {t("scheme.officialRef")} <strong className="text-[#171717]">{scheme.slug}</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert("Scheme details link copied to clipboard!");
              }}
              className="px-4 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F8F9FA] border border-[#E5E5E5] text-[#171717] font-bold text-sm flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Share2 className="w-4 h-4 text-[#00A3C4]" />
              <span>{t("scheme.share")}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                alert(`Redirecting to the official application portal for ${scheme.scheme_name}.`);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FF9F00] hover:bg-[#E68F00] text-[#171717] font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>{t("scheme.applyOnline")}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
