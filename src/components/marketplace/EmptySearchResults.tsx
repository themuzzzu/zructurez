
import React from "react";
import { Search, Package } from "lucide-react";

interface EmptySearchResultsProps {
  searchTerm?: string;
}

export const EmptySearchResults: React.FC<EmptySearchResultsProps> = ({ searchTerm }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4">
        {searchTerm ? (
          <Search className="h-16 w-16 text-muted-foreground" />
        ) : (
          <Package className="h-16 w-16 text-muted-foreground" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-2">
        {searchTerm ? `No results found for "${searchTerm}"` : "No products available"}
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        {searchTerm 
          ? "Try adjusting your search terms or browse our categories to find what you're looking for."
          : "Check back later for new products or try browsing our other categories."
        }
      </p>
      
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>Suggestions:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Check your spelling</li>
          <li>Try more general keywords</li>
          <li>Browse categories instead</li>
        </ul>
      </div>
    </div>
  );
};
