
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { SecurityEventApi, UserRoleApi } from '@/utils/supabase/securityTypes';

// Define the context types
type SecurityContextType = {
  hasRole: (role: string) => boolean;
  userRoles: string[];
  isRolesLoading: boolean;
  logSecurityEvent: (eventType: string, details?: any, severity?: 'low' | 'medium' | 'high' | 'critical') => Promise<void>;
};

// Create the context with a default value
const SecurityContext = createContext<SecurityContextType>({
  hasRole: () => false,
  userRoles: [],
  isRolesLoading: true,
  logSecurityEvent: async () => {},
});

// Custom hook to access the security context
export const useSecurity = () => useContext(SecurityContext);

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isRolesLoading, setIsRolesLoading] = useState(true);
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  // Generate a basic browser fingerprint
  useEffect(() => {
    const generateFingerprint = () => {
      const fpData = [
        navigator.userAgent,
        navigator.language,
        screen.width,
        screen.height,
        new Date().getTimezoneOffset(),
        !!navigator.cookieEnabled,
      ].join('|');
      
      // Use a simple hash function for demonstration
      // In production, consider a more robust fingerprinting library
      let hash = 0;
      for (let i = 0; i < fpData.length; i++) {
        const char = fpData.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      
      return hash.toString(16);
    };
    
    setFingerprint(generateFingerprint());
  }, []);

  // Fetch user roles when user changes
  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) {
        setUserRoles([]);
        setIsRolesLoading(false);
        return;
      }
      
      try {
        setIsRolesLoading(true);
        const { data, error } = await UserRoleApi.getUserRoles(user.id);
        
        if (error) {
          console.error('Error fetching user roles:', error);
          return;
        }
        
        // Extract role names from the response
        if (data) {
          setUserRoles(data.map(role => role.role));
        }
      } catch (error) {
        console.error('Error in role fetching:', error);
      } finally {
        setIsRolesLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  // Log login and logout events
  useEffect(() => {
    // Log login event
    if (user) {
      logSecurityEvent('user_login');
    }

    // Cleanup function to log logout event
    return () => {
      if (user) {
        logSecurityEvent('user_logout');
      }
    };
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Log a security event
  const logSecurityEvent = async (
    eventType: string,
    details?: any,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ) => {
    if (!user && eventType !== 'auth_error' && eventType !== 'anonymous_access') {
      return; // Only log events for authenticated users (with exceptions)
    }
    
    try {
      const ipAddress = 'Not available in browser'; // In real app, this would come from your server
      
      await SecurityEventApi.logEvent({
        user_id: user?.id || null,
        event_type: eventType,
        browser_fingerprint: fingerprint || undefined,
        ip_address: ipAddress,
        details: details || {},
        severity,
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  // Check if the user has a specific role
  const hasRole = (role: string): boolean => {
    return userRoles.includes(role);
  };

  // Create the context value
  const contextValue: SecurityContextType = {
    hasRole,
    userRoles,
    isRolesLoading,
    logSecurityEvent,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};
