
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ProductGrid } from './products/ProductsGrid';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridLayoutType } from './products/types/ProductTypes';
import { ProductFilters } from './marketplace/ProductFilters';
import { Skeleton } from './ui/skeleton';
import { ShoppingCardSkeleton } from './ShoppingCardSkeleton';
import { LoadingView } from './LoadingView';
import { Progress } from './ui/progress';
import { LikeProvider } from './products/LikeContext';

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
  const [localCategory, setLocalCategory] = useState(selectedCategory);
  const [localShowDiscounted, setLocalShowDiscounted] = useState(showDiscounted);
  const [localShowUsed, setLocalShowUsed] = useState(showUsed);
  const [localShowBranded, setLocalShowBranded] = useState(showBranded);
  const [localSortOption, setLocalSortOption] = useState(sortOption);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [localGridLayout, setLocalGridLayout] = useState<GridLayoutType>(gridLayout);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', searchQuery, localCategory, localShowDiscounted, localShowUsed, localShowBranded, localSortOption, localPriceRange],
    queryFn: async () => {
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
      
      switch (localSortOption) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'most-viewed':
          query = query.order('views', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }
      
      if (localPriceRange !== 'all') {
        const [minPrice, maxPrice] = localPriceRange.split('-').map(val => val === 'up' ? '10000000' : val);
        query = query.gte('price', minPrice).lte('price', maxPrice);
      }
      
      try {
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching products:', error);
          return getMockProducts(localCategory);
        }
        
        if (!data || data.length === 0) {
          return getMockProducts(localCategory);
        }
        
        return data;
      } catch (err) {
        console.error('Error in products fetch:', err);
        return getMockProducts(localCategory);
      } finally {
        completeLoadingProgress();
      }
    },
    staleTime: 60000,
  });
  
  const startLoadingProgress = () => {
    setLoadingProgress(0);
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
    }
    
    loadingIntervalRef.current = setInterval(() => {
      setLoadingProgress(prev => {
        const increment = prev < 60 ? 10 : prev < 80 ? 5 : 1;
        const newProgress = Math.min(prev + increment, 95);
        return newProgress;
      });
    }, 100);
  };
  
  const completeLoadingProgress = () => {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
    setLoadingProgress(100);
  };
  
  useEffect(() => {
    setLocalCategory(selectedCategory);
  }, [selectedCategory]);
  
  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    };
  }, []);
  
  const resetFilters = useCallback(() => {
    setLocalCategory('');
    setLocalShowDiscounted(false);
    setLocalShowUsed(false);
    setLocalShowBranded(false);
    setLocalSortOption('newest');
    setLocalPriceRange('all');
  }, []);
  
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
            <LikeProvider>
              <ProductGrid 
                products={products || []} 
                isLoading={isLoading} 
                layout={localGridLayout}
                onLayoutChange={setLocalGridLayout}
                searchQuery={searchQuery}
              />
            </LikeProvider>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingSection;
