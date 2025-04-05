
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDebounce } from '@/hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

interface MarketplaceHeaderProps {
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isSearching?: boolean;
  popularSearches?: Array<{term: string}>;
}

export const MarketplaceHeader = ({
  onSearch,
  searchTerm,
  setSearchTerm,
  isSearching = false,
  popularSearches = []
}: MarketplaceHeaderProps) => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);
  
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);
  
  useEffect(() => {
    // Only trigger search for suggestions as user types
    if (debouncedSearchTerm !== searchTerm) {
      // This could be used to fetch search suggestions
    }
  }, [debouncedSearchTerm, searchTerm]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchTerm.trim()) {
      // Redirect to search page with query parameter
      navigate(`/search?q=${encodeURIComponent(localSearchTerm)}`);
      // Also call the onSearch function passed from parent
      onSearch(localSearchTerm);
    }
  };
  
  const handleClear = () => {
    setLocalSearchTerm('');
    setSearchTerm('');
  };
  
  const handlePopularSearchClick = (term: string) => {
    setLocalSearchTerm(term);
    setSearchTerm(term);
    // Redirect to search page with query parameter
    navigate(`/search?q=${encodeURIComponent(term)}`);
    onSearch(term);
  };
  
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 border-b">
      <div className="flex items-center gap-4">
        <form onSubmit={handleSubmit} className="relative w-full">
          <Input
            type="text"
            placeholder="Search products, services or businesses..."
            className="w-full pl-10 pr-10 focus-visible:ring-primary"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          
          {localSearchTerm && (
            <button 
              type="button" 
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {isFocused && popularSearches.length > 0 && !localSearchTerm && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-md z-20 py-2">
              <div className="text-xs font-semibold text-muted-foreground px-3 pb-1">Popular Searches</div>
              {popularSearches.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-3 py-1.5 hover:bg-muted text-sm"
                  onClick={() => handlePopularSearchClick(item.term)}
                >
                  {item.term}
                </button>
              ))}
            </div>
          )}
        </form>
        
        <Button 
          type="button" 
          size="sm"
          onClick={handleSubmit}
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>
    </div>
  );
};

export default MarketplaceHeader;
