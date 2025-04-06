
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  progress: number;
  loadingMessage: string;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
  progress: 0,
  loadingMessage: '',
});

const loadingMessages = [
  "Calling the vendor anna…",
  "Warming up your street deals…",
  "Folding the veshti… almost ready 👕",
  "Unpacking your goodies…",
  "Gathering the freshest produce…",
  "Brewing your filter coffee…",
  "Arranging the jasmine flowers…",
  "Preparing your favorite dishes…",
  "Finding the best local deals…",
  "Sorting through the marketplace…"
];

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  
  useEffect(() => {
    if (isLoading) {
      // Progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const increment = prev < 70 ? 15 : prev < 90 ? 5 : 2;
          return Math.min(prev + increment, 99);
        });
      }, 300);
      
      // Rotate messages
      const messageInterval = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 3000);
      
      return () => {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
      };
    } else {
      // Complete the progress animation when loading is done
      setProgress(100);
      const resetTimeout = setTimeout(() => {
        setProgress(0);
      }, 500);
      
      return () => clearTimeout(resetTimeout);
    }
  }, [isLoading]);
  
  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
    if (loading && progress === 0) {
      setMessageIndex(Math.floor(Math.random() * loadingMessages.length));
    }
  };
  
  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading, 
        setLoading, 
        progress, 
        loadingMessage: loadingMessages[messageIndex]
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
