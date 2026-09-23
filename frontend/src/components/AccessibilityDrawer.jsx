"use client";

import { useAccessibility } from "@/context/AccessibilityContext";
import { 
  Accessibility, 
  X, 
  RotateCcw, 
  Type, 
  AlignJustify, 
  Eye, 
  Sparkles
} from "lucide-react";

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
    isDrawerOpen,
    setIsDrawerOpen,
    resetAccessibility,
  } = useAccessibility();

  return (
    <>
      {/* Floating Accessibility Trigger Button (Bottom Right) */}
      <button
        type="button"
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#1A365D] hover:bg-[#122844] text-white p-3.5 rounded-full shadow-2xl border-2 border-[#FF9F00] flex items-center gap-2 group transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#00A3C4]"
        aria-label="Open Accessibility Settings Toolbar"
        id="accessibility-settings-trigger"
      >
        <Accessibility className="w-6 h-6 text-[#FF9F00] group-hover:rotate-12 transition-transform" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold pr-1">
          Accessibility / सुलभता
        </span>
      </button>

      {/* Slide-in Overlay Drawer */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/75 z-50 flex justify-end backdrop-blur-xs transition-opacity"
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-drawer-title"
        >
          <div className="bg-[#1A365D] text-white w-full max-w-md h-full p-6 sm:p-8 overflow-y-auto border-l border-[#23487A] shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#23487A]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FF9F00]/20 text-[#FF9F00] rounded-xl">
                    <Accessibility className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 id="accessibility-drawer-title" className="text-xl font-bold text-white tracking-tight">
                      Accessibility Engine
                    </h2>
                    <p className="text-xs text-slate-300">
                      WCAG 2.2 AAA Compliance Controls
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-[#23487A] transition-colors"
                  aria-label="Close Accessibility Controls"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Control 1: Text Resizing Scale (+200% maximum) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Type className="w-4 h-4 text-[#FF9F00]" />
                    <span>Text Size Scaling (अक्षर आकार)</span>
                  </label>
                  <span className="text-xs font-bold text-[#FF9F00] bg-[#122844] px-2.5 py-0.5 rounded-full border border-[#23487A]">
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
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        fontSize === tier.id
                          ? "bg-[#FF9F00] text-[#171717] font-bold border-[#FFD080] shadow-sm"
                          : "bg-[#122844] text-slate-200 border-[#23487A] hover:bg-[#23487A]"
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
                <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <AlignJustify className="w-4 h-4 text-[#FF9F00]" />
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
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        lineHeight === sp.id
                          ? "bg-[#FF9F00] text-[#171717] font-bold border-[#FFD080]"
                          : "bg-[#122844] text-slate-200 border-[#23487A] hover:bg-[#23487A]"
                      }`}
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Control 3: Dyslexia Friendly Typeface Toggle */}
              <div className="bg-[#122844] border border-[#23487A] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF9F00]" />
                    <span>Dyslexia-Friendly Font</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Increases letter distinction for cognitive ease
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDyslexicFont(!dyslexicFont)}
                  className={`w-12 h-7 rounded-full transition-colors relative p-1 focus:outline-none ${
                    dyslexicFont ? "bg-[#00A3C4]" : "bg-slate-700"
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
              <div className="bg-[#122844] border border-[#23487A] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#FF9F00]" />
                    <span>True High-Contrast Mode</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Stark black & white contrast exceeding 7:1 ratio
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-12 h-7 rounded-full transition-colors relative p-1 focus:outline-none ${
                    highContrast ? "bg-[#FF9F00]" : "bg-slate-700"
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

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#23487A] space-y-3">
              <button
                type="button"
                onClick={resetAccessibility}
                className="w-full bg-[#122844] hover:bg-[#23487A] text-slate-200 hover:text-white py-2.5 rounded-xl text-xs font-semibold border border-[#23487A] flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to System Defaults</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full bg-[#FF9F00] hover:bg-[#E68F00] text-[#171717] py-3 rounded-xl text-sm font-bold shadow-md transition-colors"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
