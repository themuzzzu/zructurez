
import { useQuery, QueryKey, UseQueryOptions } from "@tanstack/react-query";
import { useEffect, useRef, useCallback } from "react";
import { globalCache } from "@/utils/cacheUtils";

interface OptimizedQueryOptions<TData, TError> extends Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'> {
  staleTime?: number;
  gcTime?: number;
  limit?: number;
  cacheTime?: number; // Local cache TTL, separate from React Query
}

/**
 * A wrapper around React Query's useQuery hook with built-in optimizations
 * to reduce unnecessary database requests
 */
export function useOptimizedQuery<TData, TError = unknown>({
  queryKey,
  queryFn,
  ...options
}: {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  staleTime?: number;
  gcTime?: number;
  limit?: number;
  cacheTime?: number;
} & OptimizedQueryOptions<TData, TError>) {
  // Track if this component is still mounted
  const isMountedRef = useRef(true);
  const cacheKey = Array.isArray(queryKey) ? queryKey.join(':') : String(queryKey);
  
  // Default staleTime to 10 minutes to drastically reduce refetches
  const defaultOptions = {
    staleTime: 10 * 60 * 1000, // 10 minutes (increased from 5 mins)
    gcTime: 30 * 60 * 1000, // 30 minutes (increased from 10 mins)
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Changed from true to false
    refetchOnReconnect: false, // Add this to prevent refetches on reconnect
    retry: 1, // Limit retries to avoid cascading failures
    ...options
  };

  // Create memoized query function that uses local cache first
  const memoizedQueryFn = useCallback(async () => {
    // Check our custom cache first (faster than React Query's cache)
    if (options?.cacheTime) {
      const cachedData = globalCache.get<TData>(cacheKey);
      if (cachedData) {
        console.debug(`Cache hit for ${cacheKey}`);
        return cachedData;
      }
    }

    // No cache hit, perform the actual query
    const startTime = performance.now();
    try {
      const result = await queryFn();
      const endTime = performance.now();
      console.debug(`Query ${queryKey[0]} took ${(endTime - startTime).toFixed(2)}ms`);
      
      // Store in our custom cache if cacheTime is provided
      if (options?.cacheTime && result) {
        globalCache.set(cacheKey, result, options.cacheTime);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      console.error(`Query ${queryKey[0]} failed after ${(endTime - startTime).toFixed(2)}ms`, error);
      throw error;
    }
  }, [queryKey.toString(), options?.cacheTime]);
  
  // Set up cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  return useQuery({
    queryKey,
    queryFn: memoizedQueryFn,
    ...defaultOptions
  });
}
