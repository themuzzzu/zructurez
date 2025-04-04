
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { hasRole } from "@/utils/securityUtils";
import { LoadingView } from "@/components/LoadingView";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'admin' | 'business_owner' | 'customer';
  redirectPath?: string;
}

export const RoleProtectedRoute = ({ 
  children, 
  requiredRole,
  redirectPath = '/auth'
}: RoleProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // If no session, user is not authenticated
        if (!session) {
          if (mounted) {
            setIsAuthorized(false);
            setIsLoading(false);
          }
          return;
        }
        
        // Check if user has the required role
        const hasRequiredRole = await hasRole(requiredRole);
        
        if (mounted) {
          setIsAuthorized(hasRequiredRole);
          setIsLoading(false);
        }
        
        if (!hasRequiredRole) {
          toast.error(`Access denied: ${requiredRole} role required`);
        }
      } catch (error) {
        console.error('Error checking role access:', error);
        if (mounted) {
          setIsAuthorized(false);
          setIsLoading(false);
        }
        toast.error('Error checking permissions');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthorized(false);
        queryClient.clear();
        navigate('/auth');
      } else if (event === 'SIGNED_IN' && session) {
        // Recheck role when user signs in
        checkAccess();
      }
    });

    checkAccess();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, queryClient, requiredRole, redirectPath]);

  if (isLoading) {
    return <LoadingView />;
  }

  if (!isAuthorized) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
