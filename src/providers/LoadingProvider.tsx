
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  
  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading, 
        setLoading, 
        progress
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
