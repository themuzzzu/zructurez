
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ShoppingCart, 
  Filter, 
  Heart
} from "lucide-react";

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleWishlistClick}
          >
            <Heart className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={handleCartClick}
          >
            <ShoppingCart className="h-5 w-5" />
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
              <Button variant="outline" size="icon" onClick={handleFilterClick}>
                <Filter className="h-5 w-5" />
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
      
      <form onSubmit={handleSearch} className="flex w-full gap-2">
        <div className="relative flex-1 rounded-md overflow-hidden">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <input
            type="search"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 rounded-md border-0 ring-1 ring-muted bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit" className="shrink-0">
          Search
        </Button>
      </form>
    </div>
  );
};
