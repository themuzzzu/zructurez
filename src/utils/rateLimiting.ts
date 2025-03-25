
import { toast } from "sonner";

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message: string;
}

/**
 * Rate limiter utility to prevent excessive API calls
 * @param key Unique identifier for the rate limit (e.g., endpoint name)
 * @param options Configuration options for rate limiting
 * @returns Boolean indicating if the request is allowed (true) or rate limited (false)
 */
export const rateLimit = (
  key: string, 
  options: Partial<RateLimitOptions> = {}
): boolean => {
  // Default options
  const windowMs = options.windowMs || 60000; // Default: 1 minute window
  const maxRequests = options.maxRequests || 5; // Default: 5 requests per window
  const message = options.message || "Too many requests, please try again later.";
  
  // Get the current time
  const now = Date.now();
  
  // Create a storage key specific to this rate limit
  const storageKey = `ratelimit:${key}`;
  
  // Get existing timestamps from local storage
  const storedData = localStorage.getItem(storageKey);
  let timestamps: number[] = storedData ? JSON.parse(storedData) : [];
  
  // Filter out timestamps that are outside the current window
  const windowStart = now - windowMs;
  timestamps = timestamps.filter(timestamp => timestamp > windowStart);
  
  // Check if rate limit exceeded
  if (timestamps.length >= maxRequests) {
    // Show toast warning to user
    toast.error(message);
    
    // Return false to indicate the request should be blocked
    return false;
  }
  
  // Add current timestamp and save back to storage
  timestamps.push(now);
  localStorage.setItem(storageKey, JSON.stringify(timestamps));
  
  // Return true to indicate the request should proceed
  return true;
};

/**
 * Helper function to clear all rate limit data (useful for testing)
 */
export const clearRateLimitHistory = (): void => {
  // Find and remove all rate limit entries in localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('ratelimit:')) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Helper to check remaining requests in the current window
 * @param key Unique identifier for the rate limit
 * @param options Configuration options (same as rateLimit)
 * @returns Object with count and remaining requests
 */
export const getRateLimitStatus = (
  key: string, 
  options: Partial<RateLimitOptions> = {}
): { used: number; remaining: number; reset: number } => {
  const windowMs = options.windowMs || 60000;
  const maxRequests = options.maxRequests || 5;
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Get timestamps from storage
  const storageKey = `ratelimit:${key}`;
  const storedData = localStorage.getItem(storageKey);
  const timestamps: number[] = storedData 
    ? JSON.parse(storedData).filter((ts: number) => ts > windowStart)
    : [];
  
  // Calculate reset time in milliseconds
  let resetTime = windowMs;
  if (timestamps.length > 0) {
    // Find the oldest timestamp and calculate when its window expires
    const oldest = Math.min(...timestamps);
    resetTime = Math.max(0, oldest + windowMs - now);
  }
  
  return {
    used: timestamps.length,
    remaining: Math.max(0, maxRequests - timestamps.length),
    reset: Math.ceil(resetTime / 1000) // Reset time in seconds
  };
};
