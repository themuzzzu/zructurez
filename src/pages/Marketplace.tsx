
import { Button } from "@/components/ui/button";
import { ShoppingSection } from "@/components/ShoppingSection";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Cart } from "@/components/cart/Cart";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchInput } from "@/components/SearchInput";
import { ProductFilters } from "@/components/marketplace/ProductFilters";
import { MarketplaceBanner } from "@/components/marketplace/MarketplaceBanner";
import { CategoryAvatars } from "@/components/marketplace/CategoryAvatars";
import { DealsSection } from "@/components/marketplace/DealsSection";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";
import { Separator } from "@/components/ui/separator";

const Marketplace = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [showUsed, setShowUsed] = useState(false);
  const [showBranded, setShowBranded] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");

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

  return (
    <div className="min-h-screen bg-background pt-4 md:pt-6 pb-16">
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
        {/* Banner Section */}
        <div className="mb-6">
          <MarketplaceBanner />
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-foreground">Shop by Category</h2>
          <CategoryAvatars onCategorySelect={handleCategorySelect} />
        </div>
        
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

        <Separator className="my-6" />
        
        {/* Filters and Products */}
        <div className="pt-2">
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
  );
};

export default Marketplace;
