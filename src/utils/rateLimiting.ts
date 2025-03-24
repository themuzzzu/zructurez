
import { toast } from "sonner";

// Simple in-memory storage for rate limiting
// In a production environment, consider using Redis or another persistent store
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipLimits: Map<string, RateLimitRecord> = new Map();

// Configuration options for rate limiting
export interface RateLimitOptions {
  maxRequests: number;   // Maximum number of requests allowed
  windowMs: number;      // Time window in milliseconds
  message?: string;      // Optional custom message
}

// Default options
const defaultOptions: RateLimitOptions = {
  maxRequests: 100,      // 100 requests
  windowMs: 60 * 1000,   // per minute
  message: "Too many requests, please try again later."
};

/**
 * Rate limiting middleware function
 * @param identifier Unique identifier (usually IP address)
 * @param options Rate limiting options
 * @returns Boolean indicating if the request should proceed
 */
export const rateLimit = (
  identifier: string, 
  options: Partial<RateLimitOptions> = {}
): boolean => {
  const config = { ...defaultOptions, ...options };
  const now = Date.now();
  
  // Get existing record or create new one
  let record = ipLimits.get(identifier);
  
  if (!record || now > record.resetAt) {
    // Create new record if expired or doesn't exist
    record = {
      count: 0,
      resetAt: now + config.windowMs
    };
  }
  
  // Increment request count
  record.count++;
  ipLimits.set(identifier, record);
  
  // Check if limit exceeded
  if (record.count > config.maxRequests) {
    // Show toast message for user feedback
    toast.error(config.message);
    
    // Cleanup old records periodically (basic memory management)
    if (ipLimits.size > 10000) {
      const expired = now - config.windowMs * 2; // Clear older than 2x window
      for (const [key, value] of ipLimits.entries()) {
        if (value.resetAt < expired) {
          ipLimits.delete(key);
        }
      }
    }
    
    return false; // Rate limit exceeded
  }
  
  return true; // Request allowed
};

// Helper to extract IP address from request
export const getClientIP = (req: Request): string => {
  // In a browser context, we might not have access to client IP
  // This is a simplified version - in production, you'd get this from headers
  // For example, from X-Forwarded-For or similar
  return req.headers.get('x-forwarded-for') || 
         'browser-client'; // Fallback identifier
};

// Example usage in API calls
export const applyRateLimit = async <T>(
  apiCall: () => Promise<T>,
  identifier: string = 'default',
  options?: Partial<RateLimitOptions>
): Promise<T> => {
  if (!rateLimit(identifier, options)) {
    throw new Error("Rate limit exceeded");
  }
  
  return await apiCall();
};
