
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
 */
export const checkUserRole = async (
  requiredRoles: string[]
): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      return false;
    }
    
    const { data: userRoles, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.session.user.id)
      .in('role', requiredRoles);
      
    if (error || !userRoles || userRoles.length === 0) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};

/**
 * Log security-related events for auditing
 */
export const logSecurityEvent = async (
  eventType: string,
  details: Record<string, any>
): Promise<void> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id || 'anonymous';
    
    await supabase.from('security_logs').insert({
      user_id: userId,
      event_type: eventType,
      details,
      ip_address: 'client-side', // Actual IP would be captured server-side
      user_agent: navigator.userAgent
    });
  } catch (error) {
    console.error('Error logging security event:', error);
  }
};

/**
 * Check for suspicious activity based on user behavior
 */
export const detectSuspiciousActivity = async (
  actionType: string
): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return false;
    
    const userId = session.session.user.id;
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    // Check frequency of this action type in last 5 minutes
    const { count, error } = await supabase
      .from('user_actions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('action_type', actionType)
      .gte('created_at', fiveMinutesAgo.toISOString());
      
    if (error) throw error;
    
    // If more than 30 of the same action in 5 minutes, flag as suspicious
    if (count && count > 30) {
      await logSecurityEvent('suspicious_activity', { 
        action_type: actionType,
        count,
        timeframe: '5 minutes'
      });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error detecting suspicious activity:', error);
    return false;
  }
};
