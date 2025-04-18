
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Cart } from "../cart/Cart";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const CartButton = () => {
  const { data: cartItemCount = 0 } = useQuery({
    queryKey: ['cartCount'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return 0;

      const { count, error } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.session.user.id);

      if (error) throw error;
      return count || 0;
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          <Button variant="ghost" size="icon" className="transition-transform duration-300 hover:scale-110">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center shadow-sm">
              {cartItemCount}
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="w-[95vw] sm:w-[400px] md:w-[540px]">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-4 overflow-x-hidden">
          <Cart />
        </div>
      </SheetContent>
    </Sheet>
  );
};
