
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { MarketplaceHeader } from "./MarketplaceHeader";
import { MarketplaceTabs } from "./MarketplaceTabs";
import { BrowseTabContent } from "./BrowseTabContent";
import { CategoryTabContent } from "./CategoryTabContent";
import { SearchTabContent } from "./SearchTabContent";

const Marketplace = () => {
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
        <MarketplaceHeader 
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          cartItemCount={cartItemCount}
        />

        <div className="max-w-[1400px] mx-auto px-4">
          <MarketplaceTabs activeTab={activeTab} setActiveTab={setActiveTab}>
            <TabsContent value="browse">
              <BrowseTabContent 
                handleCategorySelect={handleCategorySelect}
                handleSearchSelect={handleSearchSelect}
              />
            </TabsContent>
            
            <TabsContent value="categories">
              <CategoryTabContent 
                setSelectedCategory={setSelectedCategory}
                setActiveTab={setActiveTab}
              />
            </TabsContent>
            
            <TabsContent value="search">
              <SearchTabContent
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                showDiscounted={showDiscounted}
                setShowDiscounted={setShowDiscounted}
                showUsed={showUsed}
                setShowUsed={setShowUsed}
                showBranded={showBranded}
                setShowBranded={setShowBranded}
                sortOption={sortOption}
                setSortOption={setSortOption}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                resetFilters={resetFilters}
              />
            </TabsContent>
          </MarketplaceTabs>
        </div>
      </div>
    </Layout>
  );
};

export default Marketplace;
