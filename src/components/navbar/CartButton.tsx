
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cart } from "@/components/cart/Cart";

export const CartButton = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCartOpen(true)}
        className="relative"
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          2
        </span>
      </Button>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
