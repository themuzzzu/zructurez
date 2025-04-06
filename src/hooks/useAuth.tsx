
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { toast } from "sonner";
import { globalCache } from '@/utils/cacheUtils';

// Session cache key
const SESSION_CACHE_KEY = 'current-session';
// Time window before session expiry when we should refresh (5 minutes)
const REFRESH_MARGIN = 5 * 60; // in seconds

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  refreshError: Error | null;
  refreshSession: () => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  refreshError: null,
  refreshSession: async () => false,
  signOut: async () => {}
});

// Create a single auth subscription that components can share
let authSubscription: { unsubscribe: () => void } | null = null;
let authSubscribers = 0;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshError, setRefreshError] = useState<Error | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);

  // Check if session needs refresh based on expiry time
  const needsRefresh = useCallback((currentSession: Session | null): boolean => {
    if (!currentSession) return false;
    
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = currentSession.expires_at;
    
    // Refresh if within 5 minutes of expiration or if token is already expired
    return !expiresAt || expiresAt - now < REFRESH_MARGIN;
  }, []);

  // Refresh session implementation - optimized to prevent redundant refreshes
  const refreshSession = useCallback(async () => {
    const now = Date.now();
    
    // Prevent multiple refreshes within a short time window (10 seconds)
    if (now - lastRefreshTime < 10000) {
      console.debug('Skipping refresh - too soon since last refresh');
      return !!session;
    }
    
    try {
      setLastRefreshTime(now);
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        setRefreshError(error);
        return false;
      }
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        
        // Update cache
        globalCache.set(SESSION_CACHE_KEY, data.session, 
          ((data.session.expires_at || 0) - Math.floor(Date.now() / 1000)) * 1000);
      }
      
      return !!data.session;
    } catch (error) {
      console.error('Unexpected error during session refresh:', error);
      setRefreshError(error as Error);
      return false;
    }
  }, [session, lastRefreshTime]);

  // Sign out function
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    globalCache.delete(SESSION_CACHE_KEY);
  }, []);
  
  // Set up session checking and auth subscription
  useEffect(() => {
    let mounted = true;
    let sessionCheckTimerId: number | undefined;
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true);
        
        // Check cache first
        const cachedSession = globalCache.get<Session>(SESSION_CACHE_KEY);
        if (cachedSession && !needsRefresh(cachedSession)) {
          console.debug('Using cached session');
          if (mounted) {
            setSession(cachedSession);
            setUser(cachedSession.user);
            setLoading(false);
          }
          return;
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          setRefreshError(error);
        }
        
        if (mounted) {
          if (session) {
            setSession(session);
            setUser(session.user);
            
            // Cache the session
            const ttlMs = ((session.expires_at || 0) - Math.floor(Date.now() / 1000)) * 1000;
            globalCache.set(SESSION_CACHE_KEY, session, ttlMs > 0 ? ttlMs : 3600 * 1000);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        if (mounted) setLoading(false);
      }
    };

    // Set up auth state change subscription only if it doesn't exist
    if (!authSubscription) {
      authSubscription = supabase.auth.onAuthStateChange((event, newSession) => {
        // Defer state updates to avoid Supabase auth deadlock issues
        setTimeout(() => {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // Update cache if we have a session
          if (newSession) {
            const ttlMs = ((newSession.expires_at || 0) - Math.floor(Date.now() / 1000)) * 1000;
            globalCache.set(SESSION_CACHE_KEY, newSession, ttlMs > 0 ? ttlMs : 3600 * 1000);
          } else {
            globalCache.delete(SESSION_CACHE_KEY);
          }
          
          // For certain events, we need additional actions
          if (event === 'SIGNED_OUT') {
            // Clear cache when signed out
            globalCache.delete(SESSION_CACHE_KEY);
          }
        }, 0);
      });
    }
    authSubscribers++;

    // Set up periodic session check if we have a session
    const setupSessionCheck = () => {
      // Clear any existing timer
      if (sessionCheckTimerId) {
        clearInterval(sessionCheckTimerId);
      }
      
      // Only set up timer if we have a session
      if (session) {
        // Check every 5 minutes instead of every minute
        sessionCheckTimerId = window.setInterval(() => {
          if (session && needsRefresh(session)) {
            refreshSession();
          }
        }, 5 * 60 * 1000); // Every 5 minutes
      }
    };
    
    getInitialSession();
    setupSessionCheck();

    // Clean up
    return () => {
      mounted = false;
      if (sessionCheckTimerId) clearInterval(sessionCheckTimerId);
      
      // Only unsubscribe when the last subscriber is removed
      authSubscribers--;
      if (authSubscription && authSubscribers === 0) {
        authSubscription.unsubscribe();
        authSubscription = null;
      }
    };
  }, [refreshSession, needsRefresh]);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      refreshError,
      refreshSession,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
