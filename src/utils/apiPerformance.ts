
import { measureApiCall } from "./performanceTracking";
import { globalCache } from "./cacheUtils";
import { toast } from "sonner";

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
    return cachedData;
  }

  try {
    // Measure performance and execute the API call
    const data = await measureApiCall(endpoint, apiFn);
    
    // Store in cache
    globalCache.set(cacheKey, data, ttl);
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
  apiFn: () => Promise<T>
): void => {
  // Only prefetch if not already in cache
  if (!globalCache.has(cacheKey)) {
    // Use low priority fetch
    setTimeout(() => {
      measureApiCall(endpoint, apiFn)
        .then(data => {
          globalCache.set(cacheKey, data, ttl);
          console.debug(`Prefetched data for ${cacheKey}`);
        })
        .catch(error => {
          console.debug(`Prefetch failed for ${cacheKey}:`, error);
        });
    }, 500); // Delay to not compete with critical resources
  }
};

/**
 * Preloads images for faster rendering
 * @param imageUrls Array of image URLs to preload
 */
export const preloadImages = (imageUrls: string[]): void => {
  if (!imageUrls || !imageUrls.length) return;
  
  // Filter out any nulls or already loaded images
  const urlsToLoad = imageUrls.filter(url => 
    url && !document.querySelector(`link[rel="preload"][href="${url}"]`)
  );
  
  if (!urlsToLoad.length) return;
  
  // Stagger preloading to not block main thread
  urlsToLoad.forEach((url, index) => {
    setTimeout(() => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    }, index * 100); // Stagger every 100ms
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
