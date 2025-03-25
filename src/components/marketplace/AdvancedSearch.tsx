
import { SearchBar } from "@/components/search/SearchBar";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mic, Camera, ArrowRight } from "lucide-react";

interface AdvancedSearchProps {
  className?: string;
}

export function AdvancedSearch({ className }: AdvancedSearchProps) {
  const navigate = useNavigate();
  
  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
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
            showVoiceSearch={true}
            showImageSearch={true}
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Button
              size="sm"
              className="h-8 gap-1 px-3 rounded-full hidden sm:flex"
              onClick={() => navigate("/search")}
            >
              Search
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Popular:</span>
          {popularSearches.map((term) => (
            <Badge
              key={term}
              variant="outline"
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleSearch(term)}
            >
              {term}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2 sm:hidden">
          <Button 
            variant="outline" 
            className="flex-1 gap-1"
            onClick={() => navigate("/search?mode=voice")}
          >
            <Mic className="h-4 w-4" />
            Voice Search
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 gap-1"
            onClick={() => navigate("/search?mode=image")}
          >
            <Camera className="h-4 w-4" />
            Image Search
          </Button>
        </div>
      </div>
    </div>
  );
}
