
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CircularLoader } from '@/components/loaders/CircularLoader';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  progress: number;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
  progress: 0,
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      // Start progress animation
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          const increment = prev < 70 ? 15 : prev < 90 ? 5 : 2;
          const newProgress = Math.min(prev + increment, 99);
          if (newProgress >= 99) clearInterval(interval);
          return newProgress;
        });
      }, 300);
      
      return () => clearInterval(interval);
    } else {
      // Complete the progress animation
      setProgress(100);
      const resetTimeout = setTimeout(() => {
        setProgress(0);
      }, 500);
      
      return () => clearTimeout(resetTimeout);
    }
  };

  // Render a loading overlay when isLoading is true
  const renderLoadingOverlay = () => {
    if (!isLoading) return null;
    
    return (
      <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <CircularLoader size={48} color="var(--color-primary)" />
        </div>
      </div>
    );
  };
  
  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading, 
        setLoading, 
        progress
      }}
    >
      {renderLoadingOverlay()}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
