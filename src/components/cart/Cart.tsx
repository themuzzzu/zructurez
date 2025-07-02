import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cart = ({ isOpen, onClose }: CartProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Mock cart items (replace with actual data fetching)
    const mockCartItems: CartItem[] = [
      {
        id: "1",
        title: "Sample Product 1",
        price: 50,
        image_url: "/placeholder.png",
        quantity: 1,
      },
      {
        id: "2",
        title: "Sample Product 2",
        price: 75,
        image_url: "/placeholder.png",
        quantity: 2,
      },
    ];
    setCartItems(mockCartItems);
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-96 h-full overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Shopping Cart</h3>
          <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={onClose}>
            Close
          </Button>
        </div>
        
        <div className="flex-1 p-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img 
                    src={item.image_url || '/placeholder.png'} 
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-gray-600">₹{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-3 py-1 bg-gray-100 rounded">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Total:</span>
            <span className="text-lg font-semibold">₹{totalAmount}</span>
          </div>
          <Button className="w-full">
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};
