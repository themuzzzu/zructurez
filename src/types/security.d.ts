
// Type definitions for security-related functionality
import { z } from 'zod';

declare global {
  interface Window {
    DOMPurify: import('dompurify').DOMPurify;
  }
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SecurityUtils {
  sanitizeHtml: (html: string) => string;
  validateUserInput: <T>(data: unknown, schema: z.ZodSchema<T>) => ValidationResult<T>;
  isSessionValid: () => boolean;
  addCsrfToken: (headers: Record<string, string>) => Record<string, string>;
  rateLimit: (key: string, maxRequests: number, timeWindowMs: number) => boolean;
}
