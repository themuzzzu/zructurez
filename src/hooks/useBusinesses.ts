
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import type { Business, StaffMember, BusinessOwner } from "@/types/business";

export const useBusinesses = () => {
  const queryClient = useQueryClient();

  // Function to transform business data
  const transformBusinessData = (data: any[]): Business[] => {
    return data.map((business: any) => ({
      ...business,
      staff_details: Array.isArray(business.staff_details) 
        ? business.staff_details.map((staff: any) => ({
            name: staff.name || null,
            position: staff.position || null,
            experience: staff.experience || null,
          }))
        : [],
      owners: Array.isArray(business.owners)
        ? business.owners.map((owner: any) => ({
            name: owner.name || null,
            role: owner.role || "Primary Owner",
            position: owner.position || null,
            experience: owner.experience || null,
          }))
        : [],
      image_position: typeof business.image_position === 'object'
        ? {
            x: business.image_position.x || 50,
            y: business.image_position.y || 50,
          }
        : { x: 50, y: 50 },
      verification_documents: Array.isArray(business.verification_documents)
        ? business.verification_documents
        : []
    })) as Business[];
  };

  const fetchBusinesses = async () => {
    const { data, error } = await supabase
      .from("businesses")
      .select("*");

    if (error) throw error;
    
    return transformBusinessData(data);
  };

  // Set up real-time subscription to business status changes
  useEffect(() => {
    const channel = supabase
      .channel('business-status-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'businesses',
          filter: `is_open:eq.true,is_open:eq.false`
        },
        (payload) => {
          // Update the cache when a business status changes
          queryClient.setQueryData(['businesses'], (oldData: Business[] | undefined) => {
            if (!oldData) return oldData;
            
            // More robust type checking for the payload
            if (payload.new && 
                typeof payload.new === 'object' && 
                'id' in payload.new && 
                typeof payload.new.id === 'string') {
              const businessId = payload.new.id;
              
              return oldData.map(business => 
                business.id === businessId 
                  ? { ...business, ...payload.new }
                  : business
              );
            }
            
            return oldData;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["businesses"],
    queryFn: fetchBusinesses,
    staleTime: 3 * 60 * 1000, // 3 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};
