
import { useState, useEffect, useRef } from "react";
import { Search, X, Bell, ShoppingBag, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

interface MarketplaceHeaderProps {
  onSearch: (query: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearching?: boolean;
  popularSearches?: { term: string; frequency: number }[];
}

export const MarketplaceHeader = ({
  onSearch,
  searchTerm,
  setSearchTerm,
  isSearching = false,
  popularSearches = []
}: MarketplaceHeaderProps) => {
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setShowSearchSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowSearchSuggestions(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/wishlist")}
          >
            <ShoppingBag className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs w-5 h-5">
              0
            </span>
          </Button>
        </div>
      </div>

      <div className="relative" ref={searchRef}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products, businesses, services..."
              className="pl-10 pr-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchSuggestions(true);
              }}
              onFocus={() => setShowSearchSuggestions(true)}
              onKeyDown={handleKeyDown}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button onClick={handleSearch} disabled={!searchTerm.trim() || isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>

        {showSearchSuggestions && (searchTerm || popularSearches.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-background border rounded-md shadow-md z-10">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                {searchTerm ? "Suggestions" : "Popular Searches"}
              </p>
              {isSearching ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Search className="h-3 w-3 text-muted-foreground" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))
              ) : popularSearches.length > 0 ? (
                popularSearches.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-1.5 hover:bg-muted rounded-md cursor-pointer"
                    onClick={() => {
                      setSearchTerm(item.term);
                      onSearch(item.term);
                      setShowSearchSuggestions(false);
                    }}
                  >
                    <Search className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{item.term}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No suggestions found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
