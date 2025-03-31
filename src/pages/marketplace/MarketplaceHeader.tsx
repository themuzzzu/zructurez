
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export interface MarketplaceHeaderProps {
  onSearch?: (query: string) => void;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  popularSearches?: any[];
  isSearching?: boolean;
  isCartOpen?: boolean;
  setIsCartOpen?: (open: boolean) => void;
  isFilterOpen?: boolean;
  setIsFilterOpen?: (open: boolean) => void;
  cartItemCount?: number;
}

export const MarketplaceHeader = ({ 
  onSearch, 
  searchTerm = "",
  setSearchTerm,
  popularSearches = [],
  isSearching = false,
}: MarketplaceHeaderProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onSearch) onSearch(localSearchTerm);
    setShowSuggestions(false);
  };
  
  const handleInputChange = (value: string) => {
    setLocalSearchTerm(value);
    if (setSearchTerm) setSearchTerm(value);
    setShowSuggestions(value.length > 0);
  };
  
  const handleSuggestionClick = (term: string) => {
    setLocalSearchTerm(term);
    if (setSearchTerm) setSearchTerm(term);
    if (onSearch) onSearch(term);
    setShowSuggestions(false);
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto relative">
      <form onSubmit={handleSearch} className="relative">
        <Input
          value={localSearchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Search for products, services, or businesses..."
          className="pr-12"
          onFocus={() => localSearchTerm && setShowSuggestions(true)}
        />
        <Button 
          type="submit" 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-0 h-full"
        >
          <Search className="h-5 w-5" />
        </Button>
      </form>
      
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute mt-1 w-full bg-background border rounded-md shadow-lg z-10"
        >
          {popularSearches.length > 0 ? (
            <div className="p-2">
              <div className="text-xs text-muted-foreground mb-2">Popular searches</div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(item.term)}
                    className="px-3 py-1 bg-secondary rounded-full text-xs hover:bg-secondary/80 transition-colors"
                  >
                    {item.term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 text-center text-sm text-muted-foreground">
              Start typing to search
            </div>
          )}
        </div>
      )}
    </div>
  );
};
