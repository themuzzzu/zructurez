
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      // Navigate to search page with query
      navigate(`/marketplace/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };
  
  const handleClear = () => {
    setSearchTerm('');
  };
  
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 border-b">
      <div className="flex items-center gap-4">
        <form onSubmit={handleSubmit} className="relative w-full">
          <Input
            type="text"
            placeholder="Search products, services or businesses..."
            className="w-full pl-10 pr-10 focus-visible:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          
          {searchTerm && (
            <button 
              type="button" 
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {isFocused && popularSearches.length > 0 && !searchTerm && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-md z-20 py-2">
              <div className="text-xs font-semibold text-muted-foreground px-3 pb-1">Popular Searches</div>
              {popularSearches.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-3 py-1.5 hover:bg-muted text-sm"
                  onClick={() => {
                    setSearchTerm(item.term);
                    navigate(`/marketplace/search?q=${encodeURIComponent(item.term)}`);
                  }}
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
