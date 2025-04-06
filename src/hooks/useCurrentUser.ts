
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/types/profile";
import { useAuth } from "./useAuth";

// Query key for current user data
const CURRENT_USER_QUERY_KEY = ['currentUser'];

export const useCurrentUser = () => {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: async () => {
      try {
        if (!user?.id) {
          return null;
        }
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // Only show error toast once, not on every retry
          if (!queryClient.getQueryState(CURRENT_USER_QUERY_KEY)?.error) {
            toast.error("Failed to load your profile data");
          }
          throw profileError;
        }
        
        return profile as Profile | null;
      } catch (error) {
        console.error('Unexpected error in useCurrentUser:', error);
        return null;
      }
    },
    retry: 1, // Reduced from 2
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Reduced max delay
    enabled: !authLoading && !!user?.id,
    refetchOnWindowFocus: false, // Disable refetch on window focus
    staleTime: 15 * 60 * 1000, // 15 minutes (increased from 5 minutes)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Helper function to prefetch user data (can be used after login)
export const prefetchUserProfile = async (userId: string) => {
  if (!userId) return;
  
  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (data) {
      const queryClient = new QueryClient();
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, data);
    }
  } catch (error) {
    console.error('Error prefetching user profile:', error);
  }
};
