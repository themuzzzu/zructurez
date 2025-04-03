
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ProductsGrid } from './products/ProductsGrid';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridLayoutType } from './products/types/layouts';
import { ProductFilters } from './marketplace/ProductFilters';
import { Skeleton } from './ui/skeleton';
import { ShoppingCardSkeleton } from './ShoppingCardSkeleton';
import { LoadingView } from './LoadingView';
import { Progress } from './ui/progress';

interface ShoppingSectionProps {
  searchQuery: string;
  selectedCategory?: string;
  showDiscounted?: boolean;
  showUsed?: boolean;
  showBranded?: boolean;
  sortOption?: string;
  priceRange?: string;
  gridLayout?: GridLayoutType;
  title?: string;
}

export const ShoppingSection = ({
  searchQuery,
  selectedCategory = '',
  showDiscounted = false,
  showUsed = false,
  showBranded = false,
  sortOption = 'newest',
  priceRange = 'all',
  gridLayout = 'grid4x4',
  title = 'Products'
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
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Progress reference for loading animation
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fetch products based on filters
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', searchQuery, localCategory, localShowDiscounted, localShowUsed, localShowBranded, localSortOption, localPriceRange],
    queryFn: async () => {
      // Start loading progress animation
      startLoadingProgress();
      
      let query = supabase.from('products').select('*');
      
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
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
      
      try {
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching products:', error);
          // If the table doesn't exist or there's an error, return mock data
          return getMockProducts(localCategory);
        }
        
        if (!data || data.length === 0) {
          // If no data, return mock products
          return getMockProducts(localCategory);
        }
        
        return data;
      } catch (err) {
        console.error('Error in products fetch:', err);
        // Return mock data on error
        return getMockProducts(localCategory);
      } finally {
        // Complete the loading animation
        completeLoadingProgress();
      }
    },
    staleTime: 60000, // 1 minute
  });
  
  // Start loading animation
  const startLoadingProgress = () => {
    setLoadingProgress(0);
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
    }
    
    loadingIntervalRef.current = setInterval(() => {
      setLoadingProgress(prev => {
        // Slow down as it approaches 100%
        const increment = prev < 60 ? 10 : prev < 80 ? 5 : 1;
        const newProgress = Math.min(prev + increment, 95);
        return newProgress;
      });
    }, 100);
  };
  
  // Complete loading animation
  const completeLoadingProgress = () => {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
    setLoadingProgress(100);
  };
  
  // Reset to first page when filters change
  useEffect(() => {
    setLocalCategory(selectedCategory);
  }, [selectedCategory]);
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    };
  }, []);
  
  // Reset filters function
  const resetFilters = useCallback(() => {
    setLocalCategory('');
    setLocalShowDiscounted(false);
    setLocalShowUsed(false);
    setLocalShowBranded(false);
    setLocalSortOption('newest');
    setLocalPriceRange('all');
  }, []);
  
  // Generate mock products for when database doesn't have data
  const getMockProducts = (category: string = '') => {
    const categoryNames = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Toys'];
    const selectedCat = category || categoryNames[Math.floor(Math.random() * categoryNames.length)];
    
    return Array(12).fill(0).map((_, index) => ({
      id: `mock-${index}`,
      title: `${selectedCat} Product ${index + 1}`,
      description: `This is a mock product in the ${selectedCat} category.`,
      price: Math.floor(Math.random() * 100) + 10,
      image_url: `https://picsum.photos/seed/${selectedCat}${index}/300/300`,
      category: selectedCat.toLowerCase(),
      is_discounted: Math.random() > 0.7,
      discount_percentage: Math.floor(Math.random() * 30) + 10,
      rating: (Math.random() * 3) + 2,
      rating_count: Math.floor(Math.random() * 100) + 5,
      created_at: new Date().toISOString(),
    }));
  };
  
  return (
    <div>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      
      {isLoading && (
        <div className="w-full h-1 mb-4">
          <Progress value={loadingProgress} className="h-1" />
        </div>
      )}
      
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
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <ShoppingCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-center p-4 text-red-500">
              An error occurred while loading products. Please try again.
            </div>
          ) : (
            <ProductsGrid 
              products={products || []} 
              isLoading={isLoading} 
              layout={localGridLayout}
              onLayoutChange={setLocalGridLayout}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingSection;
