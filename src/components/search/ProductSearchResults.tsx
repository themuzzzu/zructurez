
import React, { useState } from 'react';
import { ProductCard } from "@/components/products/ProductCard";
import { SearchResult } from "@/types/search";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";
import { GridLayoutSelector } from "@/components/marketplace/GridLayoutSelector";
import { ProductFilters } from "@/components/marketplace/ProductFilters";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { LikeProvider } from "@/components/products/LikeContext";

interface ProductSearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
}

export function ProductSearchResults({ results, isLoading, query }: ProductSearchResultsProps) {
  const [gridLayout, setGridLayout] = useState<GridLayoutType>("grid4x4");
  const [showFilters, setShowFilters] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!results.length) {
    return <EmptySearchResults searchTerm={query} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <GridLayoutSelector layout={gridLayout} onChange={setGridLayout} />
        
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <ProductFilters 
              selectedCategory=""
              onCategorySelect={() => {}}
              showDiscounted={false}
              onDiscountedChange={() => {}}
              showUsed={false}
              onUsedChange={() => {}}
              showBranded={false}
              onBrandedChange={() => {}}
              sortOption="newest"
              onSortChange={() => {}}
              priceRange="all"
              onPriceRangeChange={() => {}}
              onResetFilters={() => {}}
            />
          </SheetContent>
        </Sheet>
      </div>

      <LikeProvider>
        <div className={`grid ${
          gridLayout === "grid1x1" ? "grid-cols-1" :
          gridLayout === "grid2x2" ? "grid-cols-1 sm:grid-cols-2" :
          "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        } gap-4`}>
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
                discount_percentage: result.discount_percentage
              }}
              layout={gridLayout}
            />
          ))}
        </div>
      </LikeProvider>
    </div>
  );
}
