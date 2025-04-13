
import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/react-query";
import { AuthProvider } from "@/providers/AuthProvider";
import { LoadingProvider } from "@/providers/LoadingProvider"; 
import { LocationProvider } from "@/providers/LocationProvider";
import { ProgressLoader } from "@/components/loaders/ProgressLoader";
import router from "./routes";
import { CircularLoader } from "@/components/loaders/CircularLoader";
import { RouterProvider } from "react-router-dom";
import { LocationModalHandler } from "@/components/location/LocationModalHandler";
import { Toaster as SonnerToaster } from "sonner";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use requestIdleCallback for non-critical initialization
    const idleCallback = 
      window.requestIdleCallback || 
      ((cb) => setTimeout(cb, 50));
    
    // Faster initial render by removing loading screen after critical content is visible
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 20); // Reduced from 50ms to 20ms
    
    // Use idle time to preload critical resources in the background
    idleCallback(() => {
      // Prefetch common queries (from react-query.ts)
      import("@/lib/react-query").then(({ prefetchCommonQueries }) => {
        prefetchCommonQueries();
      });
      
      // Preload common routes
      const preloadRoutes = async () => {
        // Import fast-loading components in sequence
        await import("./pages/Home");
        // Then load others during idle time
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
            import("./pages/marketplace/OptimizedMarketplace");
            import("./components/products/ProductCardImage");
          });
        }
      };
      
      preloadRoutes().catch(console.error);
    });
    
    return () => {
      clearTimeout(timer);
      if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback as any;
      }
    };
  }, []);

  // Fix scrolling issues and optimize CSS performance
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    
    // Add passive event listeners for better scroll performance
    const supportsPassive = (() => {
      let result = false;
      try {
        const opts = Object.defineProperty({}, 'passive', {
          get: function() { result = true; return true; }
        });
        window.addEventListener('testPassive', null as any, opts);
        window.removeEventListener('testPassive', null as any, opts);
      } catch (e) {}
      return result;
    })();
    
    const options = supportsPassive ? { passive: true } : false;
    document.addEventListener('touchstart', () => {}, options as any);
    
    return () => {
      document.removeEventListener('touchstart', () => {}, options as any);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="lovable-theme">
        <LoadingProvider>
          <AuthProvider>
            <LocationProvider>
              <ProgressLoader fixed color="#3B82F6" height={3} />
              <div className={isLoading ? "hidden" : "app"}>
                {!isLoading && (
                  <>
                    <RouterProvider router={router} />
                    <LocationModalHandler />
                  </>
                )}
              </div>
              {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-background z-50">
                  <CircularLoader size={40} color="#3B82F6" />
                </div>
              )}
              <Toaster />
              <SonnerToaster position="top-right" closeButton />
            </LocationProvider>
          </AuthProvider>
        </LoadingProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
