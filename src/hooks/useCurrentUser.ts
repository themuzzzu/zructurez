import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/types/profile";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();
        
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }
      
      return profile as Profile | null;
    },
    retry: 1,
    meta: {
      errorMessage: "Error loading user data"
    }
  });
};