
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SearchHeader } from "@/components/search/SearchHeader";
import { ProductSearchResults } from "@/components/search/ProductSearchResults";
import { ImprovedSearchFilters } from "@/components/search/ImprovedSearchFilters";
import { useSearch } from "@/hooks/useSearch";
import { SearchFilters } from "@/types/search";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function MarketplaceSearch() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [gridLayout, setGridLayout] = useState<"grid4x4" | "grid2x2" | "grid1x1">("grid4x4");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const { results, isLoading, search, correctedQuery, updateFilters } = useSearch({
    initialQuery: query,
    suggestionsEnabled: false
  });

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    updateFilters(newFilters);
    search(query, newFilters);
  };

  const handleResetFilters = () => {
    search(query);
    toast.success("Filters have been reset");
  };
  
  const handleSortChange = (sortOption: string) => {
    handleFilterChange({ sortBy: sortOption as SearchFilters['sortBy'] });
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Marketplace", href: "/marketplace" },
    { label: query, href: `/search/marketplace?q=${query}` }
  ];
  
  const totalResults = results.length;

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-2 md:px-4 py-4">
        <SearchHeader 
          query={query}
          totalResults={results.length}
          breadcrumbs={breadcrumbs}
        />
        
        {/* Sort options - Desktop */}
        <div className="hidden md:flex items-center justify-between border-b pb-3 mb-4">
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-3">Sort By</span>
            <div className="flex space-x-1">
              {['relevance', 'newest', 'price-asc', 'price-desc', 'popularity'].map((sortOption) => (
                <Button
                  key={sortOption}
                  variant="ghost"
                  size="sm"
                  className="text-sm font-normal"
                  onClick={() => handleSortChange(sortOption)}
                >
                  {sortOption === 'price-asc' ? 'Price: Low to High' : 
                   sortOption === 'price-desc' ? 'Price: High to Low' : 
                   sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={gridLayout === "grid4x4" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setGridLayout("grid4x4")}
            >
              Grid
            </Button>
            <Button
              variant={gridLayout === "grid2x2" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setGridLayout("grid2x2")}
            >
              Large
            </Button>
            <Button
              variant={gridLayout === "grid1x1" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setGridLayout("grid1x1")}
            >
              List
            </Button>
          </div>
        </div>
        
        {/* Mobile filters and sort */}
        <div className="flex md:hidden items-center justify-between mb-4 pb-2 border-b">
          <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] sm:w-[350px] overflow-y-auto">
              <div className="py-2">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <ImprovedSearchFilters
                  filters={{}}
                  onChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
          
          <Tabs defaultValue="relevance" className="w-[200px]">
            <TabsList className="w-full">
              <TabsTrigger value="relevance" className="flex-1">Relevance</TabsTrigger>
              <TabsTrigger value="price" className="flex-1">Price</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Main content area with filters sidebar and product grid */}
        <div className="flex flex-col md:flex-row gap-5">
          {/* Desktop filters sidebar - fixed width */}
          <div className="hidden md:block w-[240px] flex-shrink-0">
            <div className="sticky top-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
              <ImprovedSearchFilters
                filters={{}}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          </div>
          
          {/* Main product grid */}
          <div className="flex-1 min-w-0">
            {/* Show corrected query if any */}
            {correctedQuery && correctedQuery !== query && (
              <div className="mb-4 text-sm">
                Showing results for <span className="font-medium">{correctedQuery}</span> instead of <span className="italic">{query}</span>
              </div>
            )}
            
            {/* Results summary - desktop */}
            <div className="hidden md:block mb-4">
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Searching..." : `Showing ${totalResults} results for "${query}"`}
              </p>
            </div>
            
            {/* Product grid */}
            <ProductSearchResults
              results={results}
              isLoading={isLoading}
              query={query}
              gridLayout={gridLayout}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
