import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error checking session:', error);
        toast.error("Session error. Please sign in again.");
        navigate('/auth');
        return;
      }
      setSession(session);
      setLoading(false);
    });

    // Set up real-time session listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
        queryClient.clear(); // Clear query cache on logout
      } else if (event === 'SIGNED_IN' && session) {
        // Verify the session is valid
        const { error: sessionError } = await supabase.auth.getUser();
        if (sessionError) {
          console.error('Session verification failed:', sessionError);
          toast.error("Session expired. Please sign in again.");
          navigate('/auth');
          return;
        }
      }
      setSession(session);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, queryClient]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  // Redirect to auth if no session
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};