
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SearchInput } from "@/components/SearchInput";
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
    <div className="bg-primary px-4 py-3 mb-4 shadow-md sticky top-0 z-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Marketplace</h1>
          </div>
          
          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-4">
            <SearchInput 
              placeholder="Search products..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full bg-white rounded-l-md"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10 md:hidden"
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter className="h-5 w-5" />
            </Button>
            
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <div className="relative">
                  <Button variant="ghost" size="icon" className="text-white">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-white text-xs flex items-center justify-center animate-fade-in">
                        {cartItemCount}
                      </span>
                    )}
                  </Button>
                </div>
              </SheetTrigger>
              <SheetContent className="w-full sm:w-[540px]">
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
        <div className="mt-3 md:hidden">
          <SearchInput 
            placeholder="Search products..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full bg-white"
          />
        </div>
      </div>
    </div>
  );
};
