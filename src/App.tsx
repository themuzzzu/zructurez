
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocationProvider } from "@/providers/LocationProvider";
import { LocationModalHandler } from "@/components/location/LocationModalHandler";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Routes } from "./routes";
import { useEffect, useState } from "react";
import { PageLoader } from "@/components/loaders/PageLoader";
import { NetworkMonitor } from "@/providers/NetworkMonitor";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Add a slight delay to prevent flash of content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    // Attempt to preload critical resources
    try {
      // Create and add preload links for critical resources
      const criticalResources = [
        '/lovable-uploads/a727b8a0-84a4-45b2-88da-392010b1b66c.png',
        '/lovable-uploads/c395d99e-dcf4-4659-9c50-fc50708c858d.png'
      ];
      
      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = resource;
        link.fetchPriority = 'high';
        document.head.appendChild(link);
      });
    } catch (err) {
      console.error('Failed to preload resources:', err);
    }
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <NetworkMonitor>
            <LocationProvider>
              {isLoading ? (
                <PageLoader type="shimmer" />
              ) : (
                <>
                  <Routes />
                  <LocationModalHandler />
                  <Toaster position="top-center" />
                </>
              )}
            </LocationProvider>
          </NetworkMonitor>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
