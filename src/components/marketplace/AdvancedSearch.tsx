
import { SearchBar } from "@/components/search/SearchBar";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface AdvancedSearchProps {
  className?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function AdvancedSearch({ className, onSearch, placeholder }: AdvancedSearchProps) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  
  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Always redirect to the search page
      navigate(`/search?q=${encodeURIComponent(query)}`);
      
      // Also call the onSearch callback if provided
      if (onSearch) {
        onSearch(query);
      }
    }
  };
  
  const handleInputChange = (value: string) => {
    setSearchValue(value);
  };
  
  const getPopularSearches = () => {
    // Return service-specific popular searches if the placeholder suggests we're in services
    if (placeholder?.toLowerCase().includes("service")) {
      return [
        "Plumbing",
        "Cleaning",
        "Electrician", 
        "Home Repair",
        "Computer Repair"
      ];
    }
    
    // Default popular searches for marketplace
    return [
      "Electronics",
      "Women's Fashion",
      "Home Decor", 
      "Books",
      "Sports Equipment"
    ];
  };
  
  const popularSearches = getPopularSearches();
  
  return (
    <div className={className}>
      <div className="grid gap-4">
        <div className="relative">
          <SearchBar
            onSearch={handleSearch}
            placeholder={placeholder || "What are you looking for today?"}
            autoFocus={false}
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Button
              size="sm"
              className="h-8 gap-1 px-3 rounded-full hidden sm:flex bg-black text-white hover:bg-zinc-800"
              onClick={() => handleSearch(searchValue)}
            >
              Search
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-zinc-500">Popular:</span>
          {popularSearches.map((term) => (
            <Badge
              key={term}
              variant="outline"
              className="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-300 dark:border-zinc-600"
              onClick={() => handleSearch(term)}
            >
              {term}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
