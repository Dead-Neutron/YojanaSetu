"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mic, ArrowRight, CheckCircle2, Award, MapPin, Building2 } from "lucide-react";

export function SchemeCard({
  scheme,
  onSelect,
  onVoiceQuery,
  title = "AICTE-LILAVATI AWARD",
  category = "Education & Scholarship",
  matchScore = 99,
  level = "Central Level",
  benefit = "Award & financial recognition of ₹1,00,000 for top performing women-led teams.",
  reasons = [
    "Directly targeted for Women in Technical Education",
    "Central Government initiative accessible across all States",
    "Verified against current Student & Demographic profile"
  ]
}) {
  const displayTitle = scheme?.scheme_name || scheme?.title || title;
  const displayCategory = scheme?.category || category;
  const displayMatchScore = scheme?.match_score ?? scheme?.matchScore ?? matchScore;
  const displayLevel = scheme?.level
    ? scheme.level.includes("Level")
      ? scheme.level
      : `${scheme.level} Level`
    : level;
  const displayState = scheme?.state && scheme.state !== "All India" ? scheme.state : null;
  const displayBenefit = scheme?.benefits || scheme?.benefit || benefit;

  // Clean, structured eligibility reasons
  const displayReasons =
    Array.isArray(scheme?.reasons) && scheme.reasons.length > 0
      ? scheme.reasons
      : Array.isArray(scheme?.match_reasons) && scheme.match_reasons.length > 0
      ? scheme.match_reasons
      : scheme?.eligibility
      ? [
          scheme.eligibility.length > 95
            ? scheme.eligibility.substring(0, 95).trim() + "..."
            : scheme.eligibility,
          displayState
            ? `Verified for eligible citizen domicile in ${displayState}`
            : "Central Government initiative accessible to all Indian residents",
          scheme.occupation && scheme.occupation !== "All Citizens"
            ? `Tailored specifically for ${scheme.occupation} category`
            : "Verified against current citizen demographics & profile"
        ]
      : reasons;

  const handleSelect = () => {
    if (onSelect) {
      onSelect(
        scheme || {
          scheme_name: displayTitle,
          category: displayCategory,
          benefits: displayBenefit,
          match_score: displayMatchScore,
          level: displayLevel,
          state: displayState
        }
      );
    }
  };

  const handleVoiceQuery = (e) => {
    e.stopPropagation();
    if (onVoiceQuery) {
      onVoiceQuery(
        scheme || {
          scheme_name: displayTitle,
          category: displayCategory
        }
      );
    }
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-between rounded-3xl bg-slate-900/80 p-7 sm:p-8 backdrop-blur-xl border border-white/[0.08] shadow-lg transition-all hover:border-white/[0.18] hover:shadow-xl min-h-[480px]"
    >
      <div className="space-y-4">
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-1">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {displayMatchScore}% Match
          </span>

          <div className="flex items-center gap-2">
            {displayState ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/90 px-3 py-1 text-xs font-medium text-amber-400 border border-white/[0.06]">
                <MapPin className="h-3 w-3 text-amber-400 shrink-0" />
                <span>{displayState}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/90 px-3 py-1 text-xs font-medium text-slate-300 border border-white/[0.06]">
                <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                <span>{displayLevel}</span>
              </span>
            )}
          </div>
        </div>

        {/* Category Label */}
        <p className="text-xs font-bold uppercase tracking-wider text-amber-400/90">
          {displayCategory}
        </p>

        {/* Large, High-Legibility Title */}
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-50 line-clamp-2 leading-snug">
          {displayTitle}
        </h3>

        {/* Formatted Key Benefit Box */}
        <div className="rounded-2xl bg-slate-800/50 p-4.5 border border-white/[0.06] backdrop-blur-sm space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Award className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Financial &amp; Welfare Benefit</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-200 font-normal line-clamp-3">
            {displayBenefit}
          </p>
        </div>

        {/* Eligibility Checkpoints List with Clear Formatting */}
        <div className="space-y-2.5 pt-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Why you qualify:
          </p>
          <div className="space-y-2">
            {displayReasons.slice(0, 3).map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm leading-relaxed text-slate-300">
                  {reason}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Button Actions Footer (Borderless & Solid Warm Colors, No Heavy Gradients) */}
      <div className="flex items-center gap-3 pt-6 mt-6 border-t border-white/[0.06]">
        {/* Secondary: Voice Query (Solid frosted slate, borderless) */}
        <motion.button
          type="button"
          onClick={handleVoiceQuery}
          whileHover={{ scale: 1.025, y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/[0.06] px-4 py-3 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Mic className="h-4 w-4 text-amber-400" />
          <span>Voice Query</span>
        </motion.button>

        {/* Primary CTA: View Details (Solid warm saffron, borderless) */}
        <motion.button
          type="button"
          onClick={handleSelect}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="h-4 w-4 stroke-[2.5]" />
        </motion.button>
      </div>
    </motion.article>
  );
}

export default SchemeCard;
