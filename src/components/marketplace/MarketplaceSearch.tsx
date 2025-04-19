
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Mic, Camera, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
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
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
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
    setTimeout(() => {
      setShowVoiceSearch(false);
    }, 2000);
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search for products, brands and categories..."
          className="w-full pl-10 pr-10 h-11 rounded-xl border-gray-200"
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
      
      <Button 
        type="button"
        size="icon"
        variant="ghost"
        className="rounded-full h-11 w-11"
        onClick={handleVoiceSearch}
      >
        <Mic className={`h-5 w-5 ${showVoiceSearch ? 'text-primary animate-pulse' : ''}`} />
      </Button>
      
      <Button 
        type="button"
        size="icon"
        variant="ghost"
        className="rounded-full h-11 w-11"
      >
        <Camera className="h-5 w-5" />
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            type="button"
            size="icon"
            variant="ghost"
            className="rounded-full h-11 w-11"
          >
            <Filter className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="space-y-4">
            <h3 className="font-medium">Filter Products</h3>
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
            <Button className="w-full">Apply Filters</Button>
          </div>
        </PopoverContent>
      </Popover>
    </form>
  );
};
