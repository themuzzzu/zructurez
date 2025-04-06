
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  progress: number;
  setProgress: (progress: number) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
  progress: 0,
  setProgress: () => {}
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const setLoading = (loading: boolean) => {
    // Clear any existing timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      setLoadingTimeout(null);
    }
    
    setIsLoading(loading);
    
    if (loading) {
      // Start progress animation
      setProgress(0);
      
      // Quick progress to 30% within 300ms
      setTimeout(() => setProgress(30), 100);
      
      // Move to 60% within 1s
      setTimeout(() => setProgress(60), 500);
      
      // Then gradually move to 90%
      const interval = setInterval(() => {
        setProgress(prev => {
          const increment = prev < 70 ? 5 : prev < 90 ? 2 : 0.5;
          const newProgress = Math.min(prev + increment, 95);
          if (newProgress >= 95) clearInterval(interval);
          return newProgress;
        });
      }, 400);
      
      // Set a max loading time of 30 seconds before resetting
      const timeout = setTimeout(() => {
        console.warn("Loading timeout reached. Resetting loading state.");
        setIsLoading(false);
        setProgress(0);
        clearInterval(interval);
      }, 30000);
      
      setLoadingTimeout(timeout);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      // Complete the progress animation
      setProgress(100);
      const resetTimeout = setTimeout(() => {
        setProgress(0);
      }, 500);
      
      return () => clearTimeout(resetTimeout);
    }
  };
  
  // Clean up any timeouts on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [loadingTimeout]);
  
  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading, 
        setLoading, 
        progress,
        setProgress 
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
