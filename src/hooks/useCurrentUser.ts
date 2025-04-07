
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/types/profile";
import { useAuth } from "./useAuth";

export const useCurrentUser = () => {
  const { user, loading: authLoading, refreshSession } = useAuth();
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        if (!user) {
          // Try to refresh the session if user is null
          const refreshed = await refreshSession();
          if (!refreshed) return null;
        }
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .maybeSingle();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast.error("Failed to load your profile data");
          return null;
        }
        
        return profile as Profile | null;
      } catch (error) {
        console.error('Unexpected error in useCurrentUser:', error);
        toast.error("Something went wrong while loading your profile");
        return null;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !authLoading && !!user?.id,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      errorMessage: "Error loading user data"
    }
  });
};
