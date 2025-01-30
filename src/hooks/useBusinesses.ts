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
        .select(`
          *,
          business_portfolio (*),
          business_products (*),
          posts (*)
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching businesses:', error);
        return [];
      }

      return data.map((business): Business => ({
        ...business,
        staff_details: Array.isArray(business.staff_details) 
          ? business.staff_details 
          : [],
        owners: Array.isArray(business.owners)
          ? business.owners
          : [],
        image_position: typeof business.image_position === 'object' 
          ? {
              x: Number(business.image_position.x) || 50,
              y: Number(business.image_position.y) || 50
            }
          : { x: 50, y: 50 },
        verification_documents: Array.isArray(business.verification_documents)
          ? business.verification_documents
          : [],
        membership_plans: Array.isArray(business.membership_plans)
          ? business.membership_plans
          : [],
        business_portfolio: business.business_portfolio || [],
        business_products: business.business_products || [],
        posts: business.posts || []
      }));
    },
    enabled: !!userId,
  });
};