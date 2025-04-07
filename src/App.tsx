
import { useState, useEffect, lazy, Suspense } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/AuthProvider";
import { LoadingProvider } from "@/providers/LoadingProvider"; 
import { PageLoader } from "@/components/loaders/PageLoader";
import { RouterProvider } from "react-router-dom";
import { LikeProvider } from "@/components/products/LikeContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorView } from "@/components/ErrorView";
import router from "./routes";

// Fallback for error boundary
const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <ErrorView 
      title="Application Error" 
      message={`Something went wrong: ${error.message}`}
    />
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Handle any uncaught errors in event handlers
    const handleGlobalError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error);
      // We don't preventDefault to allow other error handlers to work
    };
    
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled Promise Rejection:", event.reason);
    };
    
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Reduced loading time for much faster initial render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorBoundary fallback={<ErrorFallback error={new Error("Application failed to load")} />}>
      <ThemeProvider defaultTheme="dark" storageKey="lovable-theme">
        <LoadingProvider>
          <AuthProvider>
            <LikeProvider>
              <div className={isLoading ? "hidden" : "app"}>
                {!isLoading && (
                  <Suspense fallback={<PageLoader type="shimmer" />}>
                    <RouterProvider router={router} />
                  </Suspense>
                )}
              </div>
              {isLoading && (
                <PageLoader type="shimmer" />
              )}
              <Toaster />
            </LikeProvider>
          </AuthProvider>
        </LoadingProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
