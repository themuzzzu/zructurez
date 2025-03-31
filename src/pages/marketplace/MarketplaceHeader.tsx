
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Filter, Search, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AutocompleteSearch } from "@/components/marketplace/AutocompleteSearch";
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
  // In a real app, this would come from a prop or hook
  const notificationCount = 2;

  const handleSearchSelect = (term: string) => {
    setSearchQuery(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 px-2 sm:px-4 py-3 sm:py-4 mb-4 shadow-md sticky top-0 z-10 transition-all border-b border-zinc-200 dark:border-zinc-800">
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
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white truncate">Zructs</h1>
          </div>
          
          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-4">
            <div className="relative w-full flex items-center">
              <Search className="absolute left-2 h-4 w-4 text-zinc-400 z-10" />
              <AutocompleteSearch 
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-full bg-white dark:bg-zinc-800 rounded-md pl-9 border-zinc-300 dark:border-zinc-700"
                onSearchSelect={handleSearchSelect}
              />
            </div>
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
            
            {/* Updated Notification Button with Badge */}
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
        
        {/* Mobile Search */}
        <div className="mt-2 md:hidden relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400 z-10" />
          <AutocompleteSearch 
            placeholder="Search products..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full bg-white dark:bg-zinc-800 pl-9 border-zinc-300 dark:border-zinc-700"
            onSearchSelect={handleSearchSelect}
          />
        </div>
      </div>
    </div>
  );
};
