
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
      
      // Parse the data and ensure it matches the Business type
      const parsedBusiness: Business = {
        ...data,
        staff_details: Array.isArray(data.staff_details) 
          ? data.staff_details 
          : [],
        owners: Array.isArray(data.owners)
          ? data.owners
          : [],
        image_position: typeof data.image_position === 'object' 
          ? { 
              x: Number(data.image_position.x) || 50, 
              y: Number(data.image_position.y) || 50 
            } 
          : { x: 50, y: 50 },
        verification_documents: Array.isArray(data.verification_documents) 
          ? data.verification_documents 
          : [],
        membership_plans: Array.isArray(data.membership_plans)
          ? data.membership_plans
          : [],
        business_portfolio: data.business_portfolio || [],
        business_products: data.business_products || [],
        posts: data.posts || [],
        owner_id: data.user_id // Map user_id as owner_id for permission checks
      };

      return parsedBusiness;
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
