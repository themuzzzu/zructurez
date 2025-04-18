
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Grid2X2, LayoutGrid, Grip, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ProductCard } from "@/components/products/ProductCard";
import { useSearch } from "@/hooks/useSearch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LikeProvider } from "@/components/products/LikeContext";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function MarketplaceSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<"relevance" | "price-asc" | "price-desc" | "newest" | "popularity">("relevance");
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [showBranded, setShowBranded] = useState(false);
  const [gridLayout, setGridLayout] = useState<"grid1x1" | "grid2x2" | "grid4x4">(() => {
    return (localStorage.getItem("searchGridLayout") as any) || "grid4x4";
  });

  const { results, isLoading, search } = useSearch({
    initialQuery: query,
    suggestionsEnabled: false
  });

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      search(query);
    }
  }, [query, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams(searchParams);
      params.set("q", searchQuery);
      setSearchParams(params);
      search(searchQuery);
    }
  };

  const applyFilters = () => {
    search(searchQuery, {
      categories: selectedCategories,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      sortBy
    });
    setIsFilterOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-4 pb-16">
        {/* Header */}
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
                {searchQuery ? `Results for "${searchQuery}"` : "Search Products"}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <ToggleGroup 
                type="single" 
                value={gridLayout}
                onValueChange={(value: any) => {
                  if (value) {
                    setGridLayout(value);
                    localStorage.setItem("searchGridLayout", value);
                  }
                }}
                className="border rounded-md"
              >
                <ToggleGroupItem value="grid4x4" title="Grid View">
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="grid2x2" title="Medium View">
                  <Grid2X2 className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="grid1x1" title="List View">
                  <Grip className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>

              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                    {selectedCategories.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {selectedCategories.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    
                    {/* Categories */}
                    <div>
                      <h3 className="font-medium mb-2">Categories</h3>
                      <div className="space-y-2">
                        {["Fashion", "Electronics", "Home", "Beauty", "Sports"].map(category => (
                          <div key={category} className="flex items-center">
                            <Checkbox 
                              id={category}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCategories(prev => [...prev, category]);
                                } else {
                                  setSelectedCategories(prev => prev.filter(c => c !== category));
                                }
                              }}
                            />
                            <Label htmlFor={category} className="ml-2">{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Price Range */}
                    <div>
                      <h3 className="font-medium mb-2">Price Range</h3>
                      <div className="space-y-4">
                        <Slider
                          value={priceRange}
                          min={0}
                          max={10000}
                          step={100}
                          onValueChange={setPriceRange}
                        />
                        <div className="flex justify-between text-sm">
                          <span>₹{priceRange[0]}</span>
                          <span>₹{priceRange[1]}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Sort By */}
                    <div>
                      <h3 className="font-medium mb-2">Sort By</h3>
                      <RadioGroup value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <RadioGroupItem value="relevance" id="sort-relevance" />
                            <Label htmlFor="sort-relevance" className="ml-2">Relevance</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="price-asc" id="sort-price-asc" />
                            <Label htmlFor="sort-price-asc" className="ml-2">Price: Low to High</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="price-desc" id="sort-price-desc" />
                            <Label htmlFor="sort-price-desc" className="ml-2">Price: High to Low</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="newest" id="sort-newest" />
                            <Label htmlFor="sort-newest" className="ml-2">Newest First</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedCategories([]);
                          setPriceRange([0, 10000]);
                          setSortBy("relevance");
                          setShowDiscounted(false);
                          setShowBranded(false);
                        }}
                      >
                        Reset
                      </Button>
                      <Button className="flex-1" onClick={applyFilters}>
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>

        {/* Results */}
        <LikeProvider>
          <div>
            {isLoading ? (
              <motion.div
                className={`grid ${
                  gridLayout === "grid1x1" ? "grid-cols-1" :
                  gridLayout === "grid2x2" ? "grid-cols-1 sm:grid-cols-2" :
                  "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                } gap-4`}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted aspect-square rounded-md mb-2" />
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                ))}
              </motion.div>
            ) : results && results.length > 0 ? (
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
                {results.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard
                      product={{
                        ...product,
                        imageUrl: product.imageUrl || product.image_url,
                        price: product.price || 0,
                      }}
                      layout={gridLayout}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {query ? "No products found. Try different keywords or filters." : "Start searching to see products"}
                </p>
              </div>
            )}
          </div>
        </LikeProvider>
      </div>
    </Layout>
  );
}
