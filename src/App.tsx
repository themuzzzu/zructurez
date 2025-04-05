
import { useState, useEffect, lazy, Suspense } from "react";
import { useLocation, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";
import { queryClient, prefetchCommonQueries } from "@/lib/react-query";
import { AuthProvider } from "@/providers/AuthProvider";
import router from "./routes"; // Import our router

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
        <AuthProvider>
          <div className={isLoading ? "hidden" : "app"}>
            {!isLoading && <RouterProvider router={router} />}
          </div>
          {isLoading && (
            <div className="flex flex-col space-y-4 items-center justify-center min-h-screen">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="animate-pulse text-center px-4">Loading your experience...</p>
            </div>
          )}
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
