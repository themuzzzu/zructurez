
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EmptySearchResultsProps {
  searchTerm?: string;
  query?: string;
}

export const EmptySearchResults = ({ searchTerm, query }: EmptySearchResultsProps) => {
  const displayTerm = searchTerm || query || "";
  
  return (
    <div className="text-center py-12">
      <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No results found</h3>
      {displayTerm && (
        <p className="text-muted-foreground mb-4">
          We couldn't find any products matching "{displayTerm}"
        </p>
      )}
      <p className="text-muted-foreground mb-6">
        Try adjusting your search or filters to find what you're looking for
      </p>
      <Button variant="outline">Browse All Products</Button>
    </div>
  );
};
