
import { AdvancedSearch } from "@/components/marketplace/AdvancedSearch";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface MarketplaceHeroProps {
  onCategorySelect: (category: string) => void;
  onSearch: (term: string) => void;
}

export const MarketplaceHero = ({ onCategorySelect, onSearch }: MarketplaceHeroProps) => {
  const popularCategories = [
    "Electronics",
    "Fashion",
    "Home Appliances",
    "Beauty",
    "Furniture"
  ];

  return (
    <div className="rounded-xl overflow-hidden mb-8">
      {/* Search section first */}
      <div className="relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 p-6 md:p-8 mb-4">
        <div className="max-w-xl relative z-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Discover, Shop & Connect
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 mb-6 md:text-lg">
            Explore thousands of products from local businesses and trusted sellers
          </p>
          
          <AdvancedSearch onSearch={onSearch} />
          
          <div className="flex flex-wrap gap-2 mt-4">
            {popularCategories.map((category) => (
              <Button 
                key={category}
                variant="outline" 
                size="sm"
                className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                onClick={() => onCategorySelect(category.toLowerCase())}
              >
                {category}
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            ))}
          </div>
        </div>
        
        {/* Abstract pattern for the background */}
        <div className="absolute top-0 right-0 opacity-10 w-full h-full">
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <pattern id="hatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="black" strokeWidth="2" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#hatch)" />
            <circle cx="300" cy="100" r="50" fill="black" fillOpacity="0.1" />
            <circle cx="80" cy="300" r="80" fill="black" fillOpacity="0.1" />
          </svg>
        </div>
      </div>
    </div>
  );
};
