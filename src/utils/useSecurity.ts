
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authMiddleware, checkUserRole } from '@/utils/securityMiddleware';
import { globalCache } from '@/utils/cacheUtils';

/**
 * Custom hook to centralize security checks and avoid redundant verifications
 */
export function useSecurity(requiredRoles: string[] = []) {
  const { user, session } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      if (!user || !session) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Use cached results when possible
        const cacheKey = `auth:${user.id}:${requiredRoles.join(',')}`;
        const cachedResult = globalCache.get<boolean>(cacheKey);
        
        if (cachedResult !== null) {
          setIsAuthorized(cachedResult);
          setIsLoading(false);
          return;
        }
        
        // Only perform the checks if no cached result exists
        const isAuthenticated = await authMiddleware();
        
        if (!isAuthenticated) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }
        
        // Only check roles if we have required roles
        let hasRequiredRoles = true;
        if (requiredRoles.length > 0) {
          hasRequiredRoles = await checkUserRole(requiredRoles);
        }
        
        setIsAuthorized(hasRequiredRoles);
        
        // Cache the result for 10 minutes
        globalCache.set(cacheKey, hasRequiredRoles, 10 * 60 * 1000);
      } catch (error) {
        console.error('Error checking authorization:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [user?.id, session?.access_token, requiredRoles.join(',')]);
  
  return { isAuthorized, isLoading };
}
