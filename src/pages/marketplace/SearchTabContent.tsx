
import { Button } from "@/components/ui/button";
import { ShoppingSection } from "@/components/ShoppingSection";
import { ProductFilters } from "@/components/marketplace/ProductFilters";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { useState } from "react";
import { TrendingSearches } from "@/components/marketplace/TrendingSearches";

interface SearchTabContentProps {
  searchQuery: string;
  selectedCategory: string;
  showDiscounted: boolean;
  setShowDiscounted: (show: boolean) => void;
  showUsed: boolean;
  setShowUsed: (show: boolean) => void;
  showBranded: boolean;
  setShowBranded: (show: boolean) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
  resetFilters: () => void;
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
  resetFilters
}: SearchTabContentProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="animate-fade-up">
      {/* Trending Searches */}
      {!searchQuery && (
        <TrendingSearches onSearchSelect={(search) => window.location.href = `/marketplace?search=${encodeURIComponent(search)}`} />
      )}
      
      {/* Filters and Products */}
      <div className="pt-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            {selectedCategory !== "all" 
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace(/-/g, ' ')} Products` 
              : searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : 'All Products'}
          </h2>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
        
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild className="md:hidden block mb-4">
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filter Products
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filter Products</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <ProductFilters 
                selectedCategory={selectedCategory}
                onCategorySelect={(category) => selectedCategory}
                showDiscounted={showDiscounted}
                onDiscountedChange={setShowDiscounted}
                showUsed={showUsed}
                onUsedChange={setShowUsed}
                showBranded={showBranded}
                onBrandedChange={setShowBranded}
                sortOption={sortOption}
                onSortChange={setSortOption}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
              />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 hidden md:block">
            <div className="sticky top-24">
              <ProductFilters 
                selectedCategory={selectedCategory}
                onCategorySelect={(category) => selectedCategory}
                showDiscounted={showDiscounted}
                onDiscountedChange={setShowDiscounted}
                showUsed={showUsed}
                onUsedChange={setShowUsed}
                showBranded={showBranded}
                onBrandedChange={setShowBranded}
                sortOption={sortOption}
                onSortChange={setSortOption}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
              />
            </div>
          </div>
          
          <div className="md:col-span-3">
            <ShoppingSection 
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              showDiscounted={showDiscounted}
              showUsed={showUsed}
              showBranded={showBranded}
              sortOption={sortOption}
              priceRange={priceRange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
