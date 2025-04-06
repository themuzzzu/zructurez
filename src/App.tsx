
import { useState, useEffect, lazy, Suspense } from "react";
import { useLocation, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";
import { queryClient, prefetchCommonQueries } from "@/lib/react-query";
import { AuthProvider } from "@/providers/AuthProvider";
import { LoadingProvider } from "@/providers/LoadingProvider"; 
import router from "./routes";
import { PageLoader } from "@/components/loaders";

// Always loaded components
import { LoadingView } from "@/components/LoadingView";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reduced loading time to 250ms for much faster initial render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);
    
    return () => clearTimeout(timer);
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
              <PageLoader type="rangoli" showMessage={false} />
            )}
            <Toaster />
          </AuthProvider>
        </LoadingProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
