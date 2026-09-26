"use client";

import { useAccessibility } from "@/context/AccessibilityContext";
import { 
  Accessibility, 
  X, 
  RotateCcw, 
  Type, 
  AlignJustify, 
  Eye, 
  Sparkles,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AccessibilityDrawer() {
  const {
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    dyslexicFont,
    setDyslexicFont,
    highContrast,
    setHighContrast,
    theme,
    setTheme,
    toggleTheme,
    isDrawerOpen,
    setIsDrawerOpen,
    resetAccessibility,
  } = useAccessibility();

  return (
    <>
      {/* Floating Accessibility Trigger Button (Bottom Right - z-[60] higher than navbar) */}
      <button
        type="button"
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-[60] bg-slate-900/90 hover:bg-slate-800 text-slate-100 p-3.5 rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.5)] border border-amber-500/40 backdrop-blur-xl flex items-center gap-2 group transition-all hover:scale-105 cursor-pointer"
        aria-label="Open Accessibility Settings Toolbar"
        id="accessibility-settings-trigger"
      >
        <Accessibility className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold pr-1 text-slate-100">
          Accessibility / सुलभता
        </span>
      </button>

      {/* Slide-in Overlay Drawer (z-[80] higher than all navigation layers) */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 z-[80] flex justify-end backdrop-blur-md transition-opacity"
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-drawer-title"
        >
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-slate-900/95 text-slate-100 w-full max-w-md h-full p-6 sm:p-8 overflow-y-auto border-l border-white/[0.12] shadow-2xl flex flex-col justify-between backdrop-blur-2xl"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/15 text-amber-400 rounded-xl border border-amber-500/20">
                    <Accessibility className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 id="accessibility-drawer-title" className="text-xl font-extrabold text-slate-50 tracking-tight">
                      Accessibility Engine
                    </h2>
                    <p className="text-xs text-amber-400/90 font-medium">
                      WCAG 2.2 AAA Assistive Controls
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close Accessibility Controls"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Control 0: Theme Mode (Dark Mode vs Light Mode - Linen & Sage) */}
              <div className="bg-slate-800/60 border border-white/[0.06] p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    {theme === "light" ? (
                      <Sun className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Moon className="w-4 h-4 text-cyan-400" />
                    )}
                    <span>Visual Theme (रंग स्वरूप)</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-white/[0.08] text-slate-300">
                    {theme === "light" ? "Linen & Sage (सुलभ शांत)" : "Obsidian Night"}
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  {theme === "light"
                    ? "Warm ivory paper canvas with calm sage accents (#8B9A6E). Gentle on the eyes, anti-fatigue."
                    : "Crisp dark mode with deep obsidian slate surfaces."}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      theme === "dark"
                        ? "bg-slate-700 text-white border-amber-400/80 shadow-xs font-bold"
                        : "bg-slate-900/60 text-slate-300 border-white/[0.08] hover:bg-slate-800"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark Mode</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      theme === "light"
                        ? "bg-amber-500 text-white border-amber-400 shadow-xs font-bold"
                        : "bg-slate-900/60 text-slate-300 border-white/[0.08] hover:bg-slate-800"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-200" />
                    <span>Light Mode (Linen)</span>
                  </button>
                </div>
              </div>

              {/* Control 1: Text Resizing Scale (+200% maximum) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Type className="w-4 h-4 text-amber-400" />
                    <span>Text Size Scaling (अक्षर आकार)</span>
                  </label>
                  <span className="text-xs font-bold text-amber-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-white/[0.08]">
                    {fontSize === "normal" ? "100%" : fontSize === "large" ? "125%" : fontSize === "xlarge" ? "150%" : "200%"}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "normal", label: "A", sub: "100%" },
                    { id: "large", label: "A+", sub: "125%" },
                    { id: "xlarge", label: "A++", sub: "150%" },
                    { id: "max", label: "A+++", sub: "200%" },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setFontSize(tier.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        fontSize === tier.id
                          ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-xs"
                          : "bg-slate-800 text-slate-200 border-white/[0.08] hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      <div className="text-base font-bold">{tier.label}</div>
                      <div className="text-[10px] opacity-80">{tier.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Control 2: Line Spacing Scaling */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <AlignJustify className="w-4 h-4 text-amber-400" />
                  <span>Line Spacing (पंक्तियों की दूरी)</span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "normal", label: "Standard" },
                    { id: "relaxed", label: "Relaxed" },
                    { id: "loose", label: "Expanded" },
                  ].map((sp) => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => setLineHeight(sp.id)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        lineHeight === sp.id
                          ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-xs"
                          : "bg-slate-800 text-slate-200 border-white/[0.08] hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Control 3: Dyslexia Friendly Typeface Toggle */}
              <div className="bg-slate-800/60 border border-white/[0.06] p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Dyslexia-Friendly Font</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Increases letter distinction for cognitive ease
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDyslexicFont(!dyslexicFont)}
                  className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                    dyslexicFont ? "bg-amber-500" : "bg-slate-700"
                  }`}
                  aria-pressed={dyslexicFont}
                >
                  <div 
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      dyslexicFont ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Control 4: True High-Contrast Mode Toggle */}
              <div className="bg-slate-800/60 border border-white/[0.06] p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>True High-Contrast Mode</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Stark black &amp; white contrast exceeding 7:1 ratio
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                    highContrast ? "bg-cyan-500" : "bg-slate-700"
                  }`}
                  aria-pressed={highContrast}
                >
                  <div 
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      highContrast ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Bottom Actions (Solid Fills, Borderless, No Gradients) */}
            <div className="pt-6 border-t border-white/[0.08] space-y-3">
              <button
                type="button"
                onClick={resetAccessibility}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white py-2.5 rounded-xl text-xs font-semibold border border-white/[0.08] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to System Defaults</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                Apply &amp; Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
