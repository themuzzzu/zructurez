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

const Marketplace = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-4 pb-16 px-4 md:pt-20 md:px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-4">
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
            
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <div className="relative">
                  <Button variant="ghost" size="icon" className="text-white">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center animate-fade-in">
                        {cartItemCount}
                      </span>
                    )}
                  </Button>
                </div>
              </SheetTrigger>
              <SheetContent className="w-full sm:w-[540px] bg-[#0a0a0a] border-zinc-800">
                <SheetHeader>
                  <SheetTitle className="text-white">Shopping Cart</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <Cart />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="space-y-4">
            <SearchInput 
              placeholder="Search products..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full"
            />
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

          <ShoppingSection 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory === "All" ? null : selectedCategory}
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