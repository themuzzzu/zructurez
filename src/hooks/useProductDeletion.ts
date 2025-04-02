
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProductDeletion = (onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deleteProduct = async (productId: string, isBusinessProduct: boolean = false) => {
    if (!productId) return;
    
    setIsDeleting(true);
    try {
      // Check if the product is part of any active orders
      if (!isBusinessProduct) {
        const { data: orders } = await supabase
          .from('orders')
          .select('id, status')
          .eq('product_id', productId)
          .eq('status', 'pending');
          
        if (orders && orders.length > 0) {
          toast.warning("This product has active orders and cannot be deleted");
          return false;
        }
        
        // Delete product labels first (if any)
        await supabase
          .from('product_labels')
          .delete()
          .eq('product_id', productId);
          
        // Delete product images (if any)
        await supabase
          .from('product_images')
          .delete()
          .eq('product_id', productId);
          
        // Delete wishlists entries
        await supabase
          .from('wishlists')
          .delete()
          .eq('product_id', productId);
          
        // Update completed orders to mark product as deleted
        await supabase
          .from('orders')
          .update({ status: 'product_deleted' })
          .eq('product_id', productId)
          .in('status', ['completed', 'delivered']);
          
        // Finally delete the product
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
          
        if (error) throw error;
      } else {
        // Handle business product deletion
        const { error } = await supabase
          .from('business_products')
          .delete()
          .eq('id', productId);
          
        if (error) throw error;
      }
      
      toast.success("Product deleted successfully");
      onSuccess?.();
      
      return true;
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
