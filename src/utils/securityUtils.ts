
import DOMPurify from 'dompurify';
import { z } from 'zod';

/**
 * Sanitizes HTML to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
};

/**
 * Validates and sanitizes user input using Zod
 */
export const validateUserInput = <T>(
  data: unknown,
  schema: z.ZodSchema<T>
): { success: boolean; data?: T; error?: string } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors.map(e => e.message).join(', ') 
      };
    }
    return { success: false, error: 'Validation failed' };
  }
};

/**
 * Checks if the current session token is valid
 */
export const isSessionValid = (): boolean => {
  const tokenExpiry = localStorage.getItem('token_expiry');
  if (!tokenExpiry) return false;
  
  return parseInt(tokenExpiry, 10) > Date.now();
};

/**
 * Helper to set secure cookies with HttpOnly, SameSite, etc.
 * Note: This is just a reference for backend implementation
 */
export const setSecureCookie = (name: string, value: string, days: number): void => {
  // For frontend reference only - this would need to be implemented on the server
  console.info(`Secure cookie would be set: ${name}=${value} (${days} days)`);
  
  // The actual implementation would look something like this on the server:
  /*
  res.cookie(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: days * 24 * 60 * 60 * 1000
  });
  */
};

/**
 * Adds CSRF token to requests
 */
export const addCsrfToken = (headers: Record<string, string>): Record<string, string> => {
  const csrfToken = sessionStorage.getItem('csrf-token');
  if (csrfToken) {
    return {
      ...headers,
      'X-CSRF-Token': csrfToken
    };
  }
  return headers;
};

/**
 * Rate limiting implementation for client-side
 */
export const rateLimit = (
  key: string,
  maxRequests: number,
  timeWindowMs: number
): boolean => {
  const now = Date.now();
  const storageKey = `ratelimit:${key}`;
  
  // Get existing timestamps from storage
  const storedValue = localStorage.getItem(storageKey);
  const timestamps: number[] = storedValue ? JSON.parse(storedValue) : [];
  
  // Filter out timestamps outside of our window
  const validTimestamps = timestamps.filter(time => time > now - timeWindowMs);
  
  // Check if we've exceeded the rate limit
  if (validTimestamps.length >= maxRequests) {
    return false;
  }
  
  // Add the current timestamp and save back to storage
  validTimestamps.push(now);
  localStorage.setItem(storageKey, JSON.stringify(validTimestamps));
  
  return true;
};
