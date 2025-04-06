
import React, { useMemo } from "react";
import { useOptimizedQuery } from "@/hooks/useOptimizedQuery";
import { supabase } from "@/integrations/supabase/client";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { GridLayoutSelector } from "@/components/marketplace/GridLayoutSelector";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

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
  sortBy = "created_at",
  limit = 8,
  showViewAll = true,
  visibleOnMobile = true,
}: ProductsSectionProps) => {
  const [layout, setLayout] = React.useState<GridLayoutType>("grid4x4");

  const queryKey = useMemo(() => 
    ["products", { category, sortBy, limit }], 
    [category, sortBy, limit]
  );

  const { data: products, isLoading } = useOptimizedQuery(
    queryKey,
    async () => {
      try {
        let query = supabase
          .from("products")
          .select(
            "id, title, price, image_url, category, is_discounted, discount_percentage, original_price"
          );

        if (category) {
          query = query.eq("category", category);
        }

        const { data, error } = await query
          .order(sortBy, { ascending: false })
          .limit(limit);

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Error fetching products:", err);
        return [];
      }
    },
    {
      staleTime: 15 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  );

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
            products={products || []} 
            layout={layout} 
            onLayoutChange={setLayout}
          />
        </motion.div>
      )}
    </div>
  );
};
