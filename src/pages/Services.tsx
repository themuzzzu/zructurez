
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types/product";
import { Heading } from "@/components/ui/heading";
import { ServiceBannerAd } from "@/components/ads/ServiceBannerAd";
import { SponsoredServices } from "@/components/service-marketplace/SponsoredServices";

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
    return <div>Loading services...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <>
      <Heading>Our Services</Heading>
      
      {/* Service-specific banner ad */}
      <ServiceBannerAd />
      
      {/* Display sponsored services */}
      <SponsoredServices />
      
      {/* Regular service listings */}
      <ProductsGrid layout="grid3x3" products={products} />
    </>
  );
};

export default ServicesPage;
