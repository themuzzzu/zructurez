
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { validateRequest } from "./requestValidation";
import { z } from "zod";
import { rateLimit } from "./rateLimiting";

/**
 * Security utility to check if the current user has a specific role
 * @param role Role to check for
 * @returns Boolean indicating if user has the role
 */
export const hasRole = async (role: 'admin' | 'business_owner' | 'customer'): Promise<boolean> => {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    // Query user_roles table
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', role)
      .single();

    if (error) {
      console.error('Error checking user role:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in hasRole check:', error);
    return false;
  }
};

/**
 * Enforce content security by sanitizing HTML content
 * @param html HTML content to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
  // Basic sanitization - in production, use a library like DOMPurify
  return html
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;")
    .replace(/\(/g, "&#40;")
    .replace(/\)/g, "&#41;");
};

/**
 * Type for secure API endpoints with role-based validation
 */
export interface SecureEndpointOptions {
  requiredRole?: 'admin' | 'business_owner' | 'customer';
  rateLimitKey?: string;
  maxRequests?: number;
  windowMs?: number;
}

/**
 * Higher-order function to wrap API endpoint handlers with security checks
 * @param handler The API handler function
 * @param schema Zod schema for validating request data
 * @param options Security options including rate limiting and role requirements
 */
export const secureEndpoint = <T, R>(
  handler: (data: T, userId: string) => Promise<R>,
  schema: z.ZodSchema<T>,
  options: SecureEndpointOptions = {}
) => {
  return async (requestData: unknown): Promise<R | null> => {
    try {
      // 1. Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Authentication required');
        return null;
      }

      // 2. Role-based access control check
      if (options.requiredRole) {
        const hasRequiredRole = await hasRole(options.requiredRole);
        if (!hasRequiredRole) {
          toast.error('You do not have permission to perform this action');
          return null;
        }
      }

      // 3. Rate limiting
      if (options.rateLimitKey) {
        const rateLimitOptions = {
          windowMs: options.windowMs || 60000,
          maxRequests: options.maxRequests || 5,
          message: 'Too many requests, please try again later'
        };

        // Use user ID in rate limit key for per-user limiting
        const rateLimitKey = `${options.rateLimitKey}:${session.user.id}`;
        const allowed = rateLimit(rateLimitKey, rateLimitOptions);
        if (!allowed) return null;
      }

      // 4. Input validation using Zod
      const validData = validateRequest(requestData, schema);
      if (!validData) return null;

      // 5. Execute handler with validated data
      return await handler(validData, session.user.id);
    } catch (error) {
      console.error('Security check failed:', error);
      toast.error('Security error: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return null;
    }
  };
};

/**
 * Security helper to detect and prevent common attack attempts
 * @param input String to check for attack patterns
 * @returns Boolean indicating if the input appears malicious
 */
export const detectMaliciousInput = (input: string): boolean => {
  if (!input) return false;
  
  // Check for common SQL injection patterns
  const sqlInjectionPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i
  ];
  
  // Check for XSS attack patterns
  const xssPatterns = [
    /<script.*?>.*?<\/script>/i,
    /src[\r\n]*=[\r\n]*\\\'(.*?)\\\'/i,
    /src[\r\n]*=[\r\n]*\\\"(.*?)\\\"/i,
    /\<script/i,
    /javascript/i,
    /onerror/i,
    /onload/i,
    /eval\(/i,
    /expression\(/i
  ];
  
  // Check all patterns
  const allPatterns = [...sqlInjectionPatterns, ...xssPatterns];
  return allPatterns.some(pattern => pattern.test(input));
};

/**
 * Clean input data by trimming and checking for malicious patterns
 * @param input String to clean
 * @returns Cleaned string or null if input is malicious
 */
export const cleanInput = (input: string): string | null => {
  if (!input) return "";
  
  const trimmed = input.trim();
  if (detectMaliciousInput(trimmed)) {
    console.warn('Potentially malicious input detected:', input);
    return null;
  }
  
  return trimmed;
};
