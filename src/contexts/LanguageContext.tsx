
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
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
  const translationObserverRef = useRef<MutationObserver | null>(null);
  const languageIndicatorRef = useRef<HTMLDivElement | null>(null);
  
  // Load saved language on component mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language") as Language;
      if (savedLanguage && translations[savedLanguage]) {
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
      // Remove any existing indicator
      if (languageIndicatorRef.current && languageIndicatorRef.current.parentNode) {
        languageIndicatorRef.current.parentNode.removeChild(languageIndicatorRef.current);
        languageIndicatorRef.current = null;
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
      languageIndicatorRef.current = indicator;
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        if (indicator && document.body.contains(indicator)) {
          indicator.style.opacity = '0';
          setTimeout(() => {
            if (indicator && document.body.contains(indicator)) {
              indicator.remove();
              if (languageIndicatorRef.current === indicator) {
                languageIndicatorRef.current = null;
              }
            }
          }, 500);
        }
      }, 3000);
    } catch (error) {
      console.error("Error showing language indicator:", error);
    }
  }, []);

  // Safely translate DOM text elements
  const translateAllDOMText = useCallback((lang: Language) => {
    // Skip for English (default language)
    if (lang === "english") return;
    
    // Clean up previous observer
    if (translationObserverRef.current) {
      translationObserverRef.current.disconnect();
      translationObserverRef.current = null;
    }
    
    try {
      // First, translate all elements with data-translate attribute
      const translatableElements = document.querySelectorAll('[data-translate]');
      translatableElements.forEach(node => {
        const key = node.getAttribute('data-translate');
        if (key) {
          const translatedText = translate(key);
          if (translatedText !== key) {
            try {
              node.textContent = translatedText;
              node.setAttribute('data-translated', 'true');
            } catch (error) {
              console.error('Error translating element with key:', key, error);
            }
          }
        }
      });
      
      // Translation mapping for common UI elements
      const commonUITerms = [
        { text: "Home", key: "home" },
        { text: "Marketplace", key: "marketplace" }, 
        { text: "Services", key: "services" },
        { text: "Businesses", key: "businesses" },
        { text: "Business", key: "business" },
        { text: "Jobs", key: "jobs" },
        { text: "Communities", key: "communities" },
        { text: "Messages", key: "messages" },
        { text: "Events", key: "events" },
        { text: "Maps", key: "maps" },
        { text: "Settings", key: "settings" },
        { text: "Search", key: "search" },
        { text: "More", key: "more" },
        { text: "Close", key: "close" },
        { text: "Menu", key: "menu" }
      ];
      
      // Safe translation function that won't cause DOM errors
      const safelyTranslateElement = (element: Element) => {
        if (!element || !element.textContent || element.hasAttribute('data-translated')) return;
        
        // Skip elements that shouldn't be translated
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE' || 
            element.getAttribute('data-no-translate') === 'true') {
          return;
        }
        
        const text = element.textContent.trim();
        if (!text || text.length < 2 || text.length > 30) return; // Skip empty or very long text
        
        // Don't translate numbers, dates, and codes
        if (/^\d+(\.\d+)?$/.test(text) || /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(text)) return;
        
        try {
          // Check common UI terms
          for (const item of commonUITerms) {
            if (text === item.text) {
              const translatedText = translate(item.key);
              if (translatedText !== item.key) {
                element.textContent = translatedText;
                element.setAttribute('data-translated', 'true');
                return;
              }
            }
          }
        } catch (error) {
          console.error('Error translating element:', error);
        }
      };
      
      // Set up observer for dynamic content - but with safety checks
      try {
        // Only observe body and limit depth to avoid performance issues
        const observer = new MutationObserver((mutations) => {
          mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const element = node as Element;
                  if (element.hasAttribute('data-translate')) {
                    const key = element.getAttribute('data-translate');
                    if (key) {
                      const translatedText = translate(key);
                      if (translatedText !== key) {
                        try {
                          element.textContent = translatedText;
                          element.setAttribute('data-translated', 'true');
                        } catch (error) {
                          console.error('Error translating dynamic element with key:', key, error);
                        }
                      }
                    }
                  }
                }
              });
            }
          });
        });
        
        // Observe only specific parts of the DOM to reduce overhead
        const navElements = document.querySelectorAll('nav, header, footer, .fixed');
        navElements.forEach(el => {
          observer.observe(el, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
          });
        });
        
        translationObserverRef.current = observer;
        
      } catch (error) {
        console.error('Error setting up translation observer:', error);
      }
    } catch (error) {
      console.error('Error in translateAllDOMText:', error);
    }
  }, [translate]);
  
  // Apply language changes to DOM
  const applyLanguageToDOM = useCallback((lang: Language) => {
    try {
      // Update HTML attributes
      document.documentElement.lang = lang;
      document.documentElement.setAttribute("data-language", lang);
      
      // Handle RTL for Urdu
      if (lang === "urdu") {
        document.documentElement.setAttribute("dir", "rtl");
      } else {
        document.documentElement.removeAttribute("dir");
      }
      
      // Add transition class to body for smooth change
      document.body.classList.add('lang-transition');
      
      // Show language indicator
      showLanguageIndicator(lang);
      
      // Translate text in DOM
      translateAllDOMText(lang);
      
      // Dispatch events for components to update
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: lang } 
      }));
      
      // Remove transition class after animation completes
      setTimeout(() => {
        document.body.classList.remove('lang-transition');
      }, 800);
      
    } catch (error) {
      console.error("Error applying language to DOM:", error);
    }
  }, [showLanguageIndicator, translateAllDOMText]);

  // Clean up observer when component unmounts
  useEffect(() => {
    return () => {
      if (translationObserverRef.current) {
        translationObserverRef.current.disconnect();
        translationObserverRef.current = null;
      }
    };
  }, []);

  // Create context value with memoized functions
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

