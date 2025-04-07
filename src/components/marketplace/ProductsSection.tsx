
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { GridLayoutSelector } from "@/components/marketplace/GridLayoutSelector";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

// Define an interface for the product data
interface Product {
  id: string;
  title: string;
  name?: string;
  price: number;
  image_url?: string;
  imageUrl?: string;
  category?: string;
  is_discounted?: boolean;
  discount_percentage?: number;
  original_price?: number;
  brand_name?: string;
  brand?: string;
  condition?: string;
  views?: number;
  rating?: number;
  rating_count?: number;
}

// Define an interface for the products data
interface ProductsData {
  products: Product[];
}

interface ProductsSectionProps {
  title: string;
  category?: string;
  sortBy?: string;
  limit?: number;
  showViewAll?: boolean;
  visibleOnMobile?: boolean;
}

export const ProductsSection = ({
  title,
  category,
  sortBy = "newest",
  limit = 8,
  showViewAll = true,
  visibleOnMobile = true,
}: ProductsSectionProps) => {
  const [layout, setLayout] = React.useState<GridLayoutType>("grid4x4");

  const queryKey = useMemo(() => 
    ["products", { category, sortBy, limit }], 
    [category, sortBy, limit]
  );

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async (): Promise<ProductsData> => {
      try {
        let query = supabase
          .from("products")
          .select(
            "id, title, price, image_url, category, is_discounted, discount_percentage, original_price, brand_name, views"
          );

        if (category) {
          query = query.eq("category", category);
        }
        
        // Map sortBy values to database column names
        let orderColumn = "created_at";
        let ascending = false;
        
        if (sortBy === "price-asc") {
          orderColumn = "price";
          ascending = true;
        } else if (sortBy === "price-desc") {
          orderColumn = "price";
          ascending = false;
        } else if (sortBy === "popular") {
          orderColumn = "views";
          ascending = false;
        } else {
          // Default is newest
          orderColumn = "created_at";
          ascending = false;
        }

        const { data, error } = await query
          .order(orderColumn, { ascending })
          .limit(limit);

        if (error) throw error;
        
        // Add default rating values for each product
        const productsWithDefaultRatings = (data || []).map(product => ({
          ...product,
          rating: 4.5,  // Default rating
          rating_count: 10, // Default rating count
        }));
        
        return { products: productsWithDefaultRatings };
      } catch (err) {
        console.error("Error fetching products:", err);
        return { products: [] };
      }
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  if (!visibleOnMobile && typeof window !== "undefined" && window.innerWidth < 640) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center gap-4">
          <GridLayoutSelector layout={layout} onChange={setLayout} />
          {showViewAll && (
            <Button variant="outline" size="sm">
              View All
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div
          className={
            layout === "list"
              ? "space-y-4"
              : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          }
        >
          {Array(limit)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ProductGrid 
            products={data?.products || []} 
            layout={layout} 
            onLayoutChange={setLayout}
          />
        </motion.div>
      )}
    </div>
  );
};
