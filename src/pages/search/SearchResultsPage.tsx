import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { ShoppingSection } from "@/components/ShoppingSection";
import { GridLayoutSelector } from "@/components/marketplace/GridLayoutSelector";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { LikeProvider } from "@/components/products/LikeContext";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";
import { useSearch } from "@/hooks/useSearch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProductFilters } from "@/components/marketplace/ProductFilters";

interface SearchResultsPageProps {
  type?: 'marketplace' | 'business' | 'services';
}

export default function SearchResultsPage({ type = 'marketplace' }: SearchResultsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();
  
  const initialLayout = (searchParams.get("layout") || "grid4x4") as GridLayoutType;
  const [gridLayout, setGridLayout] = useState<GridLayoutType>(initialLayout);
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [showDiscounted, setShowDiscounted] = useState(searchParams.get("discounted") === "true");
  const [showUsed, setShowUsed] = useState(searchParams.get("used") === "true");
  const [showBranded, setShowBranded] = useState(searchParams.get("branded") === "true");
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "newest");
  const [priceRange, setPriceRange] = useState(searchParams.get("price") || "all");
  
  const getTitle = () => {
    switch (type) {
      case 'marketplace':
        return 'Product Search';
      case 'business':
        return 'Business Search';
      case 'services':
        return 'Services Search';
      default:
        return 'Search Results';
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'marketplace':
        return 'Search for products...';
      case 'business':
        return 'Search for businesses...';
      case 'services':
        return 'Search for services...';
      default:
        return 'Search...';
    }
  };

  const { 
    results,
    isLoading,
    search,
    refreshResults
  } = useSearch({
    initialQuery: query,
    suggestionsEnabled: false
  });

  useEffect(() => {
    if (query) {
      search(query);
    }
  }, [query, search]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (gridLayout) {
      params.set("layout", gridLayout);
    }
    
    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }
    
    if (showDiscounted) {
      params.set("discounted", "true");
    } else {
      params.delete("discounted");
    }
    
    if (showUsed) {
      params.set("used", "true");
    } else {
      params.delete("used");
    }
    
    if (showBranded) {
      params.set("branded", "true");
    } else {
      params.delete("branded");
    }
    
    if (sortOption && sortOption !== "newest") {
      params.set("sort", sortOption);
    } else {
      params.delete("sort");
    }
    
    if (priceRange && priceRange !== "all") {
      params.set("price", priceRange);
    } else {
      params.delete("price");
    }
    
    if (searchParams.toString() !== params.toString()) {
      setSearchParams(params);
    }
  }, [gridLayout, selectedCategory, showDiscounted, showUsed, showBranded, sortOption, priceRange, searchParams, setSearchParams]);

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      const params = new URLSearchParams(searchParams);
      params.set("q", newQuery);
      setSearchParams(params);
    }
  };

  const handleGridLayoutChange = (layout: GridLayoutType) => {
    setGridLayout(layout);
    console.log("Grid layout changed to:", layout);
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
                {query ? `${getTitle()} - "${query}"` : getTitle()}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <GridLayoutSelector
                layout={gridLayout}
                onChange={handleGridLayoutChange}
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
          
          <div className="w-full max-w-2xl mx-auto">
            <SearchBar
              placeholder={getPlaceholder()}
              onSearch={handleSearch}
              showSuggestions={true}
              autoFocus={false}
              className="w-full"
              type={type}
            />
          </div>
          
          <div className="mt-6">
            <LikeProvider>
              {!isLoading && (!results || results.length === 0) ? (
                <EmptySearchResults 
                  searchTerm={query} 
                  onReset={resetFilters}
                />
              ) : (
                <ShoppingSection 
                  searchQuery={query}
                  selectedCategory={selectedCategory}
                  showDiscounted={showDiscounted}
                  showUsed={showUsed}
                  showBranded={showBranded}
                  sortOption={sortOption}
                  priceRange={priceRange}
                  gridLayout={gridLayout}
                  title="Search Results"
                />
              )}
            </LikeProvider>
          </div>
        </div>
      </div>
    </Layout>
  );
}
