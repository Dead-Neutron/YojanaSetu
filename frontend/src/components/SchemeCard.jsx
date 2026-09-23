import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function SchemeCard({ scheme, onSelect }) {
  const { t } = useLanguage();
  if (!scheme) return null;

  return (
    <div className="bg-[#F8F9FA] rounded-xl border border-[#E5E5E5] hover:border-[#00A3C4] transition-all duration-200 civic-shadow-sm hover:civic-shadow-md flex flex-col justify-between p-6">
      <div>
        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5">
          <span 
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              scheme.level === "Central"
                ? "bg-[#1A365D] text-white"
                : "bg-[#00829D] text-white"
            }`}
          >
            {scheme.level === "Central" ? t("scheme.central") : (scheme.level === "State" ? t("scheme.state") : t("scheme.national"))}
          </span>

          {scheme.state && scheme.state !== "All India" && (
            <span className="text-xs font-semibold text-[#171717] bg-[#FFFFFF] px-3 py-1 rounded-full border border-[#E5E5E5] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#00A3C4]" />
              <span>{scheme.state}</span>
            </span>
          )}

          <span className="text-xs font-semibold text-[#1A365D] bg-[#E6F7FA] px-3 py-1 rounded-full border border-[#00A3C4]/30">
            {scheme.category}
          </span>
        </div>

        {/* Scheme Title */}
        <h3 className="text-xl font-bold text-[#171717] leading-snug line-clamp-2 mb-3 tracking-tight">
          {scheme.scheme_name}
        </h3>

        {/* Key Benefits Highlight Box */}
        {scheme.benefits && (
          <div className="bg-[#E6F7FA] border-l-4 border-[#00A3C4] p-3.5 rounded-r-lg mb-4">
            <div className="text-xs font-bold text-[#00829D] uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00A3C4]" />
              <span>{t("scheme.benefitsTitle")}</span>
            </div>
            <p className="text-sm font-medium text-[#171717] line-clamp-3 leading-relaxed">
              {scheme.benefits}
            </p>
          </div>
        )}

        {/* Eligibility Snippet */}
        {scheme.eligibility && (
          <div className="mb-4">
            <div className="text-xs font-bold text-[#525252] uppercase tracking-wide mb-1">
              {t("scheme.eligibilityTitle")}
            </div>
            <p className="text-sm text-[#404040] line-clamp-2 leading-relaxed">
              {scheme.eligibility}
            </p>
          </div>
        )}

        {/* Demographics Target Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4 text-xs font-medium text-[#525252]">
          {scheme.gender && scheme.gender !== "All" && (
            <span className="bg-[#FFFFFF] text-[#171717] px-2.5 py-0.5 rounded-lg border border-[#E5E5E5]">
              {t("scheme.target")} {scheme.gender}
            </span>
          )}
          {scheme.occupation && scheme.occupation !== "All Citizens" && (
            <span className="bg-[#FFFFFF] text-[#171717] px-2.5 py-0.5 rounded-lg border border-[#E5E5E5]">
              {scheme.occupation}
            </span>
          )}
          {scheme.caste && scheme.caste !== "All" && (
            <span className="bg-[#FFFFFF] text-[#171717] px-2.5 py-0.5 rounded-lg border border-[#E5E5E5]">
              {t("scheme.category")} {scheme.caste}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between mt-2">
        <span className="text-xs text-[#525252] font-medium">
          {t("scheme.verified")}
        </span>
        <button
          type="button"
          onClick={() => onSelect(scheme)}
          className="inline-flex items-center gap-2 bg-[#FF9F00] hover:bg-[#E68F00] text-[#171717] font-bold px-4 py-2 rounded-xl text-sm transition-all civic-shadow-sm hover:civic-shadow-md"
          aria-label={`View details for ${scheme.scheme_name}`}
        >
          <span>{t("scheme.viewDetails")}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
