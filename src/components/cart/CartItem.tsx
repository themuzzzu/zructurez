
import { Minus, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CartItemProps {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string | null;
}

export const CartItem = ({ id, title, price, quantity, image_url }: CartItemProps) => {
  const queryClient = useQueryClient();

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ newQuantity }: { newQuantity: number }) => {
      if (newQuantity < 1) {
        throw new Error("Quantity cannot be less than 1");
      }
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to update cart');
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('product_id', id)
        .eq('user_id', session.session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartCount'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update quantity");
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to remove items from cart');
      }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('product_id', id)
        .eq('user_id', session.session.user.id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartCount'] });
      toast.success("Item removed from cart");
    },
    onError: (error) => {
      console.error('Error removing item:', error);
      toast.error("Failed to remove item from cart");
    },
  });

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleRemoveItem = () => {
    removeItemMutation.mutate();
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      {image_url && (
        <img src={image_url} alt={title} className="w-16 h-16 object-cover rounded" />
      )}
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{formatPrice(price)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => updateQuantityMutation.mutate({ newQuantity: quantity - 1 })}
          disabled={quantity <= 1 || updateQuantityMutation.isPending}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => updateQuantityMutation.mutate({ newQuantity: quantity + 1 })}
          disabled={updateQuantityMutation.isPending}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleRemoveItem}
        disabled={removeItemMutation.isPending}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
