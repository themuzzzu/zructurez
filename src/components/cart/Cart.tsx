import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "./CartItem";
import { Button } from "../ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Cart = () => {
  const queryClient = useQueryClient();
  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to view cart');
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          quantity,
          products (
            id,
            title,
            price,
            image_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to clear cart');
      }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', session.session.user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success("Order placed successfully!");
    },
    onError: () => {
      toast.error("Failed to process order");
    },
  });

  const handleCheckout = async () => {
    if (!cartItems?.length) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      // Process the order
      await clearCartMutation.mutateAsync();
      
      // Create a notification for the order
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: session.session.user.id,
            message: `Your order has been placed successfully! Total amount: ${formatPrice(total)}`,
          });

        if (notificationError) {
          console.error('Error creating notification:', notificationError);
        }
      }

      toast.success("Order placed successfully!");
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error("Checkout failed");
    }
  };

  const total = cartItems?.reduce((sum, item) => {
    return sum + (item.products?.price || 0) * item.quantity;
  }, 0) || 0;

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return <div className="p-4">Loading cart...</div>;
  }

  return (
    <div className="p-4 bg-card rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
      {cartItems && cartItems.length > 0 ? (
        <>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <CartItem
                key={item.products?.id}
                id={item.products?.id}
                title={item.products?.title}
                price={item.products?.price}
                quantity={item.quantity}
                image_url={item.products?.image_url}
              />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
            <Button 
              className="w-full" 
              onClick={handleCheckout}
              disabled={clearCartMutation.isPending}
            >
              {clearCartMutation.isPending ? (
                "Processing..."
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Your cart is empty
        </div>
      )}
    </div>
  );
};