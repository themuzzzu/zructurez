
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface EmptySearchResultsProps {
  searchTerm: string;
  onCategorySelect?: (category: string) => void;
  onSearchSelect?: (term: string) => void;
}

export const EmptySearchResults = ({ 
  searchTerm, 
  onCategorySelect,
  onSearchSelect
}: EmptySearchResultsProps) => {
  const suggestedCategories = [
    { name: "Electronics", icon: "🔌" },
    { name: "Clothing", icon: "👕" },
    { name: "Home", icon: "🏠" },
    { name: "Beauty", icon: "💄" }
  ];
  
  const suggestedSearches = [
    "wireless headphones",
    "dress",
    "coffee maker",
    "smartphone"
  ];
  
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">No results found for "{searchTerm}"</h3>
      <p className="text-muted-foreground mb-8">Try adjusting your search or browse categories below</p>
      
      {onCategorySelect && (
        <div className="mb-8">
          <h4 className="font-medium mb-3">Browse categories</h4>
          <div className="flex flex-wrap justify-center gap-3">
            {suggestedCategories.map((category) => (
              <Button
                key={category.name}
                variant="outline"
                onClick={() => onCategorySelect(category.name.toLowerCase())}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {onSearchSelect && (
        <div>
          <h4 className="font-medium mb-3">Try these searches</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestedSearches.map((term) => (
              <button
                key={term}
                onClick={() => onSearchSelect(term)}
                className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
