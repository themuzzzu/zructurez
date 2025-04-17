
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  quantity?: number;
}

export const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Transform the data to match CartItem interface
      const items: CartItem[] = data.map((item: any) => ({
        id: item.id,
        title: item.title || item.product_title,
        price: item.price || 0,
        image_url: item.image_url,
        quantity: item.quantity || 1
      }));

      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <p>Loading cart items...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-lg font-medium">Your cart is empty</p>
          <p className="text-muted-foreground mb-4">Add some products to your cart to see them here.</p>
          <Button onClick={() => navigate('/marketplace')}>Browse Products</Button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-[80px_1fr_auto] gap-4 p-4">
                    <div className="bg-muted rounded-md h-20 w-20 overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="object-cover h-full w-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-xl font-bold">₹{item.price.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="self-center text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator className="my-6" />
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Total</span>
              <span className="font-bold">₹{getTotalPrice().toFixed(2)}</span>
            </div>
            
            <Button onClick={handleCheckout} className="w-full">
              Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
