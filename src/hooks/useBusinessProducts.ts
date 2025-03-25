
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { withCache } from "@/utils/cacheUtils";
import type { BusinessProduct } from "@/types/business";

export const useBusinessProducts = (businessId: string | null) => {
  const queryClient = useQueryClient();
  
  // Original fetch function
  const fetchProductsOriginal = async () => {
    if (!businessId) return [];
    
    const { data, error } = await supabase
      .from("business_products")
      .select("*")
      .eq("business_id", businessId);

    if (error) throw error;
    
    return data as BusinessProduct[];
  };
  
  // Apply cache to fetch function - 2 minute TTL
  const fetchProducts = withCache(
    fetchProductsOriginal,
    `business-products-${businessId}`,
    2 * 60 * 1000
  );

  // Set up real-time subscription to product updates
  useEffect(() => {
    if (!businessId) return;
    
    const channel = supabase
      .channel('business-products-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'business_products',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          // Invalidate cache to force a refresh
          queryClient.invalidateQueries({
            queryKey: ["business-products", businessId]
          });
          
          // Update the data in real-time
          if (payload.eventType === 'INSERT') {
            queryClient.setQueryData(["business-products", businessId], 
              (old: BusinessProduct[] | undefined) => {
                if (!old) return [payload.new as BusinessProduct];
                return [...old, payload.new as BusinessProduct];
              }
            );
          } else if (payload.eventType === 'UPDATE') {
            queryClient.setQueryData(["business-products", businessId], 
              (old: BusinessProduct[] | undefined) => {
                if (!old) return old;
                return old.map(product => 
                  product.id === payload.new.id ? 
                    payload.new as BusinessProduct : product
                );
              }
            );
          } else if (payload.eventType === 'DELETE') {
            queryClient.setQueryData(["business-products", businessId], 
              (old: BusinessProduct[] | undefined) => {
                if (!old) return old;
                return old.filter(product => product.id !== payload.old.id);
              }
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, queryClient]);

  return useQuery({
    queryKey: ["business-products", businessId],
    queryFn: fetchProducts,
    enabled: !!businessId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
