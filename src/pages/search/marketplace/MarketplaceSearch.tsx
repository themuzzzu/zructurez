import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Filter, Grid2X2, Grid, ListFilter, ArrowLeft, Search as SearchIcon } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { SearchFilters } from "@/types/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNetworkStatus } from "@/providers/NetworkMonitor";
import { MarketplaceSearchFilters } from "@/components/search/MarketplaceSearchFilters";
import { EnhancedProductSearchResults } from "@/components/search/EnhancedProductSearchResults";
import { ServiceSearchResults } from "@/components/search/ServiceSearchResults";
import { BusinessSearchResults } from "@/components/search/BusinessSearchResults";

export default function MarketplaceSearch() {
  // Get search parameters from the URL
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();
  
  // Extract query from URL parameters
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  
  // Get grid layout preference from localStorage or default to 4x4
  const [gridLayout, setGridLayout] = useState<"grid1x1" | "grid2x2" | "grid4x4">(() => {
    const savedLayout = localStorage.getItem("searchGridLayout");
    return (savedLayout === "grid1x1" || savedLayout === "grid2x2" || savedLayout === "grid4x4") 
      ? savedLayout 
      : "grid4x4";
  });
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

  // Set up search from the hook
  const { 
    results, 
    isLoading, 
    search,
    correctedQuery = null,
    updateFilters = () => {} // Default empty function in case it doesn't exist
  } = useSearch({
    initialQuery: searchParams.get("q") || "",
    suggestionsEnabled: true
  });

  // Update search query when URL parameter changes
  useEffect(() => {
    setSearchQuery(queryParam);
    
    if (queryParam) {
      search(queryParam);
    }
  }, [queryParam, search]);

  // Save grid layout preference to localStorage
  useEffect(() => {
    localStorage.setItem("searchGridLayout", gridLayout);
  }, [gridLayout]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update URL with search params
      const newParams = new URLSearchParams(searchParams);
      newParams.set("q", searchQuery);
      setSearchParams(newParams);
      
      // Call search function
      search(searchQuery);
    }
  };

  // Handle filter application
  const applyFilters = (newFilters: Partial<SearchFilters>) => {
    // Apply filters to search
    updateFilters(newFilters);
    search(queryParam, newFilters);
    
    // Update applied filters for UI badges
    const filtersArray: string[] = [];
    
    if (newFilters.categories?.length) {
      filtersArray.push(`Categories: ${newFilters.categories.length}`);
    }
    
    if (newFilters.priceMin !== undefined && newFilters.priceMax !== undefined) {
      filtersArray.push(`Price: ₹${newFilters.priceMin} - ₹${newFilters.priceMax}`);
    }
    
    if (newFilters.sortBy && newFilters.sortBy !== "relevance") {
      const sortLabels: Record<string, string> = {
        "price-asc": "Price: Low to High",
        "price-desc": "Price: High to Low",
        "newest": "Newest First",
        "popularity": "Popularity"
      };
      filtersArray.push(`Sort: ${sortLabels[newFilters.sortBy] || newFilters.sortBy}`);
    }
    
    setAppliedFilters(filtersArray);
    
    // Close filter panel after applying on mobile
    setIsFilterOpen(false);
  };

  // Reset filters to default values
  const resetFilters = () => {
    setSelectedCategories([]);
    setAppliedFilters([]);
    
    search(queryParam);
    setIsFilterOpen(false);
  };

  // Handle grid layout change
  const handleLayoutChange = (layout: "grid1x1" | "grid2x2" | "grid4x4") => {
    setGridLayout(layout);
  };

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-2 md:px-4 py-4">
        {/* Header with back button, search bar and layout toggles */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">
                {queryParam ? `Search: "${queryParam}"` : "Search"}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant={gridLayout === "grid4x4" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => handleLayoutChange("grid4x4")}
                className="hidden md:flex"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={gridLayout === "grid2x2" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => handleLayoutChange("grid2x2")}
                className="hidden md:flex"
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button 
                variant={gridLayout === "grid1x1" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => handleLayoutChange("grid1x1")}
                className="hidden md:flex"
              >
                <ListFilter className="h-4 w-4" />
              </Button>
              
              <div className="flex md:hidden">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1.5"
                    >
                      <Filter className="h-4 w-4" />
                      <span>Filters</span>
                      {appliedFilters.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {appliedFilters.length}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[85%] sm:w-[350px] p-0">
                    <div className="flex flex-col h-full">
                      <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold">Filters</h3>
                      </div>
                      <div className="flex-grow overflow-y-auto px-4 py-2">
                        <MarketplaceSearchFilters
                          onChange={applyFilters}
                          onReset={resetFilters}
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex w-full gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="default">
              Search
            </Button>
          </form>
          
          {/* Applied filters badges - mobile only */}
          {appliedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 md:hidden">
              {appliedFilters.map((filter, index) => (
                <Badge key={index} variant="outline" className="py-1">
                  {filter}
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 px-2"
                onClick={resetFilters}
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Tab navigation */}
        <Tabs defaultValue="products" value="products" onValueChange={() => {}} className="mb-6">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="products" className="flex-1 md:flex-none">Products</TabsTrigger>
            <TabsTrigger value="services" className="flex-1 md:flex-none">Services</TabsTrigger>
            <TabsTrigger value="businesses" className="flex-1 md:flex-none">Businesses</TabsTrigger>
          </TabsList>
          
          {/* Show corrected query suggestion if any */}
          {correctedQuery && correctedQuery !== searchParams.get("q") && (
            <div className="mt-3 text-sm">
              Did you mean: <Button 
                variant="link" 
                className="p-0 h-auto font-medium"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("q", correctedQuery);
                  setSearchParams(params);
                }}
              >
                {correctedQuery}
              </Button>?
            </div>
          )}
        </Tabs>
        
        {/* Main content area with filters sidebar and results */}
        <div className="flex flex-col md:flex-row gap-5">
          {/* Desktop filters sidebar - fixed width */}
          <div className="hidden md:block w-[240px] flex-shrink-0">
            <div className="sticky top-4 overflow-y-auto max-h-[calc(100vh-6rem)]">
              <MarketplaceSearchFilters
                onChange={applyFilters}
                onReset={resetFilters}
              />
            </div>
          </div>
          
          {/* Search results area */}
          <div className="flex-1 min-w-0">
            {/* Results summary - desktop */}
            <div className="hidden md:flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                {isLoading 
                  ? "Searching..." 
                  : `Showing ${results.length} results ${queryParam ? `for "${queryParam}"` : ""}`
                }
              </p>
              
              {/* Layout toggle buttons for desktop */}
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground mr-2">View:</span>
                <div className="flex border rounded-md overflow-hidden">
                  <Button 
                    variant={gridLayout === "grid4x4" ? "secondary" : "ghost"} 
                    size="sm"
                    onClick={() => handleLayoutChange("grid4x4")}
                    className="rounded-none border-0"
                  >
                    <Grid className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant={gridLayout === "grid2x2" ? "secondary" : "ghost"} 
                    size="sm"
                    onClick={() => handleLayoutChange("grid2x2")}
                    className="rounded-none border-0"
                  >
                    <Grid2X2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant={gridLayout === "grid1x1" ? "secondary" : "ghost"} 
                    size="sm"
                    onClick={() => handleLayoutChange("grid1x1")}
                    className="rounded-none border-0"
                  >
                    <ListFilter className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Tab content */}
            <TabsContent value="products" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <EnhancedProductSearchResults 
                results={results}
                isLoading={isLoading}
                query={queryParam}
                gridLayout={gridLayout}
              />
            </TabsContent>
            
            <TabsContent value="services" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <ServiceSearchResults
                results={results}
                isLoading={isLoading}
                query={queryParam}
              />
            </TabsContent>
            
            <TabsContent value="businesses" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <BusinessSearchResults
                results={results}
                isLoading={isLoading}
                query={queryParam}
              />
            </TabsContent>
            
            {/* Network offline message */}
            {!isOnline && !isLoading && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center gap-2">
                <div className="text-amber-500 rounded-full bg-amber-100 p-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wifi-off"><line x1="2" x2="22" y1="2" y2="22"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 4.17-2.65"/><path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"/><path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"/><path d="M5 13a10 10 0 0 1 5.24-2.76"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-amber-800">You're offline</p>
                  <p className="text-amber-700">Showing cached search results</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
