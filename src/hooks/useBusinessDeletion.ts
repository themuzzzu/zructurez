
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBusinessDeletion = (onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deleteBusiness = async (businessId: string) => {
    if (!businessId) return;
    
    setIsDeleting(true);
    try {
      // First, delete related booking messages
      const { error: bookingMessagesError } = await supabase
        .from('business_booking_messages')
        .delete()
        .eq('business_id', businessId);

      if (bookingMessagesError) {
        console.error("Error deleting business booking messages:", bookingMessagesError);
      }
      
      // Then use the SQL function we created to perform cascading deletion
      const { data, error } = await supabase
        .rpc('delete_business_cascade', { business_id_param: businessId });

      if (error) throw error;
      
      if (data === true) {
        toast.success("Business deleted successfully");
        onSuccess?.();
        return true;
      } else {
        toast.error("Failed to delete business");
        return false;
      }
    } catch (error) {
      console.error("Error deleting business:", error);
      toast.error("Failed to delete business. Please try again.");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deleteBusiness
  };
};
