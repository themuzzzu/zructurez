
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

export default function Home() {
  const { setLoading } = useLoading();
  const [activeTab, setActiveTab] = useState("all");

  // Show loading indicator when page loads
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timeout);
  }, [setLoading]);

  return (
    <Layout>
      {/* Hero search section */}
      <SearchHero />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Category navigation */}
        <Tabs defaultValue="all" className="w-full mb-8" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Explore Categories</h2>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="businesses">Businesses</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all">
            {/* Featured carousel */}
            <div className="mb-8">
              <BannerCarousel />
            </div>
            
            {/* Featured business categories */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Business Categories</h2>
              <BusinessCategoryGrid />
            </div>
            
            {/* Featured product categories */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Shop Products</h2>
              <ShopByCategory />
            </div>
            
            {/* Trending products */}
            <LikeProvider>
              <div className="mb-8">
                <TrendingProducts />
              </div>
            </LikeProvider>
          </TabsContent>
          
          <TabsContent value="products">
            <div className="mb-8">
              <ShopByCategory />
            </div>
            <LikeProvider>
              <SponsoredProducts />
              <div className="mt-8">
                <TrendingProducts />
              </div>
            </LikeProvider>
          </TabsContent>
          
          <TabsContent value="businesses">
            <BusinessCategoryGrid />
          </TabsContent>
          
          <TabsContent value="services">
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
