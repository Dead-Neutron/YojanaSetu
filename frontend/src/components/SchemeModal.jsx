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

export default function SchemeModal({ scheme, onClose }) {
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
      className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-scheme-title"
    >
      <div className="bg-white rounded-lg border-2 border-slate-400 max-w-3xl w-full my-auto shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#0F172A] text-white p-6 rounded-t-md flex items-start justify-between border-b-4 border-[#D97706]">
          <div className="space-y-2 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider ${
                scheme.level === "Central" ? "bg-white text-slate-950" : "bg-[#047857] text-white"
              }`}>
                {scheme.level || "National"}
              </span>
              {scheme.state && (
                <span className="text-xs bg-slate-800 text-amber-300 px-2.5 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {scheme.state}
                </span>
              )}
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                {scheme.category}
              </span>
            </div>

            <h2 id="modal-scheme-title" className="text-2xl font-black text-white leading-tight">
              {scheme.scheme_name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            aria-label="Close Scheme Details"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          {/* Section 1: Overview */}
          {scheme.details && (
            <div>
              <h3 className="text-lg font-black text-slate-900 border-b-2 border-slate-200 pb-1 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                Scheme Overview & Objectives / योजना का विवरण
              </h3>
              <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {scheme.details}
              </p>
            </div>
          )}

          {/* Section 2: Key Benefits */}
          {scheme.benefits && (
            <div className="bg-emerald-50 border-2 border-emerald-600 rounded-lg p-5">
              <h3 className="text-lg font-black text-emerald-950 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                Benefits & Financial Assistance / मिलने वाले लाभ
              </h3>
              <p className="text-base font-medium text-emerald-950 leading-relaxed whitespace-pre-line">
                {scheme.benefits}
              </p>
            </div>
          )}

          {/* Section 3: Eligibility */}
          {scheme.eligibility && (
            <div>
              <h3 className="text-lg font-black text-slate-900 border-b-2 border-slate-200 pb-1 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Eligibility Criteria / पात्रता की शर्तें
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded p-4 text-base text-slate-800 leading-relaxed whitespace-pre-line">
                {scheme.eligibility}
              </div>
            </div>
          )}

          {/* Section 4: Required Documents */}
          {scheme.documents && (
            <div>
              <h3 className="text-lg font-black text-slate-900 border-b-2 border-slate-200 pb-1 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                Required Documents / आवश्यक दस्तावेज़
              </h3>
              <div className="bg-amber-50 border border-amber-300 rounded p-4 text-base text-amber-950 leading-relaxed whitespace-pre-line">
                {scheme.documents}
              </div>
            </div>
          )}

          {/* Section 5: Application Procedure */}
          {scheme.application && (
            <div>
              <h3 className="text-lg font-black text-slate-900 border-b-2 border-slate-200 pb-1 mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                How to Apply / आवेदन कैसे करें
              </h3>
              <div className="bg-slate-100 border border-slate-300 rounded p-4 text-base text-slate-800 leading-relaxed whitespace-pre-line font-mono text-sm">
                {scheme.application}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="bg-slate-100 px-6 py-4 rounded-b-md border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 font-medium">
            Official government scheme reference: <strong className="text-slate-900">{scheme.slug}</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert("Scheme details link copied to clipboard!");
              }}
              className="px-3 py-2 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-sm flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              Share / साझा करें
            </button>

            <button
              type="button"
              onClick={() => {
                alert(`Redirecting to the official state/central application portal for ${scheme.scheme_name}. Always verify application fee is ₹0.`);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded bg-[#047857] hover:bg-[#065F46] text-white font-black text-base flex items-center justify-center gap-2 border border-emerald-600 shadow-sm"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
