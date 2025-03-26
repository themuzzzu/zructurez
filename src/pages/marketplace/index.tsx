
import { useState, useEffect, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { MarketplaceHeader } from "./MarketplaceHeader";
import { MarketplaceTabs } from "./MarketplaceTabs";
import { BrowseTabContent } from "./BrowseTabContent";
import { CategoryTabContent } from "./CategoryTabContent";
import { SearchTabContent } from "./SearchTabContent";
import { MarketplaceFeatures } from "@/components/marketplace/MarketplaceFeatures";
import { MarketplacePromotions } from "@/components/marketplace/MarketplacePromotions";
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";
import { LocalBusinessSpotlight } from "@/components/marketplace/LocalBusinessSpotlight";
import { Skeleton } from "@/components/ui/skeleton";
import { measureRenderTime } from "@/utils/performanceTracking";
import { globalCache } from "@/utils/cacheUtils";

// Simple fallback components
const FeaturesFallback = () => <Skeleton className="h-40 w-full" />;
const PromotionsFallback = () => <Skeleton className="h-40 w-full" />;

const Marketplace = () => {
  // Track initial render performance
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.debug(`Marketplace initial render time: ${(endTime - startTime).toFixed(2)}ms`);
    };
  }, []);

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

  // Optimized cart count query with caching
  const { data: cartItemCount = 0 } = useQuery({
    queryKey: ['cartCount'],
    queryFn: async () => {
      // Check cache first
      const cacheKey = 'cart-count';
      const cachedCount = globalCache.get<number>(cacheKey);
      if (cachedCount !== null) {
        return cachedCount;
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return 0;

      const { count, error } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.session.user.id);

      if (error) throw error;
      
      // Cache the result for 30 seconds
      const result = count || 0;
      globalCache.set(cacheKey, result, 30 * 1000);
      return result;
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  const handleCategorySelect = (category: string) => {
    console.log("Selected category:", category);
    setSelectedCategory(category);
    if (activeTab !== "search") {
      setActiveTab("search");
    }
  };

  const handleSearchSelect = (term: string) => {
    setSearchQuery(term);
    if (activeTab !== "search") {
      setActiveTab("search");
    }
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

  // Use the measureRenderTime utility for performance tracking
  return measureRenderTime('MarketplacePage', () => (
    <Layout hideSidebar>
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-900 pb-16">
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
          {/* Hero Section - Only visible on browse tab */}
          {activeTab === "browse" && (
            <MarketplaceHero 
              onCategorySelect={handleCategorySelect}
              onSearch={handleSearchSelect}
            />
          )}
          
          {activeTab === "browse" && (
            <Suspense fallback={<FeaturesFallback />}>
              <MarketplaceFeatures />
            </Suspense>
          )}
          
          <MarketplaceTabs activeTab={activeTab} setActiveTab={setActiveTab}>
            <TabsContent value="browse" className="animate-in fade-in-50 duration-300">
              <BrowseTabContent 
                handleCategorySelect={handleCategorySelect}
                handleSearchSelect={handleSearchSelect}
              />
            </TabsContent>
            
            <TabsContent value="categories" className="animate-in fade-in-50 duration-300">
              <CategoryTabContent 
                setSelectedCategory={setSelectedCategory}
                setActiveTab={setActiveTab}
              />
            </TabsContent>
            
            <TabsContent value="search" className="animate-in fade-in-50 duration-300">
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
          
          {activeTab === "browse" && (
            <>
              <LocalBusinessSpotlight />
              <Suspense fallback={<PromotionsFallback />}>
                <MarketplacePromotions />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </Layout>
  ));
};

export default Marketplace;
