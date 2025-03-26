
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
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWithPerformance } from "@/utils/apiPerformance";
import { globalCache } from "@/utils/cacheUtils";
import { measureRenderTime } from "@/utils/performanceTracking";
import { trackNavigation, prefetchCategoryProducts } from "@/services/prefetchService";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";
import { MarketplaceFeatures } from "@/components/marketplace/MarketplaceFeatures";
import { MarketplacePromotions } from "@/components/marketplace/MarketplacePromotions";
import { LocalBusinessSpotlight } from "@/components/marketplace/LocalBusinessSpotlight";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";
import { CategoryIconGrid } from "@/components/marketplace/CategoryIconGrid";
import { WishlistSuggestions } from "@/components/marketplace/WishlistSuggestions";
import { DiscountCollection } from "@/components/marketplace/DiscountCollection";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";

// Fallback components for loading states
const HeroFallback = () => <Skeleton className="h-56 w-full rounded-lg mb-6" />;
const FeaturesFallback = () => <Skeleton className="h-32 w-full rounded-lg mb-6" />;
const PromotionsFallback = () => <Skeleton className="h-48 w-full rounded-lg mb-6" />;
const SpotlightFallback = () => <Skeleton className="h-40 w-full rounded-lg mb-6" />;
const BannerFallback = () => <Skeleton className="h-56 w-full rounded-lg mb-6" />;

const OptimizedMarketplace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Track initial render performance
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.debug(`Marketplace initial render time: ${(endTime - startTime).toFixed(2)}ms`);
    };
  }, []);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "all");
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [showUsed, setShowUsed] = useState(false);
  const [showBranded, setShowBranded] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [activeTab, setActiveTab] = useState(searchQuery || selectedCategory !== "all" ? "search" : "browse");

  // Sample data for discount collections
  const homeAppliancesData = [
    { id: "1", name: "Air Conditioners", image: "https://images.unsplash.com/photo-1599619339570-40c0d33ea93b?q=80&w=200&auto=format&fit=crop" },
    { id: "2", name: "Refrigerators", image: "https://images.unsplash.com/photo-1584269600519-b5144c90c3ea?q=80&w=200&auto=format&fit=crop" },
    { id: "3", name: "Washing Machines", image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=200&auto=format&fit=crop" },
    { id: "4", name: "Microwaves", image: "https://images.unsplash.com/photo-1585657786027-b314574ebd91?q=80&w=200&auto=format&fit=crop" },
  ];
  
  const fashionData = [
    { id: "1", name: "Women's Clothing", image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=200&auto=format&fit=crop" },
    { id: "2", name: "Men's Clothing", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=200&auto=format&fit=crop" },
    { id: "3", name: "Shoes", image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=200&auto=format&fit=crop" },
    { id: "4", name: "Accessories", image: "https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?q=80&w=200&auto=format&fit=crop" },
  ];

  // Update URL when search or category changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    
    const newSearch = params.toString();
    if (newSearch) {
      navigate(`/marketplace?${newSearch}`, { replace: true });
    } else {
      navigate('/marketplace', { replace: true });
    }
  }, [searchQuery, selectedCategory, navigate]);

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
          {/* Hero Section - Only visible on browse tab */}
          {activeTab === "browse" && (
            <>
              <MarketplaceHero 
                onCategorySelect={handleCategorySelect}
                onSearch={handleSearchSelect}
              />
              
              <BannerCarousel />
              
              <CategoryIconGrid />
              
              <WishlistSuggestions />
              
              <DiscountCollection
                title="Home Appliances"
                subtitle="Great deals on essentials"
                discount="Up to 55% off"
                items={homeAppliancesData}
                viewAllLink="/marketplace?category=appliances"
              />
              
              <SponsoredProducts />
              
              <DiscountCollection
                title="Fashion & Accessories"
                subtitle="Latest trends and styles"
                discount="Up to 60% off"
                items={fashionData}
                viewAllLink="/marketplace?category=fashion"
              />
              
              <MarketplaceFeatures />
            </>
          )}
          
          <MarketplaceTabs activeTab={activeTab} setActiveTab={setActiveTab}>
            <TabsContent value="browse" className="animate-in fade-in-50 duration-300">
              <BrowseTabContent 
                handleCategorySelect={handleCategorySelect}
                handleSearchSelect={handleSearchSelect}
              />
              
              <TrendingProducts />
              
              <LocalBusinessSpotlight />
              <MarketplacePromotions />
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
        </div>
      </div>
    </Layout>
  ));
};

export default OptimizedMarketplace;
