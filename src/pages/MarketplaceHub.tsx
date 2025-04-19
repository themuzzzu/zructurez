
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";
import { ShopByCategory } from "@/components/marketplace/ShopByCategory";
import { AutocompleteSearch } from "@/components/marketplace/AutocompleteSearch";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNetworkStatus } from "@/providers/NetworkMonitor";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingView } from "@/components/LoadingView";
import { Wifi } from "lucide-react";

export default function MarketplaceHub() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { isOnline } = useNetworkStatus();
  const [activeTab, setActiveTab] = useState("products");
  
  // Fetch featured products
  const { data: featuredProducts, isLoading: loadingFeatured } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_featured", true)
          .limit(8);
          
        if (error) {
          console.error("Error fetching featured products:", error);
          throw new Error(error.message);
        }
        
        return data || [];
      } catch (error) {
        console.error("Error in featured products query:", error);
        toast.error("Failed to load featured products");
        return [];
      }
    },
    staleTime: 60000 // 1 minute
  });

  // Handle search
  const handleSearch = (term: string) => {
    if (term.trim()) {
      navigate(`/search/marketplace?q=${encodeURIComponent(term)}`);
    }
  };
  
  // Track when user views this page
  useEffect(() => {
    // This could be extended to send analytics data
    console.log("MarketplaceHub viewed:", new Date().toISOString());
  }, []);

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Search bar */}
        <div className="max-w-3xl mx-auto">
          <AutocompleteSearch
            value={searchTerm}
            onChange={setSearchTerm}
            onSearchSelect={handleSearch}
            placeholder="Search for products, services, or businesses..."
          />
        </div>
        
        {/* Online/Offline indicator */}
        {!isOnline && (
          <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-center gap-2">
            <div className="text-amber-800 dark:text-amber-300">
              <Wifi className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-300">You're currently offline</p>
              <p className="text-sm text-amber-600 dark:text-amber-400">Showing cached content. Some features may be limited.</p>
            </div>
          </div>
        )}
        
        {/* Featured banners */}
        <BannerCarousel />
        
        {/* Shop by category */}
        <ShopByCategory />
        
        {/* Tabs for product types */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="businesses">Businesses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <Button variant="outline" onClick={() => navigate('/marketplace/products')}>
                View All
              </Button>
            </div>
            
            {loadingFeatured ? (
              <LoadingView message="Loading products..." />
            ) : (
              <ProductsGrid 
                products={featuredProducts || []} 
                layout="grid3x3"
              />
            )}
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Popular Services</h2>
              <Button variant="outline" onClick={() => navigate('/marketplace/services')}>
                View All
              </Button>
            </div>
            
            {/* Services content will go here */}
            <div className="bg-muted p-12 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">We're working on bringing services to the marketplace.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="businesses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Local Businesses</h2>
              <Button variant="outline" onClick={() => navigate('/marketplace/businesses')}>
                View All
              </Button>
            </div>
            
            {/* Businesses content will go here */}
            <div className="bg-muted p-12 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">We're working on bringing local businesses to the marketplace.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
