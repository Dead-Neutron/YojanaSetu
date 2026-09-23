import { ArrowRight, CheckCircle2, MapPin, Tag, Building } from "lucide-react";

export default function SchemeCard({ scheme, onSelect }) {
  if (!scheme) return null;

  return (
    <div className="bg-white rounded-lg border-2 border-slate-300 hover:border-amber-600 transition-all shadow-sm hover:shadow-md flex flex-col justify-between p-6">
      <div>
        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span 
            className={`text-xs font-black px-2.5 py-1 rounded border uppercase tracking-wider ${
              scheme.level === "Central"
                ? "bg-[#0F172A] text-white border-slate-900"
                : "bg-[#047857] text-white border-emerald-700"
            }`}
          >
            {scheme.level || "National"}
          </span>

          {scheme.state && scheme.state !== "All India" && (
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              {scheme.state}
            </span>
          )}

          <span className="text-xs font-semibold text-slate-700 bg-amber-50 text-amber-900 px-2.5 py-1 rounded border border-amber-300">
            {scheme.category || "Social Welfare"}
          </span>
        </div>

        {/* Scheme Title */}
        <h3 className="text-xl font-black text-slate-900 leading-snug line-clamp-2 mb-3">
          {scheme.scheme_name}
        </h3>

        {/* Key Benefits Highlight Box (High contrast, no gradient) */}
        {scheme.benefits && (
          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-3 rounded-r mb-4">
            <div className="text-xs font-black text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Financial & Welfare Benefits:
            </div>
            <p className="text-sm font-semibold text-slate-800 line-clamp-3 leading-relaxed">
              {scheme.benefits}
            </p>
          </div>
        )}

        {/* Eligibility Snippet */}
        {scheme.eligibility && (
          <div className="mb-4">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Eligibility Criteria:
            </div>
            <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
              {scheme.eligibility}
            </p>
          </div>
        )}

        {/* Demographics Target Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4 text-xs font-medium text-slate-600">
          {scheme.gender && scheme.gender !== "All" && (
            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
              Target: {scheme.gender}
            </span>
          )}
          {scheme.occupation && scheme.occupation !== "All Citizens" && (
            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
              {scheme.occupation}
            </span>
          )}
          {scheme.caste && scheme.caste !== "All" && (
            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
              Category: {scheme.caste}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between mt-2">
        <span className="text-xs text-slate-500 font-medium">
          Official Verified
        </span>
        <button
          type="button"
          onClick={() => onSelect(scheme)}
          className="inline-flex items-center gap-1.5 bg-[#D97706] hover:bg-[#B45309] text-slate-950 font-black px-4 py-2 rounded text-sm transition-colors border border-amber-500 shadow-sm"
          aria-label={`View details for ${scheme.scheme_name}`}
        >
          <span>View Details / विवरण देखें</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
