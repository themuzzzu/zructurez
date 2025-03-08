
import { Button } from "@/components/ui/button";
import { ShoppingSection } from "@/components/ShoppingSection";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Filter, 
  Search as SearchIcon, 
  LayoutGrid, 
  Tag,
  Smartphone,
  Tv,
  Shirt,
  Laptop,
  Baby,
  Home,
  BookOpen,
  Dumbbell,
  Utensils
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Cart } from "@/components/cart/Cart";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchInput } from "@/components/SearchInput";
import { ProductFilters } from "@/components/marketplace/ProductFilters";
import { MarketplaceBanner } from "@/components/marketplace/MarketplaceBanner";
import { CategoryAvatars } from "@/components/marketplace/CategoryAvatars";
import { DealsSection } from "@/components/marketplace/DealsSection";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";
import { TrendingSearches } from "@/components/marketplace/TrendingSearches";
import { Separator } from "@/components/ui/separator";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Marketplace = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [showUsed, setShowUsed] = useState(false);
  const [showBranded, setShowBranded] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [activeTab, setActiveTab] = useState("browse");

  const { data: cartItemCount = 0 } = useQuery({
    queryKey: ['cartCount'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return 0;

      const { count, error } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.session.user.id);

      if (error) throw error;
      return count || 0;
    },
  });

  const handleCategorySelect = (category: string) => {
    console.log("Selected category:", category);
    setSelectedCategory(category);
  };

  const handleSearchSelect = (term: string) => {
    setSearchQuery(term);
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setShowDiscounted(false);
    setShowUsed(false);
    setShowBranded(false);
    setSortOption("newest");
    setPriceRange("all");
  };

  useEffect(() => {
    // Scroll to top when category changes
    window.scrollTo(0, 0);
  }, [selectedCategory]);

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-16">
        {/* Header */}
        <div className="bg-primary px-4 py-3 mb-4 shadow-md sticky top-0 z-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Marketplace</h1>
              </div>
              
              <div className="hidden md:flex items-center flex-1 max-w-2xl mx-4">
                <SearchInput 
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="w-full bg-white rounded-l-md"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10 md:hidden"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="h-5 w-5" />
                </Button>
                
                <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                  <SheetTrigger asChild>
                    <div className="relative">
                      <Button variant="ghost" size="icon" className="text-white">
                        <ShoppingCart className="h-5 w-5" />
                        {cartItemCount > 0 && (
                          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-white text-xs flex items-center justify-center animate-fade-in">
                            {cartItemCount}
                          </span>
                        )}
                      </Button>
                    </div>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>Shopping Cart</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <Cart />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            {/* Mobile Search */}
            <div className="mt-3 md:hidden">
              <SearchInput 
                placeholder="Search products..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-full bg-white"
              />
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4">
          <Tabs defaultValue="browse" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-4">
              <TabsTrigger value="browse" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Browse</span>
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="hidden sm:inline">Categories</span>
              </TabsTrigger>
              <TabsTrigger value="search" className="flex items-center gap-2">
                <SearchIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse" className="space-y-6 animate-fade-up">
              {/* Banner Section */}
              <div className="mb-6">
                <MarketplaceBanner />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <CategoryAvatars onCategorySelect={handleCategorySelect} />
              </div>
              
              {/* Trending Searches */}
              <TrendingSearches onSearchSelect={handleSearchSelect} />
              
              {/* Deals Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-foreground">Deals of the Day</h2>
                <DealsSection />
              </div>

              <Separator className="my-6" />

              {/* Sponsored Products */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-foreground">Sponsored Products</h2>
                  <Button variant="link">View All</Button>
                </div>
                <SponsoredProducts />
              </div>

              <Separator className="my-6" />

              {/* Trending Products */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-foreground">Trending Products</h2>
                  <Button variant="link">View All</Button>
                </div>
                <TrendingProducts />
              </div>
            </TabsContent>
            
            <TabsContent value="categories" className="space-y-6 animate-fade-up">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Individual category cards here */}
                {[
                  { name: "Electronics", icon: <Smartphone className="h-8 w-8" />, count: 2345 },
                  { name: "Mobiles", icon: <Smartphone className="h-8 w-8" />, count: 1876 },
                  { name: "TVs & Appliances", icon: <Tv className="h-8 w-8" />, count: 932 },
                  { name: "Fashion", icon: <Shirt className="h-8 w-8" />, count: 4521 },
                  { name: "Computers", icon: <Laptop className="h-8 w-8" />, count: 753 },
                  { name: "Baby & Kids", icon: <Baby className="h-8 w-8" />, count: 621 },
                  { name: "Home & Furniture", icon: <Home className="h-8 w-8" />, count: 1423 },
                  { name: "Books & Education", icon: <BookOpen className="h-8 w-8" />, count: 532 },
                  { name: "Sports & Fitness", icon: <Dumbbell className="h-8 w-8" />, count: 345 },
                  { name: "Grocery", icon: <Utensils className="h-8 w-8" />, count: 986 },
                ].map((cat, idx) => (
                  <div 
                    key={idx} 
                    className="bg-card border border-border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelectedCategory(cat.name.toLowerCase().replace(/\s+/g, '-'));
                      setActiveTab("search");
                    }}
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                      {cat.icon}
                    </div>
                    <h3 className="font-medium text-foreground text-center">{cat.name}</h3>
                    <span className="text-sm text-muted-foreground">{cat.count} items</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="search" className="animate-fade-up">
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
                      />
                    </div>
                  </SheetContent>
                </Sheet>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-1 hidden md:block">
                    <div className="sticky top-24">
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Marketplace;
