
import { AdvancedSearch } from "@/components/marketplace/AdvancedSearch";

interface MarketplaceHeroProps {
  onCategorySelect: (category: string) => void;
  onSearch: (term: string) => void;
}

export const MarketplaceHero = ({ onCategorySelect, onSearch }: MarketplaceHeroProps) => {
  return (
    <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 mb-8 p-6 md:p-8">
      <div className="max-w-xl relative z-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
          Discover, Shop & Connect
        </h1>
        <p className="text-blue-100 mb-6 md:text-lg">
          Explore thousands of products from local businesses and trusted sellers
        </p>
        
        <AdvancedSearch onSearch={onSearch} />
      </div>
      
      {/* Abstract pattern for the background */}
      <div className="absolute top-0 right-0 opacity-10 w-full h-full">
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <pattern id="hatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="white" strokeWidth="2" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#hatch)" />
          <circle cx="300" cy="100" r="50" fill="white" fillOpacity="0.1" />
          <circle cx="80" cy="300" r="80" fill="white" fillOpacity="0.1" />
        </svg>
      </div>
    </div>
  );
};
