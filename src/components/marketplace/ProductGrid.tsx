
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { Grid3x3, LayoutGrid, List } from "lucide-react";

export interface ProductGridProps {
  category?: string;
  subcategory?: string;
  featured?: boolean;
  limit?: number;
  showControls?: boolean;
  defaultLayout?: GridLayoutType;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  category,
  subcategory,
  featured = false,
  limit = 12,
  showControls = true,
  defaultLayout = "grid3x3"
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [layout, setLayout] = useState<GridLayoutType>(defaultLayout);
  
  const getLayoutClass = () => {
    switch (layout) {
      case "grid4x4":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
      case "grid3x3":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5";
      case "grid2x2":
        return "grid-cols-1 sm:grid-cols-2 gap-6";
      case "list":
        return "grid-cols-1 gap-4";
      case "grid1x1":
        return "grid-cols-1 gap-6";
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5";
    }
  };
  
  const itemsPerPage = limit;
  const offset = (currentPage - 1) * itemsPerPage;
  
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products', category, subcategory, featured, currentPage],
    queryFn: async () => {
      let query = supabase.from('products').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (subcategory) {
        query = query.eq('subcategory', subcategory);
      }
      
      if (featured) {
        query = query.eq('is_featured', true);
      }
      
      // Get total count
      const { count } = await query.count();
      
      // Apply pagination
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + itemsPerPage - 1);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return {
        products: data || [],
        totalCount: count || 0
      };
    }
  });
  
  const totalPages = Math.ceil((products?.totalCount || 0) / itemsPerPage);
  
  // Reset page when category or subcategory changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category, subcategory]);
  
  if (isLoading) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          {showControls && (
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          )}
        </div>
        <div className={`grid ${getLayoutClass()}`}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (isError) {
    return <div className="py-12 text-center text-muted-foreground">Error loading products</div>;
  }
  
  if (!products?.products.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          {subcategory 
            ? `No products found in ${subcategory} subcategory` 
            : category 
              ? `No products found in ${category} category`
              : 'No products found'}
        </p>
      </div>
    );
  }
  
  return (
    <div>
      {showControls && (
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            {products.totalCount} products
          </div>
          <div className="flex gap-1">
            <Button
              variant={layout === "grid4x4" ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              onClick={() => setLayout("grid4x4")}
              aria-label="Grid 4x4 view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={layout === "grid3x3" ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              onClick={() => setLayout("grid3x3")}
              aria-label="Grid 3x3 view"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={layout === "list" ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              onClick={() => setLayout("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <div className={`grid ${getLayoutClass()}`}>
        {products.products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            layout={layout}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? "default" : "outline"}
              size="sm"
              className="w-9"
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
