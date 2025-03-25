
export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message: string;
}

/**
 * Applies rate limiting to a client request
 * @param clientId - The identifier for the client
 * @param endpoint - The API endpoint being accessed
 * @param options - Rate limiting options
 * @returns boolean - True if request is allowed, false if rate limited
 */
export const applyRateLimit = (
  clientId: string,
  endpoint: string,
  options: Partial<RateLimitOptions> = {}
): boolean => {
  const windowMs = options.windowMs || 60000; // Default 1 minute
  const maxRequests = options.maxRequests || 5; // Default 5 requests
  
  const now = Date.now();
  const windowStart = now - windowMs;
  const key = `ratelimit:${clientId}:${endpoint}`;
  
  // Get existing request timestamps from storage
  const requestTimesStr = localStorage.getItem(key) || '[]';
  let requestTimes = JSON.parse(requestTimesStr) as number[];
  
  // Filter request times to only include those within the current window
  requestTimes = requestTimes.filter(time => time > windowStart);
  
  // Check if rate limit exceeded
  if (requestTimes.length >= maxRequests) {
    return false;
  }
  
  // Add the current request time and save
  requestTimes.push(now);
  localStorage.setItem(key, JSON.stringify(requestTimes));
  
  return true;
};

/**
 * Utility to get an identifier for the client
 */
export const getClientIP = (): string => {
  // In a browser context, we don't have access to IP
  // Use a random identifier stored in localStorage as fallback
  let clientId = localStorage.getItem('client_id');
  if (!clientId) {
    clientId = `browser_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('client_id', clientId);
  }
  return clientId;
};
