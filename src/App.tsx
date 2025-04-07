
import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/react-query";
import { AuthProvider } from "@/providers/AuthProvider";
import { LoadingProvider } from "@/providers/LoadingProvider"; 
import router from "./routes";
import { PageLoader } from "@/components/loaders/PageLoader";
import { RouterProvider } from "react-router-dom";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reduced loading time for faster initial render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150);
    
    return () => clearTimeout(timer);
  }, []);

  // Preload critical resources
  useEffect(() => {
    // Preload images
    const preloadImages = [
      '/images/categories/1.png',
      '/images/categories/2.png',
      '/images/categories/3.png',
    ];
    
    preloadImages.forEach(image => {
      const img = new Image();
      img.src = image;
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="lovable-theme">
        <LoadingProvider>
          <AuthProvider>
            <div className={isLoading ? "hidden" : "app"}>
              {!isLoading && <RouterProvider router={router} />}
            </div>
            {isLoading && (
              <PageLoader type="shimmer" />
            )}
            <Toaster />
          </AuthProvider>
        </LoadingProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
