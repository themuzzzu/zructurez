
import { measureApiCall } from "./performanceTracking";
import { globalCache } from "./cacheUtils";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";

/**
 * Enhanced API utility that combines performance tracking with caching
 * @param endpoint The endpoint identifier for tracking
 * @param cacheKey The key to use for caching
 * @param ttl Time-to-live for cache in milliseconds
 * @param apiFn The API function to execute
 * @returns The result of the API call, either from cache or fresh
 */
export const fetchWithPerformance = async <T>(
  endpoint: string,
  cacheKey: string,
  ttl: number,
  apiFn: () => Promise<T>
): Promise<T> => {
  // Check cache first
  const cachedData = globalCache.get<T>(cacheKey);
  if (cachedData !== null) {
    console.debug(`Cache hit for ${cacheKey}`);
    
    // Perform background refresh if cache is getting stale (75% of TTL elapsed)
    const cacheItem = globalCache.getWithMetadata(cacheKey);
    if (cacheItem && Date.now() - cacheItem.timestamp > ttl * 0.75) {
      console.debug(`Background refresh for ${cacheKey}`);
      
      // Don't await this - run in background
      refreshDataInBackground(endpoint, cacheKey, ttl, apiFn);
    }
    
    return cachedData;
  }

  try {
    // Measure performance and execute the API call
    const data = await measureApiCall(endpoint, apiFn);
    
    // Store in cache
    globalCache.set(cacheKey, data, ttl);
    
    // Also store a copy in stale cache with longer TTL for fallback
    globalCache.set(`stale:${cacheKey}`, data, ttl * 3);
    
    console.debug(`Cache miss for ${cacheKey}, stored new result`);
    
    return data;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    
    // If we have stale data in cache, use it as fallback
    const staleData = globalCache.get<T>(`stale:${cacheKey}`);
    if (staleData !== null) {
      console.debug(`Using stale data for ${cacheKey}`);
      toast.warning("Using cached data due to connection issues");
      return staleData;
    }
    
    throw error;
  }
};

/**
 * Refresh data in background without blocking UI
 */
const refreshDataInBackground = async <T>(
  endpoint: string,
  cacheKey: string,
  ttl: number,
  apiFn: () => Promise<T>
): Promise<void> => {
  try {
    const freshData = await measureApiCall(endpoint, apiFn);
    globalCache.set(cacheKey, freshData, ttl);
    globalCache.set(`stale:${cacheKey}`, freshData, ttl * 3);
    
    // Also update any React Query cache if applicable
    queryClient.setQueryData(cacheKey.split(':'), freshData);
    
    console.debug(`Background refresh completed for ${cacheKey}`);
  } catch (error) {
    console.error(`Background refresh failed for ${cacheKey}:`, error);
    // Don't show toast for background failures to avoid confusing users
  }
};

/**
 * Prefetches data for faster user experience
 * @param endpoint The endpoint identifier for tracking
 * @param cacheKey The key to use for caching
 * @param ttl Time-to-live for cache in milliseconds
 * @param apiFn The API function to execute
 */
export const prefetchData = <T>(
  endpoint: string,
  cacheKey: string,
  ttl: number,
  apiFn: () => Promise<T>,
  priority: 'high' | 'low' = 'low'
): void => {
  // Only prefetch if not already in cache
  if (!globalCache.has(cacheKey)) {
    // Use low priority fetch
    const delay = priority === 'high' ? 100 : 1000;
    
    setTimeout(() => {
      measureApiCall(endpoint, apiFn)
        .then(data => {
          globalCache.set(cacheKey, data, ttl);
          globalCache.set(`stale:${cacheKey}`, data, ttl * 3);
          console.debug(`Prefetched data for ${cacheKey}`);
          
          // Also update React Query cache
          queryClient.setQueryData(cacheKey.split(':'), data);
        })
        .catch(error => {
          console.debug(`Prefetch failed for ${cacheKey}:`, error);
        });
    }, delay);
  }
};

/**
 * Preloads images for faster rendering
 * @param imageUrls Array of image URLs to preload
 */
export const preloadImages = (imageUrls: string[], priority: 'high' | 'low' = 'low'): void => {
  if (!imageUrls || !imageUrls.length) return;
  
  // Filter out any nulls or already loaded images
  const urlsToLoad = imageUrls.filter(url => 
    url && !document.querySelector(`link[rel="preload"][href="${url}"]`)
  );
  
  if (!urlsToLoad.length) return;
  
  // Stagger preloading to not block main thread
  const delay = priority === 'high' ? 0 : 100;
  
  urlsToLoad.forEach((url, index) => {
    setTimeout(() => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    }, index * delay);
  });
};

/**
 * Performance metric constants
 */
export const PERFORMANCE_METRICS = {
  SLOW_THRESHOLD_MS: 500,
  ACCEPTABLE_THRESHOLD_MS: 200,
  FAST_THRESHOLD_MS: 100
};

/**
 * Create a web worker for heavy computations
 * @param workerScript The worker script content as a string
 */
export const createWorker = (workerScript: string) => {
  const blob = new Blob([workerScript], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);
  const worker = new Worker(workerUrl);
  
  return {
    worker,
    terminate: () => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    }
  };
};
