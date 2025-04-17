
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
  const [translatedElements, setTranslatedElements] = useState<Element[]>([]);

  // Load saved language on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
      applyLanguageToDOM(savedLanguage);
    }
  }, []);

  // Function to apply language changes to DOM
  const applyLanguageToDOM = (lang: Language) => {
    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-language", lang);
    
    // Force app-wide re-render on language change
    const translationEvent = new CustomEvent("language-changed", { 
      bubbles: true,
      detail: { language: lang } 
    });
    document.documentElement.dispatchEvent(translationEvent);
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: lang } 
    }));
    
    // Show language indicator
    showLanguageIndicator(lang);
    
    // Apply automatic translation to text nodes if needed
    if (lang !== "english") {
      translateVisibleText(lang);
    }
  };
  
  // Show language indicator in the corner
  const showLanguageIndicator = (lang: Language) => {
    // Remove any existing indicator
    const existingIndicator = document.querySelector('.language-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }
    
    // Create new indicator
    const indicator = document.createElement('div');
    const langName = {
      english: "English",
      hindi: "हिन्दी",
      telugu: "తెలుగు",
      tamil: "தமிழ்",
      kannada: "ಕನ್ನಡ",
      malayalam: "മലയാളം"
    }[lang];
    
    indicator.textContent = `Language: ${langName}`;
    indicator.className = 'language-indicator';
    document.body.appendChild(indicator);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      indicator.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(indicator)) {
          indicator.remove();
        }
      }, 500);
    }, 3000);
  };

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
  
  // Function to translate visible text elements automatically
  const translateVisibleText = (lang: Language) => {
    // Don't translate English content to English
    if (lang === "english") return;
    
    const textNodes = document.querySelectorAll('[data-translate]');
    const processed: Element[] = [];
    
    textNodes.forEach(node => {
      const key = node.getAttribute('data-translate');
      if (key) {
        const translatedText = translate(key);
        if (translatedText !== key) {
          node.textContent = translatedText;
          processed.push(node);
        }
      }
    });
    
    setTranslatedElements(processed);
  };

  const value = {
    language,
    setLanguage: (newLanguage: Language) => {
      setLanguage(newLanguage);
      localStorage.setItem("language", newLanguage);
      applyLanguageToDOM(newLanguage);
    },
    t: translate,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
