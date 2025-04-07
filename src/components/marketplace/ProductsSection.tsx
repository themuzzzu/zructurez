
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductGrid } from '../products/ProductGrid';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

interface ProductsData {
  products: Product[];
  totalCount: number;
}

interface ProductsSectionProps {
  category?: string;
  featured?: boolean;
  limit?: number;
  title?: string;
  showViewAll?: boolean;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
  layout?: 'grid' | 'carousel';
  hideCategory?: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  seller_id: string;
  created_at: string;
  views: number;
  rating: number;
  quantity: number;
  is_featured: boolean;
  discount_percent: number;
  tags: string[];
}

export function ProductsSection({
  category,
  featured = false,
  limit = 8,
  title = 'Products',
  showViewAll = true,
  sortBy = 'newest',
  layout = 'grid',
  hideCategory = false,
}: ProductsSectionProps) {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = limit;

  // Function to fetch products
  const fetchProducts = async ({ pageParam = 1 }): Promise<ProductsData> => {
    try {
      let query = supabase.from('products').select('*', { count: 'exact' });

      // Apply filters
      if (category) {
        query = query.eq('category', category);
      }

      if (featured) {
        query = query.eq('is_featured', true);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        case 'popular':
          query = query.order('views', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const from = (pageParam - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        products: data || [],
        totalCount: count || 0,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { products: [], totalCount: 0 };
    }
  };

  // Use tanstack query
  const { data, isLoading, isFetching, fetchNextPage } = useQuery({
    queryKey: ['products', category, featured, sortBy, limit, page],
    queryFn: () => fetchProducts({ pageParam: page }),
    keepPreviousData: true,
  });

  // Update hasMore state when data changes
  useEffect(() => {
    if (data) {
      const productsAvailable = data.totalCount || 0;
      const productsShown = page * pageSize;
      setHasMore(productsShown < productsAvailable);
    }
  }, [data, page, pageSize]);

  // Handle loading more products
  const handleLoadMore = () => {
    if (hasMore && !isFetching) {
      setPage(prev => prev + 1);
    }
  };

  // Convert number to string for id
  const getProductId = (id: number | string): string => {
    return String(id);
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(limit).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
              <Skeleton className="h-40 w-full mb-2" />
              <Skeleton className="h-5 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayProducts = data?.products || [];

  if (displayProducts.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="py-10 text-center">
          <p className="text-muted-foreground">No products found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <ProductGrid 
        products={displayProducts} 
        hideCategory={hideCategory}
        getProductId={getProductId}
      />
      {showViewAll && hasMore && (
        <div className="mt-6 text-center">
          <Button
            onClick={handleLoadMore}
            disabled={isFetching}
            variant="outline"
            className="px-6"
          >
            {isFetching ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  );
}
