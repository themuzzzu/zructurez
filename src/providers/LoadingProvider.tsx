
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { CircularLoader } from '@/components/loaders/CircularLoader';

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
  setProgress: () => {},
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      // Start progress animation
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          const increment = prev < 70 ? 10 : prev < 90 ? 3 : 1;
          const newProgress = Math.min(prev + increment, 99);
          if (newProgress >= 99) clearInterval(interval);
          return newProgress;
        });
      }, 150); // Faster progress updates
      
      return () => clearInterval(interval);
    } else {
      // Complete the progress animation quickly
      setProgress(100);
      const resetTimeout = setTimeout(() => {
        setProgress(0);
      }, 300); // Shorter reset time
      
      return () => clearTimeout(resetTimeout);
    }
  }, []);

  // Automatically clear loading state if it stays on too long
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 8000); // 8 second max loading time
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);
  
  // Render a loading overlay when isLoading is true
  const renderLoadingOverlay = () => {
    if (!isLoading) return null;
    
    return (
      <div className="fixed inset-0 bg-white/70 dark:bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300">
        <div className="flex flex-col items-center">
          <CircularLoader size={48} color="#3B82F6" />
          <p className="mt-4 text-blue-600 dark:text-blue-400 font-medium animate-pulse">Loading...</p>
        </div>
      </div>
    );
  };
  
  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading, 
        setLoading, 
        progress,
        setProgress
      }}
    >
      {renderLoadingOverlay()}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
