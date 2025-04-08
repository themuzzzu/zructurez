
import { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AutocompleteSearch } from "@/components/marketplace/AutocompleteSearch";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";
import { CrazyDeals } from "@/components/marketplace/CrazyDeals";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { ShopByCategory } from "@/components/marketplace/ShopByCategory";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";
import { PersonalizedRecommendations } from "@/components/marketplace/PersonalizedRecommendations";
import { ProductRankings } from "@/components/rankings/ProductRankings";
import { LoadingView } from "@/components/LoadingView";
import { useLoading } from "@/providers/LoadingProvider";
import { FlashSale } from "@/components/marketplace/FlashSale";
import { BusinessCategoryGrid } from "@/components/home/BusinessCategoryGrid";
import { BusinessBannerAd } from "@/components/ads/BusinessBannerAd";
import { ServiceBannerAd } from "@/components/ads/ServiceBannerAd";
import { SponsoredServices } from "@/components/service-marketplace/SponsoredServices";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

// Import BrowseTabContent properly to avoid type errors
// We need to import the named export and convert it to a default export for lazy loading
const LazyBrowseTabContent = lazy(() => 
  import("@/pages/marketplace/BrowseTabContent").then(module => ({ 
    default: module.BrowseTabContent 
  }))
);

const LazySection = ({ children, type, fallbackCount = 4 }) => (
  <Suspense fallback={<LoadingView type={type} />}>
    {children}
  </Suspense>
);

export const UnifiedHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "all";
  const subcategoryParam = searchParams.get("subcategory") || "";
  const [activeTab, setActiveTab] = useState("marketplace");
  
  // State for search and navigation
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryParam);
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  const { setLoading } = useLoading();
  
  // Show loading indicator when page loads
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
      setIsPageLoading(false);
    }, 500); // Reduced loading time for faster initial render
    return () => clearTimeout(timeout);
  }, [setLoading]);
  
  // Update state when URL parameters change
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (subcategoryParam) {
      setSelectedSubcategory(subcategoryParam);
    }
    
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [categoryParam, subcategoryParam, queryParam]);
  
  // Handle search selection from autocomplete
  const handleSearchSelect = (query: string) => {
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  
  // Update URL when category changes
  const handleCategoryChange = (category: string, subcategory?: string) => {
    setSelectedCategory(category);
    if (subcategory) {
      setSelectedSubcategory(subcategory);
    } else {
      setSelectedSubcategory("");
    }
    
    const newSearchParams = new URLSearchParams();
    if (searchQuery) {
      newSearchParams.set("q", searchQuery);
    }
    
    if (category !== "all") {
      newSearchParams.set("category", category);
      
      if (subcategory) {
        newSearchParams.set("subcategory", subcategory);
      }
    }
    
    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString()
    });
  };
  
  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Single Search Bar at the top with improved design */}
        <div className="mb-4 sm:mb-6">
          <AutocompleteSearch 
            value={searchQuery}
            onChange={setSearchQuery}
            onSearchSelect={handleSearchSelect}
            placeholder="Search for products, services, or businesses..."
            className="w-full max-w-3xl mx-auto"
          />
        </div>
        
        {/* Tabs for navigating between Marketplace, Businesses, and Services */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full sm:w-auto mb-4">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="businesses">Businesses</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Marketplace Tab Content */}
            <TabsContent value="marketplace">
              {/* Banner carousel below search */}
              <LazySection type="default" fallbackCount={1}>
                <div className="mb-4 sm:mb-6">
                  <BannerCarousel />
                </div>
              </LazySection>
              
              {/* Shop by Category section */}
              <div className="mb-4 sm:mb-6">
                <ShopByCategory onCategorySelect={handleCategoryChange} />
              </div>
              
              {/* Flash Sale Section */}
              <LazySection type="default">
                <div className="mb-4 sm:mb-8">
                  <FlashSale />
                </div>
              </LazySection>
              
              {/* Product Rankings */}
              <LazySection type="default">
                <div className="mb-4 sm:mb-8">
                  <ProductRankings />
                </div>
              </LazySection>
              
              {/* Sponsored Products Section */}
              <LazySection type="default">
                <div className="mb-4 sm:mb-8">
                  <SponsoredProducts />
                </div>
              </LazySection>
              
              {/* Trending Products */}
              <LazySection type="default">
                <div className="mb-4 sm:mb-8">
                  <TrendingProducts />
                </div>
              </LazySection>
              
              {/* Personalized Recommendations */}
              <LazySection type="default">
                <div className="mb-4 sm:mb-8">
                  <PersonalizedRecommendations />
                </div>
              </LazySection>
              
              {/* Crazy Deals Section */}
              <LazySection type="default">
                <div className="mb-4 sm:mb-8">
                  <CrazyDeals />
                </div>
              </LazySection>
              
              {/* Main content - Browse All */}
              <LazySection type="default">
                <div className="mt-4 sm:mt-8">
                  <LazyBrowseTabContent 
                    searchTerm={searchQuery}
                    onCategorySelect={handleCategoryChange}
                  />
                </div>
              </LazySection>
            </TabsContent>
            
            {/* Businesses Tab Content */}
            <TabsContent value="businesses">
              {/* Business Banner Ad */}
              <div className="mb-6">
                <BusinessBannerAd />
              </div>
              
              {/* Business Categories Grid with Images */}
              <LazySection type="business">
                <div className="mb-8">
                  <BusinessCategoryGrid />
                </div>
              </LazySection>
              
              {/* Load Business BrowseTabContent or similar component here */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Featured Businesses</h2>
                {/* Add your featured businesses content here */}
              </div>
            </TabsContent>
            
            {/* Services Tab Content */}
            <TabsContent value="services">
              {/* Service Banner Ad */}
              <div className="mb-6">
                <ServiceBannerAd />
              </div>
              
              {/* Sponsored Services */}
              <LazySection type="service">
                <div className="mb-8">
                  <SponsoredServices layout="grid3x3" />
                </div>
              </LazySection>
              
              {/* Service Categories Grid - can be implemented in future */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Popular Services</h2>
                {/* Add your popular services content here */}
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UnifiedHome;
