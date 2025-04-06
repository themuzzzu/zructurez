
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LoadingView } from "@/components/LoadingView";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth"; // Use our centralized auth hook

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading, session } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // We now use our centralized auth hook instead of directly checking supabase
  useEffect(() => {
    if (!authLoading) {
      setIsLoading(false);
      
      if (!user && !session) {
        // Only show toast if this was an unexpected session loss
        if (localStorage.getItem('had_session') === 'true') {
          toast.error('Your session has expired. Please sign in again.');
          localStorage.removeItem('had_session');
        }
        queryClient.clear();
      } else if (user && session) {
        localStorage.setItem('had_session', 'true');
      }
    }
  }, [authLoading, user, session, queryClient]);

  if (isLoading || authLoading) {
    return <LoadingView />;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
