
import { Layout } from "@/components/layout/Layout";
import { SearchHero } from "@/components/home/SearchHero";
import { BusinessCategoryGrid } from "@/components/home/BusinessCategoryGrid";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";
import { LikeProvider } from "@/components/products/LikeContext";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";
import { useEffect } from "react";
import { useLoading } from "@/providers/LoadingProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShopByCategory } from "@/components/marketplace/ShopByCategory";
import { useState } from "react";
import { LazyImage } from "@/components/ui/LazyImage";
import { ServiceCategoryScroller } from "@/components/services/ServiceCategoryScroller";

export default function Home() {
  const { setLoading } = useLoading();
  const [activeTab, setActiveTab] = useState("all");

  // Show loading indicator when page loads - reduced loading time to 100ms
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timeout);
  }, [setLoading]);

  return (
    <Layout hideSidebar={false}>
      {/* Hero search section - fixed padding and scrolling */}
      <div className="pt-2">
        <SearchHero />
      </div>

      <div className="container max-w-7xl mx-auto px-1 sm:px-4 pt-3 pb-8 overflow-visible">
        {/* Category navigation - improved spacing */}
        <Tabs defaultValue="all" className="w-full mb-4 sm:mb-6" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4 overflow-visible">
            <h2 className="text-2xl font-bold">Explore Categories</h2>
            <TabsList className="overflow-x-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="businesses">Businesses</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            {/* Featured carousel - improved spacing */}
            <div className="mb-4 sm:mb-6">
              <BannerCarousel />
            </div>
            
            {/* Featured business categories - improved spacing */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-2xl font-bold mb-4">Business Categories</h2>
              <BusinessCategoryGrid />
            </div>
            
            {/* Featured product categories - improved spacing */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-2xl font-bold mb-4">Shop Products</h2>
              <ShopByCategory />
            </div>
            
            {/* Service Categories Scroller - improved spacing */}
            <div className="mb-4 sm:mb-6">
              <ServiceCategoryScroller />
            </div>
            
            {/* Trending products - improved spacing */}
            <LikeProvider>
              <div className="mb-4 sm:mb-6">
                <TrendingProducts />
              </div>
            </LikeProvider>
          </TabsContent>
          
          <TabsContent value="products" className="mt-0">
            <div className="mb-4 sm:mb-6">
              <ShopByCategory />
            </div>
            <LikeProvider>
              <SponsoredProducts />
              <div className="mt-4 sm:mt-6">
                <TrendingProducts />
              </div>
            </LikeProvider>
          </TabsContent>
          
          <TabsContent value="businesses" className="mt-0">
            <BusinessCategoryGrid />
          </TabsContent>
          
          <TabsContent value="services" className="mt-0">
            <div className="mb-4 sm:mb-6">
              <ServiceCategoryScroller />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { title: "Home Services", image: "/lovable-uploads/97cb18f9-5178-4291-9cae-8a13e8abed4e.png" },
                { title: "Professional Services", image: "/lovable-uploads/97cb18f9-5178-4291-9cae-8a13e8abed4e.png" },
                { title: "Auto Services", image: "/lovable-uploads/97cb18f9-5178-4291-9cae-8a13e8abed4e.png" },
                { title: "Health & Wellness", image: "/lovable-uploads/97cb18f9-5178-4291-9cae-8a13e8abed4e.png" }
              ].map((service, i) => (
                <div key={i} className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-zinc-800">
                  <div className="aspect-video relative">
                    <LazyImage
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium">{service.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
