
import { useState, useEffect, Suspense, lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { MarketplaceHeader } from "./MarketplaceHeader";
import { MarketplaceTabs } from "./MarketplaceTabs";
import { BrowseTabContent } from "./BrowseTabContent";
import { CategoryTabContent } from "./CategoryTabContent";
import { SearchTabContent } from "./SearchTabContent";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWithPerformance } from "@/utils/apiPerformance";
import { globalCache } from "@/utils/cacheUtils";
import { measureRenderTime } from "@/utils/performanceTracking";
import { trackNavigation, prefetchCategoryProducts } from "@/services/prefetchService";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Lazy load these components for code splitting
const LazyMarketplaceHero = lazy(() => import("@/components/marketplace/MarketplaceHero").then(
  module => ({ default: module.MarketplaceHero })
));
const LazyMarketplaceFeatures = lazy(() => import("@/components/marketplace/MarketplaceFeatures").then(
  module => ({ default: module.MarketplaceFeatures })
));
const LazyMarketplacePromotions = lazy(() => import("@/components/marketplace/MarketplacePromotions").then(
  module => ({ default: module.MarketplacePromotions })
));
const LazyLocalBusinessSpotlight = lazy(() => import("@/components/marketplace/LocalBusinessSpotlight").then(
  module => ({ default: module.LocalBusinessSpotlight })
));
const LazyBannerCarousel = lazy(() => import("@/components/marketplace/BannerCarousel").then(
  module => ({ default: module.BannerCarousel })
));

// Fallback components while lazy components load
const HeroFallback = () => <Skeleton className="h-56 w-full rounded-lg mb-6" />;
const FeaturesFallback = () => <Skeleton className="h-32 w-full rounded-lg mb-6" />;
const PromotionsFallback = () => <Skeleton className="h-48 w-full rounded-lg mb-6" />;
const SpotlightFallback = () => <Skeleton className="h-40 w-full rounded-lg mb-6" />;

const OptimizedMarketplace = () => {
  // Track initial render performance
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.debug(`Marketplace initial render time: ${(endTime - startTime).toFixed(2)}ms`);
    };
  }, []);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const location = useLocation();
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

  // Track page navigation for prefetching
  useEffect(() => {
    const currentPath = location.pathname;
    const referrerPath = document.referrer;
    
    if (referrerPath) {
      try {
        const referrerUrl = new URL(referrerPath);
        trackNavigation(referrerUrl.pathname, currentPath);
      } catch (e) {
        // Invalid URL, ignore
      }
    }
  }, [location.pathname]);

  // Prefetch category data when category is selected
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      prefetchCategoryProducts(selectedCategory);
    }
  }, [selectedCategory]);

  // Optimized cart count query with caching and stale-while-revalidate strategy
  const { data: cartItemCount = 0 } = useQuery({
    queryKey: ['cartCount'],
    queryFn: async () => {
      // Use our performance-enhanced fetching utility
      return fetchWithPerformance(
        'cartCount',
        'cart-count',
        30 * 1000, // 30 second cache TTL
        async () => {
          const { data: session } = await supabase.auth.getSession();
          if (!session?.session?.user) return 0;

          const { count, error } = await supabase
            .from('cart_items')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.session.user.id);

          if (error) throw error;
          return count || 0;
        }
      );
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  const handleCategorySelect = (category: string) => {
    console.log("Selected category:", category);
    setSelectedCategory(category);
    if (activeTab !== "search") {
      setActiveTab("search");
    }
    
    // Start prefetching products for this category
    prefetchCategoryProducts(category);
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
  return measureRenderTime('OptimizedMarketplace', () => (
    <Layout hideSidebar>
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-900 pb-16">
        {/* Header with optimized rendering */}
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
          {/* Hero Section - Only visible on browse tab and code-split */}
          {activeTab === "browse" && (
            <>
              <Suspense fallback={<HeroFallback />}>
                <LazyMarketplaceHero 
                  onCategorySelect={handleCategorySelect}
                  onSearch={handleSearchSelect}
                />
              </Suspense>
              
              {!isMobile && (
                <Suspense fallback={<Skeleton className="h-56 w-full rounded-lg mb-6" />}>
                  <LazyBannerCarousel />
                </Suspense>
              )}
              
              <Suspense fallback={<FeaturesFallback />}>
                <LazyMarketplaceFeatures />
              </Suspense>
            </>
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
              <Suspense fallback={<SpotlightFallback />}>
                <LazyLocalBusinessSpotlight />
              </Suspense>
              
              <Suspense fallback={<PromotionsFallback />}>
                <LazyMarketplacePromotions />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </Layout>
  ));
};

export default OptimizedMarketplace;
