
import { Layout } from "@/components/layout/Layout";
import { useEffect } from "react";
import { BusinessSection } from "@/components/business/BusinessSection";
import { ServiceSection } from "@/components/service/ServiceSection";
import { MarketplaceSection } from "@/components/marketplace/MarketplaceSection";
import { SearchHero } from "@/components/home/SearchHero";

export default function BusinessesPage() {
  // Track page view on component mount
  useEffect(() => {
    // Analytics tracking would go here
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-2 py-4 max-w-7xl">
        {/* Search Hero */}
        <SearchHero />
        
        {/* Business Sections */}
        <div className="mt-5 space-y-3">
          <BusinessSection type="trending" />
          <BusinessSection type="sponsored" />
          <BusinessSection type="suggested" />
        </div>
        
        {/* Service Sections */}
        <div className="mt-8 pt-4 border-t space-y-3">
          <h2 className="text-lg font-bold mb-3">Related Services</h2>
          <ServiceSection type="trending" />
          <ServiceSection type="sponsored" />
        </div>
        
        {/* Marketplace Sections */}
        <div className="mt-8 pt-4 border-t space-y-3">
          <h2 className="text-lg font-bold mb-3">Shop Related Products</h2>
          <MarketplaceSection type="trending" />
          <MarketplaceSection type="sponsored" />
        </div>
      </div>
    </Layout>
  );
}
