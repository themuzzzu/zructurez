import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingView } from "@/components/LoadingView";
import { useQueryClient } from "@tanstack/react-query";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setIsAuthenticated(!!session);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        queryClient.clear();
      } else if (event === 'SIGNED_IN') {
        setIsAuthenticated(!!session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  if (isLoading) {
    return <LoadingView />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};