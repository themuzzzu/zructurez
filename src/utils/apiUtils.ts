
import { supabase } from "@/integrations/supabase/client";
import { RateLimitOptions } from "./rateLimiting";
import { validateRequest } from "./requestValidation";
import { z } from "zod";
import { toast } from "sonner";

// Updated version that doesn't rely on applyRateLimit
export const safeApiCall = async <TData, TResult>(
  endpoint: string,
  requestData: TData,
  schema: z.ZodSchema<TData>,
  apiCallFn: (data: TData) => Promise<TResult>,
  rateLimitOptions?: Partial<RateLimitOptions>
): Promise<TResult | null> => {
  try {
    // 1. Validate request data
    const validData = validateRequest(requestData, schema);
    if (!validData) {
      return null;
    }
    
    // 2. Get client info for rate limiting
    const { data: { user } } = await supabase.auth.getUser();
    const clientId = user?.id || 'anonymous-user';
    
    // 3. Apply manual rate limiting using the rateLimit function
    const now = Date.now();
    const windowMs = rateLimitOptions?.windowMs || 60000; // Default 1 minute
    const maxRequests = rateLimitOptions?.maxRequests || 5; // Default 5 requests
    const message = rateLimitOptions?.message || 'Rate limit exceeded. Please try again later.';
    
    const windowStart = now - windowMs;
    const key = `ratelimit:${clientId}:${endpoint}`;
    const requestTimesStr = localStorage.getItem(key) || '[]';
    let requestTimes: number[] = JSON.parse(requestTimesStr);
    
    // Filter request times to only include those within the current window
    requestTimes = requestTimes.filter(time => time > windowStart);
    
    if (requestTimes.length >= maxRequests) {
      toast.error(message);
      return null;
    }
    
    // Add the current request time and save
    requestTimes.push(now);
    localStorage.setItem(key, JSON.stringify(requestTimes));
    
    // 4. Execute the API call and measure performance
    const startTime = performance.now();
    const result = await apiCallFn(validData);
    const endTime = performance.now();
    
    // Log performance metrics
    console.log(`API call to ${endpoint} took ${endTime - startTime}ms`);
    
    return result;
  } catch (error) {
    // Handle errors
    console.error(`API call to ${endpoint} failed:`, error);
    toast.error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};

// Helper function to measure API call performance
export const measureApiCall = async <T>(
  endpoint: string, 
  fn: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  try {
    const result = await fn();
    const endTime = performance.now();
    console.log(`API call to ${endpoint} took ${endTime - startTime}ms`);
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`API call to ${endpoint} failed after ${endTime - startTime}ms:`, error);
    throw error;
  }
};
