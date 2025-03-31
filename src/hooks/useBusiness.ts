
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBusiness = (businessId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['business', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();

      if (error) {
        console.error('Error fetching business:', error);
        throw error;
      }

      return data;
    },
  });

  const formatBusinessData = (data: any) => {
    if (!data) return null;
    
    return {
      ...data,
      address: data.address || "",
      city: data.city || "",
      state: data.state || "",
      zip: data.zip || "",
      phone: data.phone || data.contact || "",
      email: data.email || "",
      sub_category: data.sub_category || data.category || "",
      logo_url: data.logo_url || data.image_url || "",
      ratings: data.ratings || 0,
      reviews_count: data.reviews_count || 0,
      is_verified: data.is_verified || data.verified || false,
      is_open: data.is_open ?? true,
      is_featured: data.is_featured || false,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      tags: data.tags || [],
      social_media: data.social_media || {},
      services: data.services || [],
      products: data.products || [],
      cover_url: data.cover_url || "",
      updated_at: data.updated_at || data.created_at
    };
  };

  const formattedBusiness = formatBusinessData(data);

  return {
    business: formattedBusiness,
    isLoading,
    error,
    refetchBusiness: refetch
  };
};
