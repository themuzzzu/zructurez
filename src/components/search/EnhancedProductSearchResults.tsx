
import React from 'react';
import { SearchResult } from "@/types/search";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { ProductGrid } from "@/components/products/ProductGrid";
import { EnhancedProductCard } from "@/components/products/EnhancedProductCard";
import { motion } from "framer-motion";
import { CircleOff, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { LikeProvider } from "@/components/products/LikeContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface EnhancedProductSearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
  gridLayout?: GridLayoutType;
  hasError?: boolean;
  onRetry?: () => void;
}

export function EnhancedProductSearchResults({ 
  results, 
  isLoading, 
  query, 
  gridLayout = "grid4x4",
  hasError = false,
  onRetry
}: EnhancedProductSearchResultsProps) {
  if (isLoading) {
    // Loading skeleton with proper grid layout
    return (
      <ProductGrid gridLayout={gridLayout}>
        {Array.from({ length: gridLayout === "grid1x1" ? 4 : 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-60 rounded-md mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </ProductGrid>
    );
  }

  if (hasError && results.length > 0) {
    return (
      <>
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Network connectivity issue</AlertTitle>
          <AlertDescription>
            We couldn't connect to our search service. Showing you locally cached results instead.
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry} className="ml-2">
                Retry
              </Button>
            )}
          </AlertDescription>
        </Alert>
        
        <LikeProvider>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ProductGrid gridLayout={gridLayout}>
              {results.map((result) => (
                <EnhancedProductCard
                  key={result.id}
                  product={{
                    id: result.id,
                    title: result.title,
                    description: result.description,
                    price: result.price || 0,
                    imageUrl: result.imageUrl || '',
                    category: result.category || '',
                    is_discounted: result.isDiscounted || result.is_discounted || false,
                    discount_percentage: result.discount_percentage || 0,
                    original_price: result.original_price || 0,
                    brand: result.brand || 'Brand',
                    rating: result.rating || 0,
                    rating_count: result.rating_count || 0,
                    highlight_tags: result.highlight_tags || []
                  }}
                  layout={gridLayout}
                  sponsored={result.isSponsored}
                />
              ))}
            </ProductGrid>
          </motion.div>
        </LikeProvider>
      </>
    );
  }

  if (!results.length) {
    return <EmptySearchResults searchTerm={query} />;
  }

  return (
    <LikeProvider>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ProductGrid gridLayout={gridLayout}>
          {results.map((result) => (
            <EnhancedProductCard
              key={result.id}
              product={{
                id: result.id,
                title: result.title,
                description: result.description,
                price: result.price || 0,
                imageUrl: result.imageUrl || '',
                category: result.category || '',
                is_discounted: result.isDiscounted || result.is_discounted || false,
                discount_percentage: result.discount_percentage || 0,
                original_price: result.original_price || 0,
                brand: result.brand || 'Brand',
                rating: result.rating || 0,
                rating_count: result.rating_count || 0,
                highlight_tags: result.highlight_tags || []
              }}
              layout={gridLayout}
              sponsored={result.isSponsored}
            />
          ))}
        </ProductGrid>
        
        {/* If results are not empty but less than expected */}
        {results.length > 0 && results.length < 3 && (
          <div className="mt-8 text-center py-8 border-t">
            <CircleOff className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              Limited results found. Try adjusting your search or filters for more options.
            </p>
          </div>
        )}
      </motion.div>
    </LikeProvider>
  );
}
