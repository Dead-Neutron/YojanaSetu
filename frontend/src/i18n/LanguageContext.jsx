"use client";

import { createContext, useContext, useState, useEffect } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "./locales/en.json";
import hiTranslations from "./locales/hi.json";
import bnTranslations from "./locales/bn.json";

// Initialize i18next instance
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: enTranslations },
      hi: { translation: hiTranslations },
      bn: { translation: bnTranslations },
    },
    lng: "en", // Default language is English as requested
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });
}

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
];

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  supportedLanguages: SUPPORTED_LANGUAGES,
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    // Check local storage for user's previous preference
    const saved = localStorage.getItem("yojanasetu_lang");
    if (saved && ["en", "hi", "bn"].includes(saved)) {
      setLanguageState(saved);
      i18n.changeLanguage(saved);
    }
  }, []);

  const changeLanguage = (langCode) => {
    if (["en", "hi", "bn"].includes(langCode)) {
      setLanguageState(langCode);
      i18n.changeLanguage(langCode);
      try {
        localStorage.setItem("yojanasetu_lang", langCode);
      } catch (e) {
        // ignore
      }
    }
  };

  const t = (key, params = {}) => {
    let result = i18n.t(key, params);
    return result;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
