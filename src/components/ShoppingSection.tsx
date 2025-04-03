
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ProductsGrid } from './products/ProductsGrid';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridLayoutType } from './products/types/layouts';
import { ProductFilters } from './marketplace/ProductFilters';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { preloadImages } from '@/utils/apiPerformance';
import { memoWithTracking } from '@/utils/performanceUtils';

interface ShoppingSectionProps {
  searchQuery: string;
  selectedCategory?: string;
  showDiscounted?: boolean;
  showUsed?: boolean;
  showBranded?: boolean;
  sortOption?: string;
  priceRange?: string;
  gridLayout?: GridLayoutType;
}

export const ShoppingSection = ({
  searchQuery,
  selectedCategory = '',
  showDiscounted = false,
  showUsed = false,
  showBranded = false,
  sortOption = 'newest',
  priceRange = 'all',
  gridLayout = 'grid4x4'
}: ShoppingSectionProps) => {
  // Local state for filters
  const [localCategory, setLocalCategory] = useState(selectedCategory);
  const [localShowDiscounted, setLocalShowDiscounted] = useState(showDiscounted);
  const [localShowUsed, setLocalShowUsed] = useState(showUsed);
  const [localShowBranded, setLocalShowBranded] = useState(showBranded);
  const [localSortOption, setLocalSortOption] = useState(sortOption);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [localGridLayout, setLocalGridLayout] = useState<GridLayoutType>(gridLayout);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Use debounced search query to avoid unnecessary API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Reset filters function
  const resetFilters = useCallback(() => {
    setLocalCategory('');
    setLocalShowDiscounted(false);
    setLocalShowUsed(false);
    setLocalShowBranded(false);
    setLocalSortOption('newest');
    setLocalPriceRange('all');
  }, []);
  
  // Create a memoized fetch function to use with pagination
  const fetchProducts = useCallback(async (page: number, pageSize: number) => {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });
    
    if (debouncedSearchQuery) {
      query = query.or(`title.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%,category.ilike.%${debouncedSearchQuery}%`);
    }
    
    if (localCategory && localCategory !== 'all') {
      query = query.eq('category', localCategory);
    }
    
    if (localShowDiscounted) {
      query = query.eq('is_discounted', true);
    }
    
    if (localShowUsed) {
      query = query.eq('is_used', true);
    }
    
    if (localShowBranded) {
      query = query.eq('is_branded', true);
    }
    
    // Calculate offset for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    if (localSortOption === 'price-low') {
      query = query.order('price', { ascending: true });
    } else if (localSortOption === 'price-high') {
      query = query.order('price', { ascending: false });
    } else if (localSortOption === 'most-viewed') {
      query = query.order('views', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    if (localPriceRange !== 'all') {
      const [minPrice, maxPrice] = localPriceRange.split('-').map(val => val === 'up' ? '10000000' : val);
      query = query.gte('price', minPrice).lte('price', maxPrice);
    }
    
    // Apply pagination
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      return { data: [], totalCount: 0 };
    }
    
    // Preload images for the next page
    if (data && data.length > 0) {
      const imageUrls = data.map(product => product.image);
      preloadImages(imageUrls.filter(Boolean));
    }
    
    return { 
      data: data || [], 
      totalCount: count || 0 
    };
  }, [debouncedSearchQuery, localCategory, localShowDiscounted, localShowUsed, localShowBranded, localSortOption, localPriceRange]);
  
  // Use the pagination hook
  const {
    data: products,
    isLoading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    hasMore,
    loadMore,
    ref
  } = usePagination(fetchProducts, {
    initialPage: 1,
    initialPageSize: 12,
    threshold: 0.5
  });
  
  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, localCategory, localShowDiscounted, localShowUsed, localShowBranded, localSortOption, localPriceRange, setPage]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Filters - Desktop */}
      <div className="hidden md:block">
        <ProductFilters 
          selectedCategory={localCategory}
          onCategorySelect={setLocalCategory}
          showDiscounted={localShowDiscounted}
          onDiscountedChange={setLocalShowDiscounted}
          showUsed={localShowUsed}
          onUsedChange={setLocalShowUsed}
          showBranded={localShowBranded}
          onBrandedChange={setLocalShowBranded}
          sortOption={localSortOption}
          onSortChange={setLocalSortOption}
          priceRange={localPriceRange}
          onPriceRangeChange={setLocalPriceRange}
          onResetFilters={resetFilters}
        />
      </div>
      
      {/* Products Grid */}
      <div className="md:col-span-3">
        <ProductsGrid 
          products={products} 
          isLoading={isLoading} 
          layout={localGridLayout}
          onLayoutChange={setLocalGridLayout}
          hasMore={hasMore}
          onLoadMore={loadMore}
          loadMoreRef={ref}
        />
        
        {/* Error message */}
        {error && (
          <div className="text-center p-4 text-red-500">
            {error.message || "An error occurred while loading products."}
          </div>
        )}
      </div>
    </div>
  );
};

// Apply memoization to prevent unnecessary re-renders
export default memoWithTracking(ShoppingSection, 'ShoppingSection');
