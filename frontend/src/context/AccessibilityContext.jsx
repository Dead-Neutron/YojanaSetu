"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AccessibilityContext = createContext({
  fontSize: "normal",
  setFontSize: () => {},
  lineHeight: "normal",
  setLineHeight: () => {},
  dyslexicFont: false,
  setDyslexicFont: () => {},
  highContrast: false,
  setHighContrast: () => {},
  isDrawerOpen: false,
  setIsDrawerOpen: () => {},
  resetAccessibility: () => {},
});

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState("normal"); // 'normal' | 'large' | 'xlarge' | 'max'
  const [lineHeight, setLineHeight] = useState("normal"); // 'normal' | 'relaxed' | 'loose'
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Apply classes to document element
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    // Font size classes
    root.classList.remove("text-size-normal", "text-size-large", "text-size-xlarge", "text-size-max");
    root.classList.add(`text-size-${fontSize}`);

    // Line height
    root.classList.remove("leading-normal", "leading-relaxed", "leading-loose");
    root.classList.add(
      lineHeight === "loose" ? "leading-loose" : lineHeight === "relaxed" ? "leading-relaxed" : "leading-normal"
    );

    // Dyslexic font
    if (dyslexicFont) {
      root.classList.add("font-dyslexic");
    } else {
      root.classList.remove("font-dyslexic");
    }

    // High contrast mode
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [fontSize, lineHeight, dyslexicFont, highContrast]);

  const resetAccessibility = () => {
    setFontSize("normal");
    setLineHeight("normal");
    setDyslexicFont(false);
    setHighContrast(false);
  };

  return (
    <AccessibilityContext.Provider
      value={{
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
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
