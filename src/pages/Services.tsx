
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types/product";
import { Heading } from "@/components/ui/heading";
import { ServiceBannerAd } from "@/components/ads/ServiceBannerAd";
import { SponsoredServices } from "@/components/service-marketplace/SponsoredServices";
import { SuggestedServices } from "@/components/service-marketplace/SuggestedServices";
import { TopServices } from "@/components/service-marketplace/TopServices";
import { RecommendedServices } from "@/components/service-marketplace/RecommendedServices";

const ServicesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .limit(12);

        if (error) {
          throw error;
        }

        setProducts(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-4">Loading services...</div>;
  }

  if (error) {
    return <div className="p-4">Error: {error}</div>;
  }
  
  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      <Heading>Services</Heading>
      
      {/* Service-specific banner ad */}
      <ServiceBannerAd />
      
      {/* Display recommended services - horizontal scrollable */}
      <RecommendedServices />
      
      {/* Display sponsored services */}
      <SponsoredServices />
      
      {/* Display top services */}
      <TopServices />
      
      {/* Display suggested services */}
      <SuggestedServices />
      
      {/* Regular service listings */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">All Services</h2>
        <ProductsGrid layout="grid3x3" products={products} />
      </div>
    </div>
  );
};

export default ServicesPage;
