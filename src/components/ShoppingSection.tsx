
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { GridLayoutType } from "@/components/products/types/ProductTypes";

interface ShoppingSectionProps {
  searchQuery?: string;
  selectedCategory?: string;
  showDiscounted?: boolean;
  showUsed?: boolean;
  showBranded?: boolean;
  sortOption?: string;
  priceRange?: string;
}

export const ShoppingSection: React.FC<ShoppingSectionProps> = ({
  searchQuery = "",
  selectedCategory = "",
  showDiscounted = false,
  showUsed = false,
  showBranded = false,
  sortOption = "newest",
  priceRange = "all"
}) => {
  const [layout] = useState<GridLayoutType>("grid4x4");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory, showDiscounted, showUsed, showBranded, sortOption, priceRange],
    queryFn: async () => {
      let query = supabase.from("products").select("*");

      // Apply filters
      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      if (selectedCategory && selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      if (showDiscounted) {
        query = query.eq("is_discounted", true);
      }

      if (showUsed) {
        query = query.eq("is_used", true);
      }

      if (showBranded) {
        query = query.eq("is_branded", true);
      }

      // Apply sorting
      switch (sortOption) {
        case "priceAsc":
          query = query.order("price", { ascending: true });
          break;
        case "priceDesc":
          query = query.order("price", { ascending: false });
          break;
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query.limit(20);
      
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {searchQuery ? `Search Results for "${searchQuery}"` : 
           selectedCategory && selectedCategory !== "all" ? 
           `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products` : 
           "All Products"}
        </h2>
        <span className="text-sm text-muted-foreground">
          {products.length} products found
        </span>
      </div>
      
      <ProductsGrid
        products={products}
        layout={layout}
        isLoading={isLoading}
        searchQuery={searchQuery}
      />
    </div>
  );
};
