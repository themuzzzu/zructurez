
import { ShoppingSection } from "@/components/ShoppingSection";
import { GridLayoutType } from "@/components/products/types/layouts";

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
  gridLayout?: GridLayoutType;
}

export const SearchTabContent = ({ 
  searchQuery,
  selectedCategory,
  showDiscounted,
  showUsed,
  showBranded,
  sortOption,
  priceRange,
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
