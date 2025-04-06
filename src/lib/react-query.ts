
import { QueryClient } from "@tanstack/react-query";
import { measureApiCall } from "@/utils/performanceTracking";

// Create a query client with heavily optimized configuration to reduce API calls
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes (increased from 5 minutes)
      gcTime: 30 * 60 * 1000, // 30 minutes (increased from 10 minutes)
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Reduced max delay
      refetchOnWindowFocus: false, // Disable automatic refetching on window focus
      refetchOnMount: false, // Don't refetch on component mount
      refetchOnReconnect: false, // Don't refetch on reconnect
    },
  },
});

// Helper to create optimized query keys with proper structure
export const createQueryKey = (base: string, params?: Record<string, any>): any[] => {
  if (!params) return [base];
  return [base, params];
};

// Track performance of queries
export const trackQueryPerformance = <T>(
  queryFn: () => Promise<T>,
  queryName: string
): (() => Promise<T>) => {
  return () => measureApiCall(queryName, queryFn);
};

// Prefetch query data for common routes - use this intelligently
export const prefetchCommonQueries = async () => {
  // Prefetch only essential data, not everything
  queryClient.prefetchQuery({
    queryKey: ['sponsored-products'],
    queryFn: async () => {
      // Implementation depends on your data fetching logic
      return [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
  
  // Add more strategic prefetches as needed
};

// Helper for deduplicating identical requests occurring simultaneously
const pendingQueries = new Map<string, Promise<any>>();

export const deduplicateQuery = async <T>(
  key: string,
  queryFn: () => Promise<T>
): Promise<T> => {
  // If this query is already in progress, return the existing promise
  if (pendingQueries.has(key)) {
    return pendingQueries.get(key) as Promise<T>;
  }
  
  // Create and store the promise
  const promise = queryFn().finally(() => {
    // Remove from pending queries when done
    pendingQueries.delete(key);
  });
  
  pendingQueries.set(key, promise);
  return promise;
};
