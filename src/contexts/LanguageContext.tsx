
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations } from "@/translations";
import { translateText, preloadCommonTranslations, cleanupUnusedModels, Language } from "@/services/TranslationService";
import { debounce } from "lodash";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  tDynamic: (text: string) => Promise<string>;
  isChangingLanguage: boolean;
};

const defaultContext: LanguageContextType = {
  language: "english",
  setLanguage: () => {},
  t: (key) => key,
  tDynamic: async (text) => text,
  isChangingLanguage: false,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("english");
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [languageIndicator, setLanguageIndicator] = useState<HTMLDivElement | null>(null);
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, string>>({});
  
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
        
        // Preload common translations for better UX
        if (savedLanguage !== "english") {
          preloadCommonTranslations(savedLanguage);
        }
      }
    } catch (error) {
      console.error("Error loading saved language:", error);
    }
  }, []);

  // Static translation function using predefined translations
  const translate = useCallback((key: string): string => {
    // First try to get translation in current language
    const currentTranslations = translations[language] || {};
    
    // If translation exists in current language, use it
    if (currentTranslations[key]) {
      return currentTranslations[key];
    }
    
    // Look for the key in dynamically translated content
    if (dynamicTranslations[key]) {
      return dynamicTranslations[key];
    }
    
    // If not found in current language, fall back to English
    return translations.english[key] || key;
  }, [language, dynamicTranslations]);
  
  // Dynamic translation function for text not in the translations object
  const translateDynamic = useCallback(async (text: string): Promise<string> => {
    if (language === "english" || !text || text.trim() === "") {
      return text;
    }
    
    try {
      const translatedText = await translateText(text, language);
      
      // Update dynamic translations cache
      setDynamicTranslations(prev => ({
        ...prev,
        [text]: translatedText
      }));
      
      return translatedText;
    } catch (error) {
      console.error("Dynamic translation error:", error);
      return text;
    }
  }, [language]);
  
  // Debounced version of translateDynamic to prevent excessive API calls
  const debouncedTranslateDynamic = useCallback(
    debounce(async (text: string, callback: (result: string) => void) => {
      const result = await translateDynamic(text);
      callback(result);
    }, 300),
    [translateDynamic]
  );
  
  // Show language indicator in the corner with improved error handling
  const showLanguageIndicator = useCallback((lang: Language) => {
    try {
      // Safely remove any existing indicator
      if (languageIndicator && document.body.contains(languageIndicator)) {
        document.body.removeChild(languageIndicator);
        setLanguageIndicator(null);
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
              document.body.removeChild(indicator);
              setLanguageIndicator(null);
            }
          }, 500);
        }
      }, 3000);
    } catch (error) {
      console.error("Error showing language indicator:", error);
    }
  }, [languageIndicator]);
  
  // Apply translation attributes to elements
  const applyTranslationAttributes = useCallback(() => {
    try {
      // Common UI elements mapping
      const commonElements = [
        { selector: 'button, a', attributes: ['aria-label'] },
        { selector: 'input, textarea', attributes: ['placeholder'] },
        { selector: 'h1, h2, h3, h4, h5, h6, p, span, div', attributes: ['innerText'] }
      ];

      // Add data-translate attribute to elements with common UI terms
      const commonUITerms = Object.keys(translations.english);
      
      // Process common UI elements
      commonElements.forEach(({ selector, attributes }) => {
        document.querySelectorAll(selector).forEach(element => {
          if (element.hasAttribute('data-translate') || element.hasAttribute('data-translated')) {
            return; // Skip elements that are already marked for translation
          }
          
          attributes.forEach(attr => {
            const value = attr === 'innerText' 
              ? element.textContent?.trim() 
              : element.getAttribute(attr);
            
            if (value) {
              commonUITerms.forEach(term => {
                const englishTerm = translations.english[term];
                if (englishTerm && value === englishTerm) {
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
  const translateDataAttributes = useCallback(async () => {
    if (language === "english") return;
    
    try {
      const elements = document.querySelectorAll('[data-translate]');
      
      // Process each element with a data-translate attribute
      elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (key) {
          const translatedText = translate(key);
          if (translatedText !== key) {
            element.textContent = translatedText;
            element.setAttribute('data-translated', 'true');
          }
        }
      });
      
      // Handle dynamic content that doesn't have static translations
      const dynamicElements = document.querySelectorAll('[data-translate-dynamic]');
      dynamicElements.forEach(async (element) => {
        if (element.textContent?.trim()) {
          const originalText = element.textContent;
          const elKey = element.getAttribute('data-translate-dynamic');
          const cacheKey = elKey || originalText;
          
          // Check if we already have this translation
          if (dynamicTranslations[cacheKey]) {
            element.textContent = dynamicTranslations[cacheKey];
            element.setAttribute('data-translated', 'true');
          } else {
            // Mark for translation
            debouncedTranslateDynamic(originalText, (translatedText) => {
              if (element && document.body.contains(element)) {
                element.textContent = translatedText;
                element.setAttribute('data-translated', 'true');
              }
            });
          }
        }
      });
    } catch (error) {
      console.error("Error translating data attributes:", error);
    }
  }, [language, translate, dynamicTranslations, debouncedTranslateDynamic]);
  
  // Apply language changes to DOM with improved error handling
  const applyLanguageToDOM = useCallback((lang: Language) => {
    try {
      setIsChangingLanguage(true);
      
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
      
      // Preload common translations for the new language
      if (lang !== "english") {
        preloadCommonTranslations(lang);
      }
      
      // Clean up unused translation models to save memory
      cleanupUnusedModels(lang);
      
      // Dispatch event for components to update
      const event = new CustomEvent('languageChanged', { 
        detail: { language: lang } 
      });
      window.dispatchEvent(event);
      
      // Remove transition class after animation completes
      setTimeout(() => {
        document.body.classList.remove('lang-transition');
        setIsChangingLanguage(false);
      }, 800);
      
    } catch (error) {
      console.error("Error applying language to DOM:", error);
      setIsChangingLanguage(false);
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
    tDynamic: translateDynamic,
    isChangingLanguage
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
