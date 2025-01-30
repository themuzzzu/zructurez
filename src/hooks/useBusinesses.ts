import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Business } from "@/types/business";

export const useBusinesses = (userId?: string) => {
  return useQuery({
    queryKey: ['businesses', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching businesses:', error);
        return [];
      }

      return (data || []) as Business[];
    },
    enabled: !!userId,
  });
};