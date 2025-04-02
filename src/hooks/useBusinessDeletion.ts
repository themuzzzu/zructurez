
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBusinessDeletion = (onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deleteBusiness = async (businessId: string) => {
    if (!businessId) return;
    
    setIsDeleting(true);
    try {
      // Execute deletion in the correct order to handle dependencies
      
      // 1. Delete business_portfolio items
      await supabase
        .from('business_portfolio')
        .delete()
        .eq('business_id', businessId);
      
      // 2. Delete business_products
      await supabase
        .from('business_products')
        .delete()
        .eq('business_id', businessId);
      
      // 3. Delete business_ratings
      await supabase
        .from('business_ratings')
        .delete()
        .eq('business_id', businessId);
      
      // 4. Delete business comments
      await supabase
        .from('business_comments')
        .delete()
        .eq('business_id', businessId);
      
      // 5. Delete business subscriptions
      await supabase
        .from('business_subscriptions')
        .delete()
        .eq('business_id', businessId);
      
      // 6. Delete business memberships
      await supabase
        .from('business_memberships')
        .delete()
        .eq('business_id', businessId);
      
      // 7. Delete business likes
      await supabase
        .from('business_likes')
        .delete()
        .eq('business_id', businessId);
      
      // 8. Delete business analytics
      await supabase
        .from('business_analytics')
        .delete()
        .eq('business_id', businessId);
      
      // 9. Update status of related orders to canceled
      await supabase
        .from('orders')
        .update({ status: 'canceled' })
        .eq('business_id', businessId);
      
      // 10. Update status of related appointments to canceled
      await supabase
        .from('appointments')
        .update({ status: 'canceled' })
        .eq('business_id', businessId);
      
      // 11. Finally delete the business
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', businessId);
      
      if (error) throw error;
      
      toast.success("Business deleted successfully");
      onSuccess?.();
      
      return true;
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
