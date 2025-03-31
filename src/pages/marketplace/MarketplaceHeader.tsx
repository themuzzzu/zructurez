
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Cart } from "@/components/cart/Cart";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Filter, Heart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto py-3 px-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-xl">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/wishlist')}
            className="relative"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(true)}
            className="relative"
            aria-label="Shopping cart"
          >
            {cartItemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold"
              >
                {cartItemCount}
              </Badge>
            )}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
            >
              <path
                d="M4.78571 5H18.2251C19.5903 5 20.5542 6.33739 20.1225 7.63246L18.4558 12.6325C18.1836 13.4491 17.4193 14 16.5585 14H6.07142M4.78571 5L4.74531 4.71716C4.60455 3.73186 3.76071 3 2.76541 3H2M4.78571 5L6.07142 14M6.07142 14L6.25469 15.2828C6.39545 16.2681 7.23929 17 8.23459 17H16.5M16.5 17C15.6716 17 15 17.6716 15 18.5C15 19.3284 15.6716 20 16.5 20C17.3284 20 18 19.3284 18 18.5C18 17.6716 17.3284 17 16.5 17ZM8.5 17C7.67157 17 7 17.6716 7 18.5C7 19.3284 7.67157 20 8.5 20C9.32843 20 10 19.3284 10 18.5C10 17.6716 9.32843 17 8.5 17Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="relative md:hidden"
            aria-label="Filter products"
          >
            <Filter className="h-5 w-5" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Shopping Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-full sm:w-96 p-0">
          <Cart onClose={() => setIsCartOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

const hasActiveFilters = false; // This would be a prop in a real implementation
