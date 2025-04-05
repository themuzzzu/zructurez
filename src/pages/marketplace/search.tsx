import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  ArrowLeft, 
  Filter, 
  SlidersHorizontal, 
  ChevronDown, 
  X,
  Search as SearchIcon,
  Grid,
  Grid2X2,
  LayoutGrid,
  Grip
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingSection } from "@/components/ShoppingSection";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";
import { useSearch } from "@/hooks/useSearch";
import { ProductCard } from "@/components/products/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LikeProvider } from "@/components/products/LikeContext";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function MarketplaceSearch() {
  // Get search parameters from the URL
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
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
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<"relevance" | "price-asc" | "price-desc" | "newest" | "popularity">("relevance");
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [showUsed, setShowUsed] = useState(false);
  const [showBranded, setShowBranded] = useState(false);
  const [location, setLocation] = useState("");

  // Set up search from the hook
  const { 
    query, 
    setQuery, 
    results, 
    isLoading, 
    search,
    correctedQuery
  } = useSearch({
    initialQuery: queryParam,
    suggestionsEnabled: true
  });

  // Update search query when URL parameter changes
  useEffect(() => {
    setSearchQuery(queryParam);
    setQuery(queryParam);
    
    if (queryParam) {
      search(queryParam);
    }
  }, [queryParam, search, setQuery]);

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
  const applyFilters = () => {
    // Apply filters to search
    search(searchQuery, {
      includeSponsored: true,
      sortBy,
      categories: selectedCategories,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      location: location
    });
    
    // Close filter panel after applying
    setIsFilterOpen(false);
  };

  // Reset filters to default values
  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000]);
    setSortBy("relevance");
    setShowDiscounted(false);
    setShowUsed(false);
    setShowBranded(false);
    setLocation("");
    search(searchQuery);
    setIsFilterOpen(false);
  };

  // Update category filter
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  // Animation variants for product cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  // Helper function to determine badge color based on tag
  const getTagColor = (tag: string) => {
    switch(tag.toLowerCase()) {
      case 'bestseller':
        return 'bg-amber-500 text-white';
      case 'new':
        return 'bg-blue-500 text-white';
      case 'hot deal':
        return 'bg-red-500 text-white';
      case 'trending':
        return 'bg-purple-500 text-white';
      case 'limited':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  // Helper function to determine discount badge color
  const getDiscountColor = (percentage: number) => {
    if (percentage >= 50) return 'bg-green-500 text-white';
    if (percentage >= 30) return 'bg-amber-500 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-4 pb-16">
        {/* Header with back button and search bar */}
        <div className="flex flex-col space-y-4 mb-6">
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
                {searchQuery ? `Results for "${searchQuery}"` : "Search Results"}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Grid Layout Selector */}
              <ToggleGroup 
                type="single" 
                value={gridLayout} 
                onValueChange={(value) => {
                  if (value && (value === "grid1x1" || value === "grid2x2" || value === "grid4x4")) {
                    setGridLayout(value);
                  }
                }}
                className="border rounded-md"
              >
                <ToggleGroupItem value="grid4x4" title="Compact View (4×4)">
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="grid2x2" title="Medium View (2×2)">
                  <Grid2X2 className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="grid1x1" title="Large View (1×1)">
                  <Grip className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
              
              {/* Filter button and panel */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="space-x-2"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <h2 className="text-lg font-semibold mb-4">Filters</h2>
                  
                  {/* Categories Section */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Categories</h3>
                    <div className="space-y-2">
                      {["Electronics", "Clothing", "Home", "Beauty", "Sports", "Books"].map(category => (
                        <div key={category} className="flex items-center">
                          <Checkbox 
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)} 
                            onCheckedChange={() => toggleCategory(category)}
                            className="mr-2"
                          />
                          <Label htmlFor={`category-${category}`}>{category}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Price Range Section */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Price Range</h3>
                      <div className="text-sm text-muted-foreground">
                        ₹{priceRange[0]} - ₹{priceRange[1]}
                      </div>
                    </div>
                    <Slider
                      min={0}
                      max={10000}
                      step={100}
                      value={priceRange}
                      onValueChange={(value: [number, number]) => setPriceRange(value)}
                      className="mt-2"
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Sort By Section */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Sort By</h3>
                    <RadioGroup value={sortBy} onValueChange={setSortBy as (value: string) => void}>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="relevance" id="sort-relevance" />
                        <Label htmlFor="sort-relevance">Relevance</Label>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="price-asc" id="sort-price-asc" />
                        <Label htmlFor="sort-price-asc">Price (Low to High)</Label>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="price-desc" id="sort-price-desc" />
                        <Label htmlFor="sort-price-desc">Price (High to Low)</Label>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="newest" id="sort-newest" />
                        <Label htmlFor="sort-newest">Newest First</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="popularity" id="sort-popularity" />
                        <Label htmlFor="sort-popularity">Popularity</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Additional Filters */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Additional Filters</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="show-discounted" 
                          checked={showDiscounted}
                          onCheckedChange={(checked) => setShowDiscounted(!!checked)}
                        />
                        <Label htmlFor="show-discounted">On Sale</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="show-used" 
                          checked={showUsed}
                          onCheckedChange={(checked) => setShowUsed(!!checked)}
                        />
                        <Label htmlFor="show-used">Used Items</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="show-branded" 
                          checked={showBranded}
                          onCheckedChange={(checked) => setShowBranded(!!checked)}
                        />
                        <Label htmlFor="show-branded">Branded Products</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Location Section */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Location</h3>
                    <Input 
                      placeholder="Enter city or postal code"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-4 mt-6">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={resetFilters}
                    >
                      Reset
                    </Button>
                    <Button 
                      variant="default"
                      className="flex-1"
                      onClick={applyFilters}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
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
        </div>

        {/* Tab navigation */}
        <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="businesses">Businesses</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Search results */}
        <LikeProvider>
          <div>
            {isLoading && (
              <div className="pb-4">
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "linear" }}
                  />
                </div>
              </div>
            )}
            
            {isLoading ? (
              <motion.div 
                className={`grid ${
                  gridLayout === "grid1x1" ? "grid-cols-1" :
                  gridLayout === "grid2x2" ? "grid-cols-1 sm:grid-cols-2" :
                  "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                } gap-4`}
              >
                {Array.from({ length: gridLayout === "grid1x1" ? 4 : 8 }).map((_, index) => (
                  <motion.div 
                    key={index} 
                    variants={itemVariants}
                    className="bg-muted rounded-md overflow-hidden shadow"
                  >
                    <div className={`aspect-${gridLayout === "grid1x1" ? "video" : "square"} w-full bg-muted animate-pulse`} />
                    <div className="p-3 space-y-2">
                      <div className="h-4 w-3/4 bg-muted-foreground/20 rounded animate-pulse"></div>
                      <div className="h-4 w-1/2 bg-muted-foreground/20 rounded animate-pulse"></div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : results.length > 0 ? (
              <TabsContent value="products" className="mt-0">
                <motion.div 
                  className={`grid ${
                    gridLayout === "grid1x1" ? "grid-cols-1" :
                    gridLayout === "grid2x2" ? "grid-cols-1 sm:grid-cols-2" :
                    "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  } gap-4`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {results.map((result) => (
                    <motion.div key={result.id} variants={itemVariants}>
                      <ProductCard 
                        product={{
                          id: result.id,
                          title: result.title,
                          description: result.description,
                          price: result.price || 0,
                          imageUrl: result.imageUrl || '',
                          category: result.category || '',
                          // Add highlight tags (simulated - would typically come from backend)
                          highlight_tags: result.highlight_tags || 
                            (Math.random() > 0.7 ? 
                              [['Bestseller', 'New', 'Hot Deal', 'Trending', 'Limited'][Math.floor(Math.random() * 5)]] 
                              : []),
                          // Add discount percentage if not already present
                          is_discounted: result.isDiscounted || false,
                          discount_percentage: result.discount_percentage || 
                            (result.isDiscounted ? Math.floor(Math.random() * 50) + 10 : undefined)
                        }}
                        layout={gridLayout}
                        sponsored={result.isSponsored}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            ) : (
              <EmptySearchResults 
                searchTerm={searchQuery} 
                onReset={resetFilters} 
              />
            )}
            
            {/* Did you mean suggestion */}
            {correctedQuery && correctedQuery !== queryParam && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p>
                  Did you mean: <Button 
                    variant="link" 
                    className="p-0 h-auto font-medium"
                    onClick={() => {
                      setSearchQuery(correctedQuery);
                      const params = new URLSearchParams(searchParams);
                      params.set("q", correctedQuery);
                      setSearchParams(params);
                    }}
                  >
                    {correctedQuery}
                  </Button>?
                </p>
              </div>
            )}
            
            {/* Services tab */}
            <TabsContent value="services" className="mt-0">
              <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Service search results will appear here</p>
              </div>
            </TabsContent>
            
            {/* Businesses tab */}
            <TabsContent value="businesses" className="mt-0">
              <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Business search results will appear here</p>
              </div>
            </TabsContent>
          </div>
        </LikeProvider>
      </div>
    </Layout>
  );
}
