
import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Filter, 
  Heart, 
  X, 
  SlidersHorizontal,
  Check
} from "lucide-react";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { SearchInput } from "@/components/SearchInput";
import { GridLayoutSelector } from "@/components/marketplace/GridLayoutSelector";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { LikeProvider } from "@/components/products/LikeContext";
import { useDebounce } from "@/hooks/useDebounce";
import { performSearch } from "@/services/searchService";
import { SearchFilters, SearchResult } from "@/types/search";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";
import { toast } from "sonner";

export default function MarketplaceSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get query from URL or default to empty string
  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Layout state
  const [gridLayout, setGridLayout] = useState<GridLayoutType>("grid3x3");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<SearchResult[]>([]);
  const [correctedQuery, setCorrectedQuery] = useState<string | undefined>();
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"relevance" | "price-asc" | "price-desc" | "newest" | "popularity">("relevance");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("all");
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Reference for infinite scrolling
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Available categories
  const categories = [
    "Electronics", 
    "Fashion", 
    "Books & Stationery", 
    "Home & Living", 
    "Beauty & Personal Care",
    "Sports & Outdoors",
    "Toys & Kids",
    "Automotive Tools",
    "Health & Wellness",
    "Groceries"
  ];
  
  // Process search results
  useEffect(() => {
    if (!debouncedSearchTerm) return;
    
    // Update URL with search term
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("q", debouncedSearchTerm);
      return newParams;
    });
    
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const filterObj: SearchFilters = {
          includeSponsored: true,
          sortBy: sortBy,
          categories: selectedCategories.length > 0 ? selectedCategories : undefined,
          priceMin: priceRange[0] > 0 ? priceRange[0] : undefined,
          priceMax: priceRange[1] < 100000 ? priceRange[1] : undefined,
        };
        
        if (location !== "all") {
          // Add location as a custom property if needed
          (filterObj as any).location = location;
        }
        
        const { results, correctedQuery: corrected } = await performSearch(debouncedSearchTerm, filterObj);
        setProducts(results);
        setCorrectedQuery(corrected);
      } catch (error) {
        console.error("Error searching products:", error);
        toast.error("Failed to fetch search results");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [debouncedSearchTerm, sortBy, selectedCategories, priceRange, location]);
  
  // Update active filters count
  useEffect(() => {
    let count = 0;
    if (sortBy !== "relevance") count++;
    if (priceRange[0] > 0 || priceRange[1] < 100000) count++;
    if (selectedCategories.length > 0) count++;
    if (location !== "all") count++;
    
    setActiveFiltersCount(count);
  }, [sortBy, priceRange, selectedCategories, location]);
  
  // Handle search form submission
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    // Update the search parameters and URL
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("q", searchTerm);
      return newParams;
    });
  };
  
  // Handle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSortBy("relevance");
    setPriceRange([0, 100000]);
    setSelectedCategories([]);
    setLocation("all");
    toast.success("Filters have been reset");
  };
  
  // Handle load more products (for future implementation)
  const handleLoadMore = () => {
    // This would be implemented with pagination or infinite scroll
    toast.info("Loading more products...");
  };

  return (
    <Layout>
      <div className="container max-w-7xl px-2 sm:px-4 pt-20 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">
              {searchTerm ? `Results for "${searchTerm}"` : "Search Products"}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <GridLayoutSelector 
              layout={gridLayout} 
              onChange={(layout) => setGridLayout(layout)} 
            />
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/wishlist')}
              aria-label="View wishlist"
            >
              <Heart className="h-5 w-5" />
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant={activeFiltersCount > 0 ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-2 ml-auto sm:ml-0"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[380px]">
                <SheetHeader>
                  <SheetTitle className="flex justify-between items-center">
                    <span>Filter Products</span>
                    <Button onClick={resetFilters} variant="ghost" size="sm" className="flex items-center gap-1">
                      <X className="h-4 w-4" />
                      Reset
                    </Button>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="py-6 space-y-6">
                  {/* Sort options */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Sort By</h3>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort By..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="popularity">Most Popular</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  {/* Price range */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">Price Range</h3>
                    <div className="px-2">
                      <Slider 
                        defaultValue={[0, 100000]}
                        value={priceRange}
                        min={0}
                        max={100000}
                        step={500}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="my-6"
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-sm">₹{priceRange[0].toLocaleString()}</p>
                        <p className="text-sm">₹{priceRange[1].toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Categories */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Categories</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map(category => (
                        <Button
                          key={category}
                          size="sm"
                          variant={selectedCategories.includes(category) ? "default" : "outline"}
                          onClick={() => toggleCategory(category)}
                          className="justify-start h-auto py-2 text-left"
                        >
                          <Check 
                            className={`mr-2 h-3.5 w-3.5 transition-all ${
                              selectedCategories.includes(category) ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                          <span className="truncate">{category}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Location */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Location</h3>
                    <RadioGroup value={location} onValueChange={setLocation}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all-loc" />
                        <Label htmlFor="all-loc">All</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="local" id="local" />
                        <Label htmlFor="local">Local Only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="city" id="city" />
                        <Label htmlFor="city">City-wide</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <SheetFooter className="sm:justify-start">
                  <SheetClose asChild>
                    <Button>Apply Filters</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative max-w-xl">
            <SearchInput
              placeholder="Search products..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="w-full"
            />
          </form>
        </div>
        
        {/* Active filters display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {sortBy !== "relevance" && (
              <Badge variant="outline" className="px-2 py-1">
                Sort: {sortBy === "price-asc" ? "Price Low-High" : 
                       sortBy === "price-desc" ? "Price High-Low" :
                       sortBy === "popularity" ? "Popular" :
                       sortBy === "newest" ? "Newest" : sortBy}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => setSortBy("relevance")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {(priceRange[0] > 0 || priceRange[1] < 100000) && (
              <Badge variant="outline" className="px-2 py-1">
                Price: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => setPriceRange([0, 100000])}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {selectedCategories.map(category => (
              <Badge key={category} variant="outline" className="px-2 py-1">
                {category}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => toggleCategory(category)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            
            {location !== "all" && (
              <Badge variant="outline" className="px-2 py-1">
                {location === "local" ? "Local Only" : "City-wide"}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => setLocation("all")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7"
              onClick={resetFilters}
            >
              Clear All
            </Button>
          </div>
        )}
        
        {/* Corrected query suggestion */}
        {correctedQuery && correctedQuery !== debouncedSearchTerm && (
          <div className="mb-4 text-sm">
            <span className="text-muted-foreground">Showing results for </span>
            <span className="font-medium">{correctedQuery}</span>
            <span className="text-muted-foreground"> instead of </span>
            <span className="italic">{debouncedSearchTerm}</span>
          </div>
        )}
        
        {/* Products grid with LikeProvider */}
        <LikeProvider>
          {!isLoading && products.length === 0 ? (
            <EmptySearchResults 
              searchTerm={debouncedSearchTerm} 
              onReset={resetFilters}
            />
          ) : (
            <ProductsGrid
              products={products}
              isLoading={isLoading}
              layout={gridLayout}
              searchQuery={debouncedSearchTerm}
              hasMore={false} // Would be true in a real implementation with pagination
              onLoadMore={handleLoadMore}
              loadMoreRef={loadMoreRef}
              onLayoutChange={setGridLayout}
            />
          )}
        </LikeProvider>
      </div>
    </Layout>
  );
}
