
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Helper function to handle unauthorized attempts
 */
const handleUnauthorized = () => {
  toast.error('Unauthorized access. Please log in again.');
  supabase.auth.signOut();
  window.location.href = '/auth';
};

/**
 * Middleware to check user authentication before making API requests
 */
export const authMiddleware = async () => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session?.session) {
    handleUnauthorized();
    return false;
  }
  
  // Check token expiration
  const { expires_at } = session.session;
  if (expires_at && expires_at < Math.floor(Date.now() / 1000)) {
    handleUnauthorized();
    return false;
  }
  
  return true;
};

/**
 * Helper to enforce role-based access control
 * Note: This is a stub implementation since user_roles table doesn't exist yet
 * This should be implemented properly when the user_roles table is created
 */
export const checkUserRole = async (
  requiredRoles: string[]
): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      return false;
    }
    
    // Since user_roles table doesn't exist, we'll simply return true for now
    // This should be replaced with actual role checking logic when the table is created
    console.log('Role check requested for:', requiredRoles);
    
    return true;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};

/**
 * Log security-related events for auditing
 * Note: This is a stub implementation since security_logs table doesn't exist yet
 */
export const logSecurityEvent = async (
  eventType: string,
  details: Record<string, any>
): Promise<void> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id || 'anonymous';
    
    // Since security_logs table doesn't exist, we'll simply log to console
    console.log('Security event logged:', {
      user_id: userId,
      event_type: eventType,
      details,
      ip_address: 'client-side',
      user_agent: navigator.userAgent
    });
  } catch (error) {
    console.error('Error logging security event:', error);
  }
};

/**
 * Check for suspicious activity based on user behavior
 * Note: This is a stub implementation since user_actions table doesn't exist yet
 */
export const detectSuspiciousActivity = async (
  actionType: string
): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return false;
    
    const userId = session.session.user.id;
    
    // Since user_actions table doesn't exist, we'll simply log and return false
    console.log('Suspicious activity check for:', {
      user_id: userId,
      action_type: actionType,
      timestamp: new Date().toISOString()
    });
    
    return false;
  } catch (error) {
    console.error('Error detecting suspicious activity:', error);
    return false;
  }
};
