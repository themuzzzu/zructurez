import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingView } from "@/components/LoadingView";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          toast.error('Authentication error. Please sign in again.');
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
            navigate('/auth');
          }
          return;
        }

        if (mounted) {
          setIsAuthenticated(!!session);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
          toast.error('Error checking authentication status');
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setIsAuthenticated(false);
        queryClient.clear();
        navigate('/auth');
      } else if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setIsAuthenticated(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, queryClient]);

  if (isLoading) {
    return <LoadingView />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};