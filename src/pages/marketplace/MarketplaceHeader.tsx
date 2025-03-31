
import React, { useState } from 'react';
import { Search, X, MapPin, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface MarketplaceHeaderProps {
  onSearch: (term: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearching: boolean;
  popularSearches: Array<{term: string; frequency: number}>;
}

export const MarketplaceHeader = ({ 
  onSearch, 
  searchTerm, 
  setSearchTerm, 
  isSearching,
  popularSearches 
}: MarketplaceHeaderProps) => {
  const navigate = useNavigate();
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setShowSearchDialog(false);
    }
  };
  
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  // Simplified location example - in a real app, would use geolocation
  const userLocation = 'New Delhi, India';
  
  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Marketplace</h1>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{userLocation}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/wishlist')}
              aria-label="View wishlist"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Button 
            variant="outline" 
            className="w-full justify-start text-muted-foreground h-10 font-normal relative pl-9"
            onClick={() => setShowSearchDialog(true)}
          >
            <Search className="h-4 w-4 absolute left-3" />
            {searchTerm || "Search products, categories..."}
            {searchTerm && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSearch();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </Button>
        </div>
      </div>
      
      <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search Marketplace</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9 pr-12"
                placeholder="Search products, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              {searchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-8 top-1/2 h-7 w-7 -translate-y-1/2"
                  onClick={clearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full px-3"
                disabled={isSearching}
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
            
            {isSearching ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-10 w-5/6" />
              </div>
            ) : (
              <>
                {popularSearches.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Popular Searches</Label>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((search, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => {
                            setSearchTerm(search.term);
                            onSearch(search.term);
                            setShowSearchDialog(false);
                          }}
                        >
                          {search.term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
