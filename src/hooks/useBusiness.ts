
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
      
      // Type assertions to ensure proper type conversions
      const parsedBusiness: Business = {
        ...data,
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zip: data.zip || '',
        phone: data.phone || '',
        email: data.email || '',
        sub_category: data.sub_category || '',
        logo_url: data.logo_url || '',
        ratings: data.ratings || 0,
        reviews_count: data.reviews_count || 0,
        is_verified: data.is_verified || false,
        is_featured: data.is_featured || false,
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        tags: Array.isArray(data.tags) ? data.tags : [],
        social_media: data.social_media || { facebook: '', twitter: '', instagram: '', linkedin: '' },
        services: Array.isArray(data.services) ? data.services : [],
        products: Array.isArray(data.products) ? data.products : [],
        staff_details: Array.isArray(data.staff_details) 
          ? data.staff_details as any[] 
          : [],
        owners: Array.isArray(data.owners)
          ? data.owners as any[]
          : [],
        image_position: typeof data.image_position === 'object' && data.image_position !== null
          ? { 
              x: typeof data.image_position === 'object' && 'x' in data.image_position 
                ? Number(data.image_position.x) || 50 
                : 50, 
              y: typeof data.image_position === 'object' && 'y' in data.image_position 
                ? Number(data.image_position.y) || 50 
                : 50 
            } 
          : { x: 50, y: 50 },
        verification_documents: Array.isArray(data.verification_documents) 
          ? data.verification_documents 
          : [],
        membership_plans: Array.isArray(data.membership_plans)
          ? data.membership_plans as any[]
          : [],
        business_portfolio: data.business_portfolio || [],
        business_products: data.business_products || [],
        posts: data.posts || [],
        owner_id: data.user_id, // Map user_id as owner_id for permission checks
        cover_url: data.cover_url || null,
        updated_at: data.updated_at || data.created_at
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
