
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocationProvider } from "@/providers/LocationProvider";
import { LocationModalHandler } from "@/components/location/LocationModalHandler";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Routes } from "./routes";
import { useEffect, useState } from "react";
import { PageLoader } from "@/components/loaders/PageLoader";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Add a slight delay to prevent flash of content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
