
import { useState, useEffect } from "react";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { Heading } from "@/components/ui/heading";
import { ShoppingCardSkeleton } from "@/components/ShoppingCardSkeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNetworkStatus } from "@/providers/NetworkMonitor";
import { ErrorView } from "@/components/ErrorView";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function MarketplaceContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { isOnline } = useNetworkStatus();

  // Fetch featured products
  const { data: featuredProducts, isLoading: loadingFeatured, error: featuredError } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .limit(8);
        
      if (error) {
        console.error("Error fetching featured products:", error);
        throw new Error("Failed to fetch featured products");
      }
      
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: isOnline, // Only run when online
  });
  
  // Fetch trending products
  const { data: trendingProducts, isLoading: loadingTrending, error: trendingError } = useQuery({
    queryKey: ["trendingProducts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("views", { ascending: false })
        .limit(8);
        
      if (error) {
        console.error("Error fetching trending products:", error);
        throw new Error("Failed to fetch trending products");
      }
      
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: isOnline, // Only run when online
  });

  // Handle network status change
  useEffect(() => {
    if (!isOnline) {
      toast.warning("You're offline. Some content may not be available.");
    }
  }, [isOnline]);

  // Animation variants for sections
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-10">
      {/* Featured Products Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-4"
      >
        <Heading as="h2" className="text-2xl font-bold">
          Featured Products
        </Heading>
        
        {loadingFeatured ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ShoppingCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredError ? (
          <ErrorView 
            title="Couldn't load featured products"
            message="There was an error loading featured products."
            onRetry={() => {}} // Add retry logic if needed
          />
        ) : (
          <ProductsGrid 
            products={featuredProducts || []} 
            layout="grid3x3" 
          />
        )}
      </motion.section>

      {/* Trending Products Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-4"
      >
        <Heading as="h2" className="text-2xl font-bold">
          Trending Products
        </Heading>
        
        {loadingTrending ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ShoppingCardSkeleton key={i} />
            ))}
          </div>
        ) : trendingError ? (
          <ErrorView 
            title="Couldn't load trending products"
            message="There was an error loading trending products."
            onRetry={() => {}} // Add retry logic if needed
          />
        ) : (
          <ProductsGrid 
            products={trendingProducts || []} 
            layout="grid3x3" 
          />
        )}
      </motion.section>
    </div>
  );
}
