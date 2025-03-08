
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MarketplaceBanner } from "@/components/marketplace/MarketplaceBanner";
import { CategoryAvatars } from "@/components/marketplace/CategoryAvatars";
import { TrendingSearches } from "@/components/marketplace/TrendingSearches";
import { DealsSection } from "@/components/marketplace/DealsSection";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";

interface BrowseTabContentProps {
  handleCategorySelect: (category: string) => void;
  handleSearchSelect: (term: string) => void;
}

export const BrowseTabContent = ({ 
  handleCategorySelect, 
  handleSearchSelect 
}: BrowseTabContentProps) => {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Banner Section */}
      <div className="mb-6">
        <MarketplaceBanner />
      </div>

      {/* Categories */}
      <div className="mb-6">
        <CategoryAvatars onCategorySelect={handleCategorySelect} />
      </div>
      
      {/* Trending Searches */}
      <TrendingSearches onSearchSelect={handleSearchSelect} />
      
      {/* Deals Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-foreground">Deals of the Day</h2>
        <DealsSection />
      </div>

      <Separator className="my-6" />

      {/* Sponsored Products */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-foreground">Sponsored Products</h2>
          <Button variant="link">View All</Button>
        </div>
        <SponsoredProducts />
      </div>

      <Separator className="my-6" />

      {/* Trending Products */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-foreground">Trending Products</h2>
          <Button variant="link">View All</Button>
        </div>
        <TrendingProducts />
      </div>
    </div>
  );
};
