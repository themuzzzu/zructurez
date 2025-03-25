
import { toast } from "sonner";

export interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  message: string;
}

export const rateLimit = (
  clientId: string,
  options: RateLimitOptions
): boolean => {
  const now = Date.now();
  const windowStart = now - options.windowMs;
  
  // In a real implementation, this would use a persistent store
  // For now, use localStorage for demo purposes
  const key = `ratelimit:${clientId}`;
  const requestTimesStr = localStorage.getItem(key) || '[]';
  let requestTimes: number[] = JSON.parse(requestTimesStr);
  
  // Filter request times to only include those within the current window
  requestTimes = requestTimes.filter(time => time > windowStart);
  
  if (requestTimes.length >= options.maxRequests) {
    toast.error(options.message);
    return false;
  }
  
  // Add the current request time and save
  requestTimes.push(now);
  localStorage.setItem(key, JSON.stringify(requestTimes));
  
  return true;
};

// Helper function to get client IP or unique identifier
export const getClientIP = (): string => {
  // In a real app, this would get the actual client IP
  // For demo purposes, we'll return a random ID or use a stored one
  const storedClientId = localStorage.getItem('client_id');
  if (storedClientId) return storedClientId;
  
  const newClientId = Math.random().toString(36).substring(2, 15);
  localStorage.setItem('client_id', newClientId);
  return newClientId;
};

// Helper function to apply rate limiting easily
export const applyRateLimit = (
  identifier: string = getClientIP(),
  options: Partial<RateLimitOptions> = {}
): boolean => {
  const defaultOptions: RateLimitOptions = {
    maxRequests: 5,
    windowMs: 60000, // 1 minute
    message: 'Rate limit exceeded. Please try again later.',
  };

  return rateLimit(
    identifier,
    { ...defaultOptions, ...options }
  );
};
