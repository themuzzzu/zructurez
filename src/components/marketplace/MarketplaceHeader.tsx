
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  Heart,
  ShoppingCart
} from "lucide-react";
import { SearchInput } from "@/components/SearchInput";

export interface MarketplaceHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFilterOpen?: boolean;
  setIsFilterOpen?: (open: boolean) => void;
  cartItemCount?: number;
  isCartOpen?: boolean;
  setIsCartOpen?: (open: boolean) => void;
}

export const MarketplaceHeader = ({ 
  searchQuery, 
  setSearchQuery,
  isFilterOpen,
  setIsFilterOpen,
  cartItemCount = 0,
  isCartOpen,
  setIsCartOpen
}: MarketplaceHeaderProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchQuery(localSearchQuery);
  };

  const handleWishlistClick = () => {
    // Handle wishlist navigation
  };

  const handleCartClick = () => {
    if (setIsCartOpen) {
      setIsCartOpen(!isCartOpen);
    }
  };

  const handleFilterClick = () => {
    if (setIsFilterOpen) {
      setIsFilterOpen(!isFilterOpen);
    }
  };

  return (
    <div className="space-y-4 w-full overflow-hidden px-1 sm:px-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleWishlistClick}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-8 w-8 sm:h-10 sm:w-10"
            onClick={handleCartClick}
          >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            {cartItemCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center"
                variant="destructive"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>
          
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={handleFilterClick}>
                <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="py-4">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                {/* Filter content */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <form onSubmit={handleSearch} className="flex w-full gap-2 overflow-hidden">
        <SearchInput
          placeholder="Search products..."
          value={localSearchQuery}
          onChange={setLocalSearchQuery}
          onSubmit={handleSearch}
          className="flex-1"
        />
        <Button type="submit" className="shrink-0">
          Search
        </Button>
      </form>
    </div>
  );
};
