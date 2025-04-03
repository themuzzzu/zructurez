
import { useState, useEffect, useRef } from "react";

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear timeout if value changes again before delay or on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): [(...args: Parameters<T>) => void, boolean] {
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef<T>(callback);
  
  // Update the callback reference when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  const debouncedCallback = useRef((...args: Parameters<T>) => {
    setIsDebouncing(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
      setIsDebouncing(false);
    }, delay);
  });
  
  // Clear the timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return [debouncedCallback.current, isDebouncing];
}

export function useThrottledValue<T>(value: T, limit: number = 200): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecutedRef = useRef<number>(0);
  
  useEffect(() => {
    const now = Date.now();
    
    if (now >= lastExecutedRef.current + limit) {
      lastExecutedRef.current = now;
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecutedRef.current = Date.now();
        setThrottledValue(value);
      }, limit);
      
      return () => clearTimeout(timerId);
    }
  }, [value, limit]);
  
  return throttledValue;
}
