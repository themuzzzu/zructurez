
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
  const applyLanguageToDOM = useCallback((lang: Language) => {
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
    
    // Apply automatic translation to text nodes
    setTimeout(() => translateVisibleText(lang), 100);
  }, []);
  
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
      malayalam: "മലയാളം",
      urdu: "اردو"
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
  const translateVisibleText = useCallback((lang: Language) => {
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
    
    // Now scan for page-specific elements that require translation
    const translateStaticUI = () => {
      // Home page elements
      const homeElements = [
        { selector: 'h1:contains("Find Local")', key: 'findLocal' },
        { selector: 'button:contains("Search")', key: 'search' },
        { selector: 'button:contains("Electronics")', key: 'electronics' },
        { selector: 'button:contains("Home Decor")', key: 'homeDecor' },
        { selector: 'button:contains("Fashion")', key: 'fashion' },
        { selector: 'button:contains("Books")', key: 'books' },
        { selector: 'button:contains("Sports")', key: 'sports' },
        { selector: 'div:contains("You\'re browsing from")', key: 'browsingFrom' },
        { selector: 'button:contains("Detect")', key: 'detect' },
        { selector: 'button:contains("Choose Location")', key: 'chooseLocation' },
        { selector: 'span:contains("Home")', key: 'home' },
        { selector: 'span:contains("Marketplace")', key: 'marketplace' },
        { selector: 'span:contains("Services")', key: 'services' },
        { selector: 'span:contains("Business")', key: 'business' },
        { selector: 'span:contains("Maps")', key: 'maps' },
        { selector: 'span:contains("More")', key: 'more' }
      ];
      
      // Custom querySelector to find elements containing text
      const findElementsWithText = (selector: string, text: string): Element[] => {
        const allElements = document.querySelectorAll(selector);
        return Array.from(allElements).filter(el => 
          el.textContent && el.textContent.includes(text) && !el.hasAttribute('data-translated')
        );
      };
      
      // Translate home page elements if found
      homeElements.forEach(item => {
        const selectorParts = item.selector.split(':contains(');
        if (selectorParts.length === 2) {
          const tagName = selectorParts[0];
          const searchText = selectorParts[1].replace('"', '').replace('")', '');
          
          const elements = findElementsWithText(tagName, searchText);
          elements.forEach(el => {
            const translatedText = translate(item.key);
            if (translatedText !== item.key) {
              el.textContent = translatedText;
              el.setAttribute('data-translated', 'true');
            }
          });
        }
      });
    };
    
    // Run static UI translation after a short delay
    setTimeout(translateStaticUI, 300);
    
    setTranslatedElements(processed);
  }, [language]);

  // Re-translate visible text whenever language changes
  useEffect(() => {
    translateVisibleText(language);
    
    // Set up mutation observer to catch dynamically added content
    const observer = new MutationObserver((mutations) => {
      let needsTranslation = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              const element = node as Element;
              if (element.hasAttribute('data-translate') || 
                  element.querySelectorAll('[data-translate]').length > 0) {
                needsTranslation = true;
              }
            }
          });
        }
      });
      
      if (needsTranslation && language !== 'english') {
        translateVisibleText(language);
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    return () => observer.disconnect();
  }, [language, translateVisibleText]);

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
