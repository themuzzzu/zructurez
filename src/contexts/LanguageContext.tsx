
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations } from "@/translations";

type Language = "english" | "hindi" | "telugu" | "tamil" | "kannada" | "malayalam" | "urdu";

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
  const [languageIndicator, setLanguageIndicator] = useState<HTMLDivElement | null>(null);
  
  // Load saved language on component mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language") as Language;
      if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
        setLanguage(savedLanguage);
        document.documentElement.setAttribute("data-language", savedLanguage);
        
        // Set RTL for Urdu
        if (savedLanguage === "urdu") {
          document.documentElement.setAttribute("dir", "rtl");
        } else {
          document.documentElement.removeAttribute("dir");
        }
      }
    } catch (error) {
      console.error("Error loading saved language:", error);
    }
  }, []);

  // Translation function
  const translate = useCallback((key: string): string => {
    // First try to get translation in current language
    const currentTranslations = translations[language] || {};
    
    // If translation exists in current language, use it
    if (currentTranslations[key]) {
      return currentTranslations[key];
    }
    
    // If not found in current language, fall back to English
    return translations.english[key] || key;
  }, [language]);
  
  // Show language indicator in the corner
  const showLanguageIndicator = useCallback((lang: Language) => {
    try {
      // Remove any existing indicator safely
      if (languageIndicator) {
        try {
          if (document.body.contains(languageIndicator)) {
            document.body.removeChild(languageIndicator);
          }
        } catch (error) {
          console.error("Error removing language indicator:", error);
        }
      }
      
      // Language display names
      const langName = {
        english: "English",
        hindi: "हिन्दी",
        telugu: "తెలుగు",
        tamil: "தமிழ்",
        kannada: "ಕನ್ನಡ",
        malayalam: "മലയാളം",
        urdu: "اردو"
      }[lang];
      
      // Create new indicator
      const indicator = document.createElement('div');
      indicator.textContent = `Language: ${langName}`;
      indicator.className = 'language-indicator';
      document.body.appendChild(indicator);
      setLanguageIndicator(indicator);
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        if (indicator && document.body.contains(indicator)) {
          indicator.style.opacity = '0';
          setTimeout(() => {
            if (indicator && document.body.contains(indicator)) {
              try {
                document.body.removeChild(indicator);
                setLanguageIndicator(null);
              } catch (error) {
                console.error("Error removing faded language indicator:", error);
              }
            }
          }, 500);
        }
      }, 3000);
    } catch (error) {
      console.error("Error showing language indicator:", error);
    }
  }, [languageIndicator]);

  // Apply data-translate attributes to elements
  const applyTranslationAttributes = useCallback(() => {
    try {
      // Common UI elements mapping
      const commonElements = [
        { selector: 'button, a', attributes: ['aria-label'] },
        { selector: 'input, textarea', attributes: ['placeholder'] },
        { selector: 'h1, h2, h3, h4, h5, h6, p, span, div', attributes: ['innerText'] }
      ];

      // Add data-translate attribute to elements with common UI terms
      const commonUITerms = [
        "home", "marketplace", "services", "businesses", "business", 
        "jobs", "communities", "messages", "events", "maps", "settings",
        "search", "more", "close", "menu"
      ];
      
      // Process common UI elements
      commonElements.forEach(({ selector, attributes }) => {
        document.querySelectorAll(selector).forEach(element => {
          attributes.forEach(attr => {
            const value = attr === 'innerText' 
              ? element.textContent?.trim() 
              : element.getAttribute(attr);
            
            if (value && !element.hasAttribute('data-translate')) {
              commonUITerms.forEach(term => {
                const match = translations.english[term]?.toLowerCase();
                if (match && value.toLowerCase() === match.toLowerCase()) {
                  element.setAttribute('data-translate', term);
                }
              });
            }
          });
        });
      });
    } catch (error) {
      console.error("Error applying translation attributes:", error);
    }
  }, []);
  
  // Translate DOM elements with data-translate attribute
  const translateDataAttributes = useCallback(() => {
    if (language === "english") return;
    
    try {
      const elements = document.querySelectorAll('[data-translate]');
      elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (key) {
          const translatedText = translate(key);
          if (translatedText !== key) {
            element.textContent = translatedText;
          }
        }
      });
    } catch (error) {
      console.error("Error translating data attributes:", error);
    }
  }, [language, translate]);
  
  // Apply language changes to DOM
  const applyLanguageToDOM = useCallback((lang: Language) => {
    try {
      // Update HTML attributes
      document.documentElement.lang = lang;
      document.documentElement.setAttribute("data-language", lang);
      document.body.classList.add('lang-transition');
      
      // Handle RTL for Urdu
      if (lang === "urdu") {
        document.documentElement.setAttribute("dir", "rtl");
      } else {
        document.documentElement.removeAttribute("dir");
      }
      
      // Show language indicator
      showLanguageIndicator(lang);
      
      // Apply translation attributes and translate elements
      applyTranslationAttributes();
      translateDataAttributes();
      
      // Dispatch event for components to update
      const event = new CustomEvent('languageChanged', { 
        detail: { language: lang } 
      });
      window.dispatchEvent(event);
      
      // Remove transition class after animation completes
      setTimeout(() => {
        document.body.classList.remove('lang-transition');
      }, 800);
      
    } catch (error) {
      console.error("Error applying language to DOM:", error);
    }
  }, [showLanguageIndicator, applyTranslationAttributes, translateDataAttributes]);

  const value = {
    language,
    setLanguage: useCallback((newLanguage: Language) => {
      setLanguage(newLanguage);
      localStorage.setItem("language", newLanguage);
      applyLanguageToDOM(newLanguage);
    }, [applyLanguageToDOM]),
    t: translate,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
