
import { useQuery, QueryKey, UseQueryOptions } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

/**
 * A wrapper around React Query's useQuery hook with built-in optimizations
 * to reduce unnecessary database requests
 */
export function useOptimizedQuery<TData, TError = unknown>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> & {
    staleTime?: number;
    gcTime?: number;
    limit?: number;
  }
) {
  // Track if this component is still mounted
  const isMountedRef = useRef(true);
  
  // Default staleTime to 5 minutes to reduce refetches
  const defaultOptions = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options
  };
  
  // Set up cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // Add request timing logs
  const wrappedQueryFn = async () => {
    const startTime = performance.now();
    try {
      const result = await queryFn();
      const endTime = performance.now();
      console.debug(`Query ${queryKey[0]} took ${(endTime - startTime).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const endTime = performance.now();
      console.error(`Query ${queryKey[0]} failed after ${(endTime - startTime).toFixed(2)}ms`, error);
      throw error;
    }
  };
  
  return useQuery({
    queryKey,
    queryFn: wrappedQueryFn,
    ...defaultOptions
  });
}
