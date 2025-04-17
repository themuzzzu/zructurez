
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SkeletonCard from "@/components/loaders/SkeletonCard";

interface ProductRankingsProps {
  title?: string;
  categoryId?: string;
  limit?: number;
  showFilters?: boolean;
  compact?: boolean;
  className?: string;
}

type SortOption = "popular" | "rating" | "newest" | "price-low" | "price-high";

export const ProductRankings = ({
  title = "Top-Rated Products",
  categoryId,
  limit = 10,
  showFilters = true,
  compact = false,
  className
}: ProductRankingsProps) => {
  const [activeTab, setActiveTab] = useState<string>(categoryId || "all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const { data: categories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("id, name")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["ranked-products", activeTab, sortBy, page, limit],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .order(getSortField(sortBy), { ascending: getSortDirection(sortBy) })
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

      if (activeTab !== "all") {
        query = query.eq("category_id", activeTab);
      }

      const { data, error } = await query.limit(limit);

      if (error) throw error;
      return data || [];
    },
  });

  const getSortField = (sort: SortOption): string => {
    switch (sort) {
      case "rating": return "rating";
      case "newest": return "created_at";
      case "price-low":
      case "price-high":
        return "price";
      case "popular":
      default:
        return "views";
    }
  };

  const getSortDirection = (sort: SortOption): boolean => {
    return sort === "price-low";
  };

  const totalPages = useMemo(() => {
    if (!products) return 1;
    return Math.ceil(products.length / itemsPerPage);
  }, [products, itemsPerPage]);

  return (
    <div className={className}>
      {title && !compact && <h2 className="text-2xl font-bold mb-4">{title}</h2>}

      {showFilters && (
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="w-full max-w-sm overflow-auto">
              <TabsTrigger value="all" className="flex-shrink-0">All</TabsTrigger>
              {categories?.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex-shrink-0"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <SkeletonCard key={i} className="min-h-[320px]" />
          ))
        ) : products?.length === 0 ? (
          <Card className="col-span-full p-8 text-center">
            <p className="text-muted-foreground">No products found in this category.</p>
          </Card>
        ) : (
          products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant={compact ? "compact" : "standard"}
            />
          ))
        )}
      </div>

      {showFilters && products && products.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * itemsPerPage + 1}-
            {Math.min(page * itemsPerPage, products.length)} of {products.length} products
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
