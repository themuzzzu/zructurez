
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { EnhancedShoppingSection } from "@/components/EnhancedShoppingSection";
import { GridLayoutSelector } from "@/components/marketplace/GridLayoutSelector";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { LikeProvider } from "@/components/products/LikeContext";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";
import { useSearch } from "@/hooks/useSearch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProductFilters } from "@/components/marketplace/ProductFilters";

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();
  
  const [gridLayout, setGridLayout] = useState<GridLayoutType>("grid4x4");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [showUsed, setShowUsed] = useState(false);
  const [showBranded, setShowBranded] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  
  // Set up search using the hook
  const { 
    results,
    isLoading,
    search,
    refreshResults
  } = useSearch({
    initialQuery: query,
    suggestionsEnabled: false
  });

  // Search when query changes
  useEffect(() => {
    if (query) {
      search(query);
    }
  }, [query, search]);

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      const params = new URLSearchParams(searchParams);
      params.set("q", newQuery);
      setSearchParams(params);
    }
  };

  const resetFilters = () => {
    setSelectedCategory("");
    setShowDiscounted(false);
    setShowUsed(false);
    setShowBranded(false);
    setSortOption("newest");
    setPriceRange("all");
    refreshResults();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header with back button and title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl md:text-2xl font-bold">
                {query ? `Results for "${query}"` : "Search Results"}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <GridLayoutSelector
                layout={gridLayout}
                onChange={setGridLayout}
              />
              
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <h2 className="text-lg font-semibold mb-4">Filters</h2>
                  <ProductFilters 
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
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
                    onResetFilters={resetFilters}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          {/* Search bar */}
          <div className="w-full max-w-2xl mx-auto">
            <SearchBar
              placeholder="Search products, services, or businesses..."
              onSearch={handleSearch}
              showSuggestions={true}
              autoFocus={false}
              className="w-full"
            />
          </div>
          
          {/* Search results or empty state */}
          <div className="mt-6">
            <LikeProvider>
              {results && results.length > 0 ? (
                <EnhancedShoppingSection 
                  searchQuery={query}
                  showFilters={showFilters}
                  selectedCategory={selectedCategory}
                  showDiscounted={showDiscounted}
                  showUsed={showUsed}
                  showBranded={showBranded}
                  sortOption={sortOption}
                  priceRange={priceRange}
                  gridLayout={gridLayout}
                />
              ) : !isLoading && (
                <EmptySearchResults 
                  searchTerm={query} 
                  onReset={resetFilters}
                />
              )}
            </LikeProvider>
          </div>
        </div>
      </div>
    </Layout>
  );
}
