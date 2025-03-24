
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { toast } from "sonner";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshError, setRefreshError] = useState<Error | null>(null);

  // Function to refresh session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Session refresh error:', error);
        setRefreshError(error);
        return false;
      }
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
      return true;
    } catch (error) {
      console.error('Unexpected error during session refresh:', error);
      setRefreshError(error as Error);
      return false;
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          setRefreshError(error);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Unexpected error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auto refresh timer
    const refreshTimer = setInterval(() => {
      if (session) {
        refreshSession();
      }
    }, 55 * 60 * 1000); // Refresh 5 minutes before the default 1-hour expiry

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      clearInterval(refreshTimer);
      subscription.unsubscribe();
    };
  }, [session]);

  return { 
    user, 
    session,
    loading, 
    refreshError,
    refreshSession 
  };
};
