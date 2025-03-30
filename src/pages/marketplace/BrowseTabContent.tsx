
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";
import { RecommendedProducts } from "@/components/marketplace/RecommendedProducts";
import { DiscountCollection } from "@/components/marketplace/DiscountCollection";
import { CategoryAvatars } from "@/components/marketplace/CategoryAvatars";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { TrendingSearches } from "@/components/marketplace/TrendingSearches";
import { GridLayoutType } from "@/components/products/types/ProductTypes";

interface BrowseTabContentProps {
  handleCategorySelect: (category: string) => void;
  handleSearchSelect: (term: string) => void;
  gridLayout?: GridLayoutType;
}

export const BrowseTabContent = ({ 
  handleCategorySelect, 
  handleSearchSelect,
  gridLayout = "grid4x4"
}: BrowseTabContentProps) => {
  return (
    <div className="space-y-10">
      <CategoryAvatars onCategorySelect={handleCategorySelect} />
      <TrendingSearches onSearchSelect={handleSearchSelect} />
      <TrendingProducts gridLayout={gridLayout} />
      <DiscountCollection gridLayout={gridLayout} />
      <RecommendedProducts gridLayout={gridLayout} />
      <SponsoredProducts gridLayout={gridLayout} />
    </div>
  );
};
