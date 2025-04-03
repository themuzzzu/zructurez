
import { memo, useState, useEffect, useCallback } from "react";
import { getMemoryUsage } from "./performanceTracking";

/**
 * Enhanced memoization function that logs re-renders
 * @param Component The component to memoize
 * @param name Optional name for debugging
 */
export function memoWithTracking<P extends object>(
  Component: React.ComponentType<P>,
  name?: string
): React.MemoExoticComponent<React.ComponentType<P>> {
  const displayName = name || Component.displayName || Component.name || 'Component';
  
  // Create a wrapper that logs renders
  const WrappedComponent = (props: P) => {
    useEffect(() => {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[Performance] ${displayName} rendered`);
      }
    });
    
    return <Component {...props} />;
  };
  
  WrappedComponent.displayName = `Tracked(${displayName})`;
  
  // Apply memo
  return memo(WrappedComponent);
}

/**
 * Debounces a function call
 * @param fn The function to debounce
 * @param delay Delay in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function debounced(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttles a function call
 * @param fn The function to throttle
 * @param limit Time limit in milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return function throttled(...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Hook for using a debounced value
 * @param value The value to debounce
 * @param delay Delay in milliseconds
 */
export function useDebounced<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Hook for throttling a callback function
 * @param callback The callback to throttle
 * @param delay Delay in milliseconds
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(throttle(callback, delay), []);
}

/**
 * Monitor application performance at runtime
 */
export function usePerformanceMonitor(interval = 10000) {
  const [metrics, setMetrics] = useState({
    memory: null as number | null,
    domNodes: 0,
    renderTime: 0,
  });
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      const memory = getMemoryUsage();
      const domNodes = document.querySelectorAll('*').length;
      
      // Measure render time of next frame
      const startTime = performance.now();
      requestAnimationFrame(() => {
        const renderTime = performance.now() - startTime;
        
        setMetrics({
          memory,
          domNodes,
          renderTime,
        });
        
        // Log warnings for potential issues
        if (memory && memory > 80) {
          console.warn(`[Performance] High memory usage: ${memory.toFixed(1)}%`);
        }
        
        if (domNodes > 1500) {
          console.warn(`[Performance] High DOM node count: ${domNodes}`);
        }
        
        if (renderTime > 16.67) { // 60fps threshold
          console.warn(`[Performance] Slow frame render: ${renderTime.toFixed(1)}ms`);
        }
      });
    }, interval);
    
    return () => clearInterval(intervalId);
  }, [interval]);
  
  return metrics;
}
