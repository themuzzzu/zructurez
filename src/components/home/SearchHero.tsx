import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchHeroProps {
  onSearch?: (query: string) => void;
}

export function SearchHero({ onSearch }: SearchHeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        // Use the provided onSearch callback if available
        onSearch(searchQuery);
      } else {
        // Otherwise navigate to search page
        navigate(`/marketplace/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };
  
  return (
    <div className="relative py-8 px-4 rounded-lg overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold">Find local businesses, services, and products</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Connect with everything you need in your local area
        </p>
        
        <form onSubmit={handleSearch} className="relative mt-6 max-w-lg mx-auto">
          <div className="flex">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search businesses, services, products..."
                className="pl-9 h-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="ml-2">
              Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
