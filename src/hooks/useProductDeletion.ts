
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProductDeletion = (onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deleteProduct = async (productId: string, isBusinessProduct: boolean = false) => {
    if (!productId) return;
    
    setIsDeleting(true);
    try {
      // Use the SQL function we created to safely delete product
      const { data, error } = await supabase
        .rpc('delete_product_safely', { 
          product_id_param: productId,
          is_business_product: isBusinessProduct
        });

      if (error) throw error;
      
      if (data === true) {
        toast.success("Product deleted successfully");
        onSuccess?.();
        return true;
      } else {
        toast.warning("This product has active orders and cannot be deleted");
        return false;
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deleteProduct
  };
};
