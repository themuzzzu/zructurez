
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const queryErrorHandler = (error: unknown) => {
  // Log to console
  console.error("Query error:", error);
  
  // You can customize error handling logic based on error type
  let errorMessage = "An unexpected error occurred";
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else if (error && typeof error === "object" && "message" in error) {
    errorMessage = String(error.message);
  }
  
  // Show toast notification
  toast.error(errorMessage, {
    description: "Please try again or contact support if this persists."
  });
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 15, // 15 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      throwOnError: false,
      meta: {
        errorHandler: queryErrorHandler,
      }
    },
    mutations: {
      retry: 1,
      throwOnError: false,
      meta: {
        errorHandler: queryErrorHandler,
      }
    },
  },
});
