
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MarketplaceBanner } from "@/components/marketplace/MarketplaceBanner";
import { CategoryAvatars } from "@/components/marketplace/CategoryAvatars";
import { TrendingSearches } from "@/components/marketplace/TrendingSearches";
import { DealsSection } from "@/components/marketplace/DealsSection";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";
import { ShoppingBag, ArrowRightCircle } from "lucide-react";
import { ShoppingSection } from "@/components/ShoppingSection";

interface BrowseTabContentProps {
  handleCategorySelect: (category: string) => void;
  handleSearchSelect: (term: string) => void;
}

export const BrowseTabContent = ({ 
  handleCategorySelect, 
  handleSearchSelect 
}: BrowseTabContentProps) => {
  return (
    <div className="space-y-8">
      {/* Banner Section */}
      <div className="mb-4">
        <MarketplaceBanner />
      </div>

      {/* Categories */}
      <div className="mb-4">
        <CategoryAvatars onCategorySelect={handleCategorySelect} />
      </div>
      
      {/* Trending Searches */}
      <TrendingSearches onSearchSelect={handleSearchSelect} />
      
      {/* Deals Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Today's Deals</h2>
          </div>
          <Button variant="link" className="text-blue-600 font-medium flex items-center gap-1">
            View All <ArrowRightCircle size={16} />
          </Button>
        </div>
        <DealsSection />
      </div>

      <Separator className="my-8" />

      {/* Sponsored Products */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Sponsored Products</h2>
          <Button variant="link" className="text-blue-600 font-medium flex items-center gap-1">
            View All <ArrowRightCircle size={16} />
          </Button>
        </div>
        <SponsoredProducts />
      </div>

      <Separator className="my-8" />

      {/* Trending Products */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Trending Products</h2>
          <Button variant="link" className="text-blue-600 font-medium flex items-center gap-1">
            View All <ArrowRightCircle size={16} />
          </Button>
        </div>
        <TrendingProducts />
      </div>
      
      {/* All Products */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">All Products</h2>
        </div>
        <ShoppingSection />
      </div>
    </div>
  );
};
