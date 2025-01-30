import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Business, StaffMember, BusinessOwner } from "@/types/business";

export const useBusinesses = () => {
  const fetchBusinesses = async () => {
    const { data, error } = await supabase
      .from("businesses")
      .select("*");

    if (error) throw error;

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

  return useQuery({
    queryKey: ["businesses"],
    queryFn: fetchBusinesses,
  });
};