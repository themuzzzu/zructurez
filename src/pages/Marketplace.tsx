import { Button } from "@/components/ui/button";
import { ShoppingSection } from "@/components/ShoppingSection";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Cart } from "@/components/cart/Cart";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchInput } from "@/components/SearchInput";
import { ProductFilters } from "@/components/marketplace/ProductFilters";

const Marketplace = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [showUsed, setShowUsed] = useState(false);
  const [showBranded, setShowBranded] = useState(false);
  const [showOpenOnly, setShowOpenOnly] = useState(true);
  const [sortOption, setSortOption] = useState("newest");

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
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container max-w-[1400px]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Marketplace</h1>
            </div>
            
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <div className="relative">
                  <Button variant="outline" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow-sm animate-fade-in">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Shopping Cart</SheetTitle>
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
              className="max-w-xl mx-auto"
            />
            <ProductFilters 
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              showDiscounted={showDiscounted}
              onDiscountedChange={() => setShowDiscounted(!showDiscounted)}
              showUsed={showUsed}
              onUsedChange={() => setShowUsed(!showUsed)}
              showBranded={showBranded}
              onBrandedChange={() => setShowBranded(!showBranded)}
              showOpenOnly={showOpenOnly}
              onOpenOnlyChange={() => setShowOpenOnly(!showOpenOnly)}
              sortOption={sortOption}
              onSortChange={setSortOption}
            />
          </div>

          <ShoppingSection 
            searchQuery={searchQuery} 
            selectedCategory={selectedCategory === "All" ? null : selectedCategory}
            showDiscounted={showDiscounted}
            showUsed={showUsed}
            showBranded={showBranded}
            showOpenOnly={showOpenOnly}
            sortOption={sortOption}
          />
        </div>
      </div>
    </div>
  );
};

export default Marketplace;