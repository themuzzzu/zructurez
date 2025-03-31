
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SponsoredProducts } from '@/components/marketplace/SponsoredProducts';
import { TrendingProducts } from '@/components/marketplace/TrendingProducts';
import { ProductsGrid } from '@/components/products/ProductsGrid';
import { GridLayoutType } from '@/components/products/types/layouts';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptySearchResults } from '@/components/marketplace/EmptySearchResults';
import { RecommendedProducts } from '@/components/marketplace/RecommendedProducts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BrowseTabContentProps {
  searchResults?: any[];
  searchTerm?: string;
  isSearching?: boolean;
  onCategorySelect?: (category: string) => void;
  onSearchSelect?: (term: string) => void;
}

export const BrowseTabContent: React.FC<BrowseTabContentProps> = ({ 
  searchResults = [],
  searchTerm = '',
  isSearching = false,
  onCategorySelect,
  onSearchSelect
}) => {
  const [layout, setLayout] = useState<GridLayoutType>('grid3x3');

  const { data: trendingSearches, isLoading: loadingTrending } = useQuery({
    queryKey: ['trending-searches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('search_suggestions')
        .select('*')
        .order('frequency', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000
  });

  // Show search results if there's a search term
  if (searchTerm) {
    if (isSearching) {
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Searching for "{searchTerm}"...</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i}>
                <Skeleton className="h-[200px] w-full rounded-t-lg" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Search Results for "{searchTerm}"</h2>
        
        {searchResults.length > 0 ? (
          <ProductsGrid 
            products={searchResults} 
            layout={layout}
          />
        ) : (
          <EmptySearchResults 
            query={searchTerm}
          />
        )}
      </div>
    );
  }

  // Default browse content
  return (
    <div className="space-y-8 animate-fade-in">
      <SponsoredProducts />
      
      <TrendingProducts />
      
      <RecommendedProducts />
    </div>
  );
};
