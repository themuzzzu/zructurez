
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
  const [translationObserver, setTranslationObserver] = useState<MutationObserver | null>(null);

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
    
    // Apply automatic translation to text nodes - this is the key function
    translateAllDOMText(lang);
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
  
  // Updated function to safely translate DOM text
  const translateAllDOMText = useCallback((lang: Language) => {
    // Disconnect any existing observer before creating a new one
    if (translationObserver) {
      translationObserver.disconnect();
    }

    // Skip for English (default language)
    if (lang === "english") return;
    
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
            console.error('Error translating element:', error);
          }
        }
      }
    });
    
    // Translation mapping for common UI elements
    const navigationItems = [
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
      { text: "Theme", key: "theme" },
      { text: "Search", key: "search" },
      { text: "Profile", key: "profile" },
      { text: "More", key: "more" },
      { text: "Notifications", key: "notifications" },
      { text: "Log out", key: "logOut" },
      { text: "Sign in", key: "signIn" },
      { text: "Register", key: "register" }
    ];
    
    // Product/service related terms
    const productTerms = [
      { text: "Add to cart", key: "addToCart" },
      { text: "Buy now", key: "buyNow" },
      { text: "Add to wishlist", key: "addToWishlist" },
      { text: "View details", key: "viewDetails" },
      { text: "Price", key: "price" },
      { text: "Discount", key: "discount" },
      { text: "Reviews", key: "reviews" },
      { text: "Rating", key: "rating" },
      { text: "Categories", key: "categories" },
      { text: "Browse by Category", key: "browseByCategory" },
      { text: "Popular", key: "popular" },
      { text: "Local Businesses", key: "localBusinesses" },
      { text: "Register Business", key: "registerBusiness" }
    ];
    
    // Safe translation function that won't cause DOM errors
    const safelyTranslateTextContent = (element: Element) => {
      if (!element || !element.textContent || element.hasAttribute('data-translated')) return;
      
      const text = element.textContent.trim();
      if (!text || text.length < 2 || text.length > 50) return; // Skip empty or very long text
      
      // Don't translate numbers, dates, and codes
      if (/^\d+(\.\d+)?$/.test(text) || /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(text)) return;
      
      try {
        // Check navigation items
        for (const item of navigationItems) {
          if (text === item.text || text.includes(item.text)) {
            const translatedText = translate(item.key);
            if (translatedText !== item.key && element.textContent) {
              element.textContent = element.textContent.replace(item.text, translatedText);
              element.setAttribute('data-translated', 'true');
              return;
            }
          }
        }
        
        // Check product terms
        for (const term of productTerms) {
          if (text === term.text || text.includes(term.text)) {
            const translatedText = translate(term.key);
            if (translatedText !== term.key && element.textContent) {
              element.textContent = element.textContent.replace(term.text, translatedText);
              element.setAttribute('data-translated', 'true');
              return;
            }
          }
        }
        
        // Try direct translation for other UI elements
        const normalizedKey = text.toLowerCase().replace(/\s+/g, '_');
        const translatedText = translate(normalizedKey);
        if (translatedText !== normalizedKey && translatedText !== text) {
          element.textContent = translatedText;
          element.setAttribute('data-translated', 'true');
        }
      } catch (error) {
        console.error('Error translating element:', error);
      }
    };
    
    // Safe process node function that won't cause DOM errors
    const safelyProcessNode = (node: Element) => {
      try {
        // Skip script and style elements
        if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || 
            node.getAttribute('data-no-translate') === 'true') {
          return;
        }
        
        // Process this element
        safelyTranslateTextContent(node);
        
        // Process children (if any)
        Array.from(node.children).forEach(child => {
          safelyProcessNode(child);
        });
      } catch (error) {
        console.error('Error processing node for translation:', error);
      }
    };
    
    // Start translation from the body with safety checks
    try {
      if (document.body) {
        safelyProcessNode(document.body);
      }
    } catch (error) {
      console.error('Error translating body:', error);
    }
    
    // Create and set up a new mutation observer
    try {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                try {
                  safelyProcessNode(node as Element);
                } catch (error) {
                  console.error('Error translating dynamic node:', error);
                }
              }
            });
          }
        });
      });
      
      // Start observing with safer options
      observer.observe(document.body, { 
        childList: true,
        subtree: true
      });
      
      // Store the observer for later cleanup
      setTranslationObserver(observer);
    } catch (error) {
      console.error('Error setting up translation observer:', error);
    }
    
    return () => {
      if (translationObserver) {
        translationObserver.disconnect();
      }
    };
  }, [language, translationObserver]);

  // Clean up observer when component unmounts
  useEffect(() => {
    return () => {
      if (translationObserver) {
        translationObserver.disconnect();
      }
    };
  }, [translationObserver]);

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
