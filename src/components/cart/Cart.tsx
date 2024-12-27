import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "./CartItem";
import { Button } from "../ui/button";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export const Cart = () => {
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

  const total = cartItems?.reduce((sum, item) => {
    return sum + (item.products?.price || 0) * item.quantity;
  }, 0) || 0;

  const handleCheckout = () => {
    toast.info("Checkout functionality coming soon!");
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
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <Button className="w-full" onClick={handleCheckout}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Proceed to Checkout
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