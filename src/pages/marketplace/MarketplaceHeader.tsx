
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AutocompleteSearch } from "@/components/marketplace/AutocompleteSearch";
import { Cart } from "@/components/cart/Cart";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="bg-primary px-2 sm:px-4 py-2 sm:py-3 mb-4 shadow-md sticky top-0 z-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10 h-8 w-8"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">Marketplace</h1>
          </div>
          
          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-4">
            <AutocompleteSearch 
              placeholder="Search products..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full bg-white rounded-l-md"
              onSearchSelect={setSearchQuery}
            />
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10 h-8 w-8 md:hidden"
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <div className="relative">
                  <Button variant="ghost" size="icon" className="text-white h-8 w-8">
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-white text-[10px] flex items-center justify-center animate-fade-in">
                        {cartItemCount}
                      </span>
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
        
        {/* Mobile Search */}
        <div className="mt-2 md:hidden">
          <AutocompleteSearch 
            placeholder="Search products..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full bg-white"
            onSearchSelect={setSearchQuery}
          />
        </div>
      </div>
    </div>
  );
};
