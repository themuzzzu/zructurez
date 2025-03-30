
import { ShoppingSection } from "@/components/ShoppingSection";

interface SearchTabContentProps {
  searchQuery: string;
  selectedCategory: string;
  showDiscounted: boolean;
  setShowDiscounted: (value: boolean) => void;
  showUsed: boolean;
  setShowUsed: (value: boolean) => void;
  showBranded: boolean;
  setShowBranded: (value: boolean) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
  priceRange: string;
  setPriceRange: (value: string) => void;
  resetFilters: () => void;
  gridLayout?: "grid4x4" | "grid2x2" | "grid1x1";
}

export const SearchTabContent = ({ 
  searchQuery,
  selectedCategory,
  showDiscounted,
  setShowDiscounted,
  showUsed,
  setShowUsed,
  showBranded,
  setShowBranded,
  sortOption,
  setSortOption,
  priceRange,
  setPriceRange,
  resetFilters,
  gridLayout = "grid4x4"
}: SearchTabContentProps) => {
  return (
    <ShoppingSection
      searchQuery={searchQuery}
      selectedCategory={selectedCategory}
      showDiscounted={showDiscounted}
      showUsed={showUsed}
      showBranded={showBranded}
      sortOption={sortOption}
      priceRange={priceRange}
    />
  );
};
