
import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/translations";

type Language = "english" | "hindi" | "telugu" | "tamil" | "kannada" | "malayalam";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const defaultContext: LanguageContextType = {
  language: "english",
  setLanguage: () => {},
  t: (key) => key,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("english");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
      document.documentElement.setAttribute("data-language", savedLanguage);
    }
  }, []);

  const translate = (key: string): string => {
    // First try to get translation in current language
    const currentTranslations = translations[language] || {};
    
    // If translation exists in current language, use it
    if (currentTranslations[key]) {
      return currentTranslations[key];
    }
    
    // If not found in current language, fall back to English
    return translations.english[key] || key;
  };

  const value = {
    language,
    setLanguage: (newLanguage: Language) => {
      setLanguage(newLanguage);
      document.documentElement.lang = newLanguage;
      document.documentElement.setAttribute("data-language", newLanguage);
      localStorage.setItem("language", newLanguage);
    },
    t: translate,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
