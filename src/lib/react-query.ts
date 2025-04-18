
import { QueryClient } from "@tanstack/react-query";
import { measureApiCall } from "@/utils/performanceTracking";

// Create a query client with optimized configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Don't refetch on component mount
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

// Prefetch query data for common routes
export const prefetchCommonQueries = async () => {
  // Prefetch popular marketplace data
  queryClient.prefetchQuery({
    queryKey: ['sponsored-products'],
    queryFn: async () => {
      // Implementation depends on your data fetching logic
      return [];
    },
  });
  
  // Prefetch other common data
  // Add more prefetch calls as needed
};
