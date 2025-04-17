
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LocationProvider } from "@/providers/LocationProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Routes } from "./routes";
import { useEffect, useState, lazy, Suspense } from "react";
import { PageLoader } from "@/components/loaders/PageLoader";
import { NetworkMonitor } from "@/providers/NetworkMonitor";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./App.css";
import "./styles/global.css";
import "./styles/theme-manager.css"; // Import our theme manager

// Lazy load components that aren't needed right away
const LazyToaster = lazy(() => import("sonner").then(module => ({ default: module.Toaster })));
const LazyLocationModalHandler = lazy(() => import("@/components/location/LocationModalHandler").then(module => ({ default: module.LocationModalHandler })));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  
  useEffect(() => {
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
    
    // Force initial language translation
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      const langEvent = new CustomEvent("language-changed", { 
        bubbles: true,
        detail: { language: savedLanguage } 
      });
      document.documentElement.dispatchEvent(langEvent);
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
    
    // Hide loader after resources loaded or timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Reduced from 100ms
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <LanguageProvider>
          <QueryClientProvider client={queryClient}>
            <NetworkMonitor>
              <LocationProvider>
                {isLoading ? (
                  <PageLoader type="shimmer" />
                ) : (
                  <>
                    <Routes />
                    <Suspense fallback={null}>
                      {resourcesLoaded && <LazyLocationModalHandler />}
                    </Suspense>
                    <Suspense fallback={null}>
                      <LazyToaster position="top-center" />
                    </Suspense>
                  </>
                )}
              </LocationProvider>
            </NetworkMonitor>
          </QueryClientProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
