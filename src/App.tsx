
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LocationProvider } from "@/providers/LocationProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Routes as AppRoutes } from "./routes";
import { useEffect, useState } from "react";
import { PageLoader } from "@/components/loaders/PageLoader";
import { NetworkMonitor } from "@/providers/NetworkMonitor";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "sonner";
import { LocationModalHandler } from "@/components/location/LocationModalHandler";
import "./App.css";
import "./styles/global.css";
import "./styles/theme-manager.css";
import "./utils/scrollbarUtils.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLanguageChanging, setIsLanguageChanging] = useState(false);
  
  useEffect(() => {
    try {
      // Load saved theme color from localStorage and apply it
      const savedTheme = localStorage.getItem("uiTheme");
      if (savedTheme) {
        document.documentElement.classList.forEach(className => {
          if (className.startsWith('ui-')) {
            document.documentElement.classList.remove(className);
          }
        });
        document.documentElement.classList.add(savedTheme);
      }
      
      // Load saved font size from localStorage and apply it
      const savedFontSize = localStorage.getItem("fontSize");
      if (savedFontSize) {
        document.documentElement.style.fontSize = `${savedFontSize}%`;
      }
      
      // Apply the data-language attribute to HTML element
      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage) {
        document.documentElement.setAttribute("data-language", savedLanguage);
        
        // For RTL languages (like Urdu), add appropriate direction
        if (savedLanguage === "urdu") {
          document.documentElement.setAttribute("dir", "rtl");
        } else {
          document.documentElement.removeAttribute("dir");
        }
      }
    } catch (error) {
      console.error("Error initializing app settings:", error);
    }
    
    // Preload critical resources asynchronously
    const preloadCriticalResources = async () => {
      const criticalResources = [
        '/lovable-uploads/a727b8a0-84a4-45b2-88da-392010b1b66c.png',
        '/lovable-uploads/c395d99e-dcf4-4659-9c50-fc50708c858d.png'
      ];
      
      try {
        // Create and add preload links for critical resources
        const preloadPromises = criticalResources.map(resource => {
          return new Promise<void>((resolve) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = resource;
            link.fetchPriority = 'high';
            link.onload = () => resolve();
            link.onerror = () => resolve(); // Continue even if load fails
            document.head.appendChild(link);
          });
        });
        
        // Wait for resources to load or timeout after 2 seconds
        const timeout = new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
        await Promise.race([Promise.all(preloadPromises), timeout]);
      } catch (err) {
        console.error('Failed to preload resources:', err);
      }
    };
    
    preloadCriticalResources();
    
    // Hide loader after a delay to ensure resources are loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    // Listen for language changes to handle transitions properly
    const handleLanguageChange = (e: Event) => {
      // Use a subtle transition instead of a full reload
      setIsLanguageChanging(true);
      document.body.classList.add('lang-transition');
      
      // Short delay to allow CSS transition to complete
      setTimeout(() => {
        document.body.classList.remove('lang-transition');
        setIsLanguageChanging(false);
      }, 800);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    // Preload language translation files
    const preloadTranslationsScript = document.createElement('script');
    preloadTranslationsScript.src = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@20.0.0/dist/transformers.min.js';
    preloadTranslationsScript.async = true;
    document.head.appendChild(preloadTranslationsScript);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('languageChanged', handleLanguageChange);
      if (document.head.contains(preloadTranslationsScript)) {
        document.head.removeChild(preloadTranslationsScript);
      }
    };
  }, []);

  // Render a lightweight transition screen during language changes
  const renderContent = () => {
    if (isLoading) {
      return <PageLoader type="shimmer" />;
    }
    
    if (isLanguageChanging) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background transition-opacity duration-300">
          <div className="animate-pulse text-center">
            <div className="h-8 w-8 mx-auto mb-4 rounded-full bg-primary/30"></div>
            <div className="h-4 w-32 mx-auto rounded bg-muted"></div>
          </div>
        </div>
      );
    }
    
    return (
      <>
        <AppRoutes />
        <LocationModalHandler />
        <Toaster position="top-center" />
      </>
    );
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <QueryClientProvider client={queryClient}>
            <NetworkMonitor>
              <LocationProvider>
                {renderContent()}
              </LocationProvider>
            </NetworkMonitor>
          </QueryClientProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
