
import { ShoppingBagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptySearchResultsProps {
  searchTerm?: string;
}

export const EmptySearchResults = ({ searchTerm }: EmptySearchResultsProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted rounded-full p-3 mb-4">
        <ShoppingBagIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No products found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {searchTerm 
          ? `We couldn't find any products matching "${searchTerm}". Try searching with different keywords or browse categories.` 
          : "No products available at the moment. Try browsing different categories or check back later."}
      </p>
      <Button>Continue Shopping</Button>
    </div>
  );
};
