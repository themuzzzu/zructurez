
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useServiceDeletion = (onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deleteService = async (serviceId: string) => {
    if (!serviceId) return;
    
    setIsDeleting(true);
    try {
      // Check if there are active appointments for this service
      const { data: appointments } = await supabase
        .from('appointments')
        .select('id, status')
        .eq('service_id', serviceId)
        .in('status', ['pending', 'confirmed']);
        
      if (appointments && appointments.length > 0) {
        toast.warning("This service has active appointments and cannot be deleted");
        return false;
      }
      
      // Delete service portfolio items
      await supabase
        .from('service_portfolio')
        .delete()
        .eq('service_id', serviceId);
        
      // Delete service products
      await supabase
        .from('service_products')
        .delete()
        .eq('service_id', serviceId);
        
      // Update completed appointments
      await supabase
        .from('appointments')
        .update({ status: 'service_deleted' })
        .eq('service_id', serviceId)
        .eq('status', 'completed');
        
      // Finally delete the service
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);
        
      if (error) throw error;
      
      toast.success("Service deleted successfully");
      onSuccess?.();
      
      return true;
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service. Please try again.");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deleteService
  };
};
