
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mic, Camera, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDebounce } from '@/hooks/useDebounce';

interface MarketplaceSearchProps {
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const MarketplaceSearch = ({
  onSearch,
  searchTerm,
  setSearchTerm
}: MarketplaceSearchProps) => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);
  
  const popularSearches = [
    { term: "smartphones" },
    { term: "laptops" },
    { term: "headphones" },
    { term: "watches" },
    { term: "furniture" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchTerm.trim()) {
      onSearch(localSearchTerm);
      navigate(`/search?q=${encodeURIComponent(localSearchTerm)}`);
    }
  };
  
  const handleClear = () => {
    setLocalSearchTerm('');
    setSearchTerm('');
  };
  
  const handleVoiceSearch = () => {
    setShowVoiceSearch(true);
    // In a real app, implement voice recognition API here
    setTimeout(() => {
      setShowVoiceSearch(false);
      // Simulate voice recognition result
      setLocalSearchTerm('voice search demo');
      setSearchTerm('voice search demo');
      onSearch('voice search demo');
    }, 2000);
  };
  
  const handleImageSearch = () => {
    // Implementation for image search would go here
    alert("Image search feature coming soon!");
  };
  
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search for products, brands or categories..."
            className="w-full pl-10 pr-10 h-11 rounded-xl border-gray-200 focus-visible:ring-primary"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
          />
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          
          {localSearchTerm && (
            <button 
              type="button" 
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Voice Search Button */}
        <Button 
          type="button"
          size="icon"
          variant="ghost"
          className="rounded-full h-10 w-10 flex-shrink-0"
          onClick={handleVoiceSearch}
        >
          <Mic className={`h-5 w-5 ${showVoiceSearch ? 'text-primary animate-pulse' : ''}`} />
        </Button>
        
        {/* Image Search Button */}
        <Button 
          type="button"
          size="icon"
          variant="ghost"
          className="rounded-full h-10 w-10 flex-shrink-0"
          onClick={handleImageSearch}
        >
          <Camera className="h-5 w-5" />
        </Button>
        
        {/* Filter Button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              type="button"
              size="icon"
              variant="ghost"
              className="rounded-full h-10 w-10 flex-shrink-0"
            >
              <Filter className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <h3 className="font-medium">Filter Products</h3>
              {/* Filter options would go here */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="discount" className="mr-2" />
                  <label htmlFor="discount">Discounted Products</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="freeShipping" className="mr-2" />
                  <label htmlFor="freeShipping">Free Shipping</label>
                </div>
              </div>
              <div className="pt-2">
                <Button className="w-full">Apply Filters</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </form>
    </div>
  );
};
