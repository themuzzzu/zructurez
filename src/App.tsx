
import React, { useEffect, useState, lazy, Suspense } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LocationProvider } from "@/providers/LocationProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Routes } from "./routes";
import { PageLoader } from "@/components/loaders/PageLoader";
import { NetworkMonitor } from "@/providers/NetworkMonitor";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/hooks/useAuth";
import "./App.css";
import "./styles/global.css";
import "./styles/theme-manager.css"; // Import our theme manager
import { Toaster } from "sonner";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  
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
        setResourcesLoaded(true);
      } catch (err) {
        console.error('Failed to preload resources:', err);
        setResourcesLoaded(true); // Continue anyway
      }
    };
    
    preloadCriticalResources();
    
    // Hide loader after a delay to ensure resources are loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    // Listen for language changes to prevent full refresh
    const handleLanguageChange = () => {
      // Use the existing loading state mechanism for smooth transitions
      setIsLoading(true);
      
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <QueryClientProvider client={queryClient}>
                <NetworkMonitor>
                  <LocationProvider>
                    {isLoading ? (
                      <PageLoader type="shimmer" />
                    ) : (
                      <>
                        <Routes />
                        {/* Use Toaster directly instead of lazy loading */}
                        <Toaster position="top-center" />
                      </>
                    )}
                  </LocationProvider>
                </NetworkMonitor>
              </QueryClientProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default App;
