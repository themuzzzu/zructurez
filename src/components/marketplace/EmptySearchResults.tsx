
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface EmptySearchResultsProps {
  searchTerm?: string;
  onReset?: () => void;
}

export const EmptySearchResults = ({ 
  searchTerm = "", 
  onReset 
}: EmptySearchResultsProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted/50 rounded-full p-4 mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold">No products found</h3>
      
      {searchTerm ? (
        <p className="text-muted-foreground mt-2 mb-6 max-w-md">
          We couldn't find any products matching "{searchTerm}". Try different keywords or browse our categories.
        </p>
      ) : (
        <p className="text-muted-foreground mt-2 mb-6 max-w-md">
          No products were found. Try browsing different categories or check back later for new arrivals.
        </p>
      )}
      
      {onReset && (
        <Button onClick={onReset}>
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default EmptySearchResults;
