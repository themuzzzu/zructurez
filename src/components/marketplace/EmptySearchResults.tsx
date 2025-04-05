
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, RefreshCcw } from "lucide-react";

interface EmptySearchResultsProps {
  searchTerm: string;
  onReset?: () => void; // Making this optional
}

export const EmptySearchResults = ({ searchTerm, onReset }: EmptySearchResultsProps) => {
  return (
    <div className="text-center p-8 bg-muted/30 rounded-lg flex flex-col items-center gap-4">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold mt-2">No results found</h3>
      
      <p className="text-muted-foreground max-w-md mx-auto">
        We couldn't find any products matching "{searchTerm}".
        Try using different keywords or browsing our categories.
      </p>
      
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {onReset && (
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={onReset}
          >
            <RefreshCcw className="h-4 w-4" />
            Reset Filters
          </Button>
        )}
        
        <Button onClick={() => window.location.href = '/marketplace'}>
          Browse All Products
        </Button>
      </div>
    </div>
  );
};
