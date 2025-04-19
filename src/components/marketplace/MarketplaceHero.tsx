
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";

interface MarketplaceHeroProps {
  onCategorySelect: (category: string) => void;
  onSearch: (term: string) => void;
}

export const MarketplaceHero: React.FC<MarketplaceHeroProps> = ({ onCategorySelect, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const popularCategories = [
    "Electronics",
    "Fashion",
    "Home",
    "Beauty",
    "Sports"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden mb-8">
      {/* Blue wave pattern banner */}
      <div className="relative bg-blue-500 text-white p-6 md:p-8 rounded-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <svg width="100%" height="100%" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,266.7C672,267,768,245,864,224C960,203,1056,181,1152,186.7C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        <div className="relative z-10 max-w-xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Search for products, brands and categories...
          </h1>
          
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for products, brands and categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-white text-zinc-900 rounded-lg border-0 focus-visible:ring-2 focus-visible:ring-blue-600"
            />
            <Button type="submit" className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-9">
              Search
            </Button>
          </form>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {popularCategories.map((category) => (
              <Button 
                key={category}
                variant="outline" 
                size="sm"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                onClick={() => onCategorySelect(category.toLowerCase())}
              >
                {category}
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
