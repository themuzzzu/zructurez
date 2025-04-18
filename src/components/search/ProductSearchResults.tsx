
import React, { useState } from 'react';
import { ProductCard } from "@/components/products/ProductCard";
import { SearchResult } from "@/types/search";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";
import { Button } from "@/components/ui/button";
import { Filter, ArrowDownUp } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { LikeProvider } from "@/components/products/LikeContext";
import { cn } from "@/lib/utils";

interface ProductSearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
  gridLayout?: GridLayoutType;
}

export function ProductSearchResults({ results, isLoading, query, gridLayout = "grid4x4" }: ProductSearchResultsProps) {
  const [showFilters, setShowFilters] = useState(false);

  if (isLoading) {
    return (
      <div className={cn(
        "grid gap-4",
        gridLayout === "grid1x1" ? "grid-cols-1" :
        gridLayout === "grid2x2" ? "grid-cols-1 sm:grid-cols-2" :
        "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      )}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-60 rounded-md mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!results.length) {
    return <EmptySearchResults searchTerm={query} />;
  }

  return (
    <LikeProvider>
      <div className="space-y-4">
        {/* Mobile filters button - only shown on small screens */}
        <div className="flex md:hidden items-center justify-between mb-2">
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              {/* Mobile filters */}
            </SheetContent>
          </Sheet>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowDownUp className="h-4 w-4" />
            Sort
          </Button>
        </div>

        <div className={cn(
          "grid gap-4",
          gridLayout === "grid1x1" ? "grid-cols-1" :
          gridLayout === "grid2x2" ? "grid-cols-1 sm:grid-cols-2" :
          "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        )}>
          {results.map((result) => (
            <ProductCard
              key={result.id}
              product={{
                id: result.id,
                title: result.title,
                description: result.description,
                price: result.price || 0,
                imageUrl: result.imageUrl || '',
                category: result.category || '',
                is_discounted: result.isDiscounted || false,
                discount_percentage: result.discount_percentage || 0,
                original_price: result.original_price || 0,
                brand: result.brand || 'Brand',
                rating: result.rating || 0,
                rating_count: result.rating_count || 0
              }}
              layout={gridLayout}
              sponsored={result.isSponsored}
            />
          ))}
        </div>
      </div>
    </LikeProvider>
  );
}
