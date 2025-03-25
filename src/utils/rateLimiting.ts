
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
