
import { SearchBar } from "@/components/search/SearchBar";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface AdvancedSearchProps {
  className?: string;
  onSearch?: (query: string) => void;
}

export function AdvancedSearch({ className, onSearch }: AdvancedSearchProps) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  
  const handleSearch = (query: string) => {
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/marketplace?search=${encodeURIComponent(query)}`);
      }
    }
  };
  
  const handleInputChange = (value: string) => {
    setSearchValue(value);
  };
  
  const popularSearches = [
    "Electronics",
    "Women's Fashion",
    "Home Decor", 
    "Books",
    "Sports Equipment"
  ];
  
  return (
    <div className={className}>
      <div className="grid gap-4">
        <div className="relative">
          <SearchBar
            onSearch={handleSearch}
            placeholder="What are you looking for today?"
            showVoiceSearch={false}
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
