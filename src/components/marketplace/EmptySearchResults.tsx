
import { Search } from "lucide-react";

interface EmptySearchResultsProps {
  query?: string;
  onCategorySelect?: (category: string) => void;
  onSearchSelect?: (term: string) => void;
}

export const EmptySearchResults = ({ 
  query, 
  onCategorySelect, 
  onSearchSelect 
}: EmptySearchResultsProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-muted/30 p-4 rounded-full mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      {query ? (
        <>
          <h3 className="text-lg font-semibold">No results found for "{query}"</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter criteria
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold">No products found</h3>
          <p className="text-muted-foreground mt-2">
            Try changing your filters or check back later
          </p>
        </>
      )}
    </div>
  );
};
