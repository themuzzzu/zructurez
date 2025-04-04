
import { supabase } from "@/integrations/supabase/client";
import { SecurityEventApi } from "./supabase/securityTypes";

/**
 * Utility for monitoring and logging security events related to API usage
 */

// Generate and store a request ID for tracking
const generateRequestId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// For tracking API rate limiting
const apiRequestCache: Record<string, { count: number, timestamp: number }> = {};

/**
 * Check if a user has exceeded the rate limit for an API endpoint
 * @param userId User ID
 * @param endpoint API endpoint path
 * @param limit Maximum requests per minute
 * @returns Whether the user has exceeded the rate limit
 */
export const checkRateLimit = (
  userId: string, 
  endpoint: string, 
  limit: number = 60
): boolean => {
  const key = `${userId}:${endpoint}`;
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  // Initialize or clean old entries
  if (!apiRequestCache[key] || apiRequestCache[key].timestamp < oneMinuteAgo) {
    apiRequestCache[key] = { count: 0, timestamp: now };
  }
  
  // Increment count
  apiRequestCache[key].count++;
  
  // Check if limit exceeded
  if (apiRequestCache[key].count > limit) {
    // Log rate limit violation
    logSecurityEvent(userId, 'rate_limit_exceeded', { 
      endpoint, 
      count: apiRequestCache[key].count,
      limit
    }, 'medium');
    
    return true;
  }
  
  return false;
};

/**
 * Validate API input to prevent injection attacks
 * @param input User input to validate
 * @param pattern Regex pattern to test against
 * @param userId User ID for logging
 * @returns Whether the input is valid
 */
export const validateApiInput = (
  input: string, 
  pattern: RegExp, 
  userId?: string
): boolean => {
  const isValid = pattern.test(input);
  
  if (!isValid && userId) {
    logSecurityEvent(userId, 'invalid_input_format', { 
      input: input.substring(0, 50), // Only log a portion for privacy
      pattern: pattern.toString()
    }, 'medium');
  }
  
  return isValid;
};

/**
 * Log suspicious API activity
 * @param userId User ID
 * @param activityType Type of suspicious activity
 * @param details Additional details
 */
export const logSuspiciousActivity = (
  userId: string, 
  activityType: string,
  details: any
): void => {
  logSecurityEvent(userId, 'suspicious_activity', {
    activity_type: activityType,
    ...details
  }, 'high');
};

/**
 * Log an API security event
 */
export const logSecurityEvent = async (
  userId: string | null, 
  eventType: string, 
  details: any = {}, 
  severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
): Promise<void> => {
  try {
    await SecurityEventApi.logEvent({
      user_id: userId,
      event_type: eventType,
      details,
      severity,
      activity_type: 'api',
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

/**
 * Validate that a user has permission to access an API endpoint
 * @param userId User ID
 * @param requiredRole Required role for access
 * @returns Whether the user has permission
 */
export const validateApiPermission = async (
  userId: string, 
  requiredRole: string
): Promise<boolean> => {
  try {
    // Check if the user has the required role
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', requiredRole)
      .maybeSingle();
    
    if (error) {
      console.error('Error validating API permission:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception in validateApiPermission:', error);
    return false;
  }
};
