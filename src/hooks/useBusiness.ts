
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Business } from "@/types/business";

export const useBusiness = (businessId: string) => {
  const {
    data: business,
    isLoading,
    error,
    refetch: refetchBusiness
  } = useQuery({
    queryKey: ['business', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          business_portfolio (*),
          business_products (*),
          posts (*)
        `)
        .eq('id', businessId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Business not found');
      
      return data as Business;
    },
    enabled: !!businessId
  });

  return {
    business,
    isLoading,
    error,
    refetchBusiness
  };
};
