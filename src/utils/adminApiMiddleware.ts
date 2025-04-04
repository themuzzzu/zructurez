
import { supabase } from "@/integrations/supabase/client";
import { AdminAuditApi } from "./supabase/securityTypes";

/**
 * Middleware utilities for admin API endpoints
 */

// Track sensitive operations for additional verification
const sensitiveOperations: Record<string, { count: number, lastAttempt: number }> = {};

/**
 * Log an admin action for audit purposes
 */
export const logAdminAction = async (
  adminId: string, 
  action: string, 
  entityType: string, 
  entityId?: string,
  beforeState?: any,
  afterState?: any
): Promise<void> => {
  try {
    // Get IP address (in a real implementation, this would come from the request)
    const ipAddress = "Not available in browser"; // Placeholder
    
    await AdminAuditApi.logAction({
      admin_id: adminId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      before_state: beforeState,
      after_state: afterState,
      ip_address: ipAddress
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
};

/**
 * Check for a sequence of suspicious admin actions
 * This helps detect potential account takeover or misuse
 */
export const checkSuspiciousAdminActivity = (
  adminId: string, 
  action: string
): boolean => {
  const now = Date.now();
  const key = `${adminId}:${action}`;
  const suspiciousThreshold = 5; // Number of actions in short period to be suspicious
  const timeWindow = 300000; // 5 minutes in milliseconds
  
  // Initialize if not exists
  if (!sensitiveOperations[key]) {
    sensitiveOperations[key] = { count: 0, lastAttempt: now };
  }
  
  // Reset counter if outside time window
  if (now - sensitiveOperations[key].lastAttempt > timeWindow) {
    sensitiveOperations[key] = { count: 1, lastAttempt: now };
    return false;
  }
  
  // Increment counter
  sensitiveOperations[key].count += 1;
  sensitiveOperations[key].lastAttempt = now;
  
  // Check if exceeds threshold
  if (sensitiveOperations[key].count > suspiciousThreshold) {
    logAdminAction(
      adminId,
      "suspicious_activity_detected",
      "admin_actions",
      undefined,
      { action, count: sensitiveOperations[key].count }
    );
    return true;
  }
  
  return false;
};

/**
 * Verify admin has proper permissions for an action
 */
export const verifyAdminPermission = async (
  adminId: string, 
  requiredPermission: string
): Promise<boolean> => {
  try {
    // In a more complex system, you might have a separate admin_permissions table
    // For simplicity, we'll just check if they have the admin role
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', adminId)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (error) {
      console.error("Error verifying admin permission:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Exception in verifyAdminPermission:", error);
    return false;
  }
};

/**
 * Create an API key for admin actions
 * This would be a more secure way to authenticate admin API requests
 */
export const createAdminApiKey = async (adminId: string, expiry: number): Promise<string | null> => {
  try {
    // Generate a secure token
    const token = Array(30)
      .fill(0)
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('');
    
    // Store in database
    const { error } = await supabase
      .from('admin_api_keys')
      .insert({
        admin_id: adminId,
        key: token,
        expires_at: new Date(Date.now() + expiry).toISOString(),
      });
    
    if (error) {
      console.error("Error creating admin API key:", error);
      return null;
    }
    
    return token;
  } catch (error) {
    console.error("Exception in createAdminApiKey:", error);
    return null;
  }
};

/**
 * Validate an admin API key
 */
export const validateAdminApiKey = async (apiKey: string): Promise<string | null> => {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('admin_api_keys')
      .select('admin_id')
      .eq('key', apiKey)
      .gt('expires_at', now)
      .maybeSingle();
    
    if (error || !data) {
      return null;
    }
    
    return data.admin_id;
  } catch (error) {
    console.error("Exception in validateAdminApiKey:", error);
    return null;
  }
};
