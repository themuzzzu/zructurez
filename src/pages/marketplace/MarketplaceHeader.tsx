import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Cart } from "@/components/cart/Cart";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface MarketplaceHeaderProps {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  cartItemCount: number;
}

export const MarketplaceHeader = ({
  isCartOpen,
  setIsCartOpen,
  searchQuery,
  setSearchQuery,
  isFilterOpen,
  setIsFilterOpen,
  cartItemCount,
}: MarketplaceHeaderProps) => {
  const navigate = useNavigate();
  // For demonstration, we'll use a static notification count
  const notificationCount = 2;

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 w-8"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 w-8 md:hidden"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 w-8 relative"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-[10px] font-semibold border-2 border-white dark:border-zinc-900">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </div>
          
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 w-8"
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] flex items-center justify-center p-0 font-bold">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Shopping Cart</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <Cart />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
