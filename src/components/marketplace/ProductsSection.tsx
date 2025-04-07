
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCard } from "@/components/ShoppingCard";
import { ShoppingCardSkeleton } from "@/components/ShoppingCardSkeleton";
import { Button } from "@/components/ui/button";
import { GridLayoutType } from '@/components/products/types/ProductTypes';
import { GridLayoutSelector } from './GridLayoutSelector';
import { cn } from '@/lib/utils';

interface ProductsSectionProps {
  title: string;
  subtitle?: string;
  sortBy?: string;
  limit?: number;
  showViewAll?: boolean;
  className?: string;
  gridLayout?: GridLayoutType;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  category?: string;
  subcategory?: string;
  user_id?: string;
  created_at?: string;
  views?: number;
}

export const ProductsSection = ({ 
  title, 
  subtitle,
  sortBy = "created_at", 
  limit = 4,
  showViewAll = true,
  className,
  gridLayout = "grid3x3" 
}: ProductsSectionProps) => {
  const navigate = useNavigate();
  const [layout, setLayout] = useState<GridLayoutType>(gridLayout);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', sortBy, limit],
    queryFn: async (): Promise<Product[]> => {
      try {
        let query = supabase
          .from('products')
          .select('*');

        // Sort by the requested field
        if (sortBy === 'price') {
          query = query.order('price', { ascending: true });
        } else if (sortBy === 'views') {
          query = query.order('views', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        // Add limit
        query = query.limit(limit);

        const { data, error } = await query;

        if (error) throw error;
        return data || []; 
      } catch (err) {
        console.error(`Error fetching ${title} products:`, err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getGridClass = () => {
    switch (layout) {
      case "grid1x1":
        return "grid-cols-1";
      case "grid2x2":
        return "grid-cols-1 sm:grid-cols-2";
      case "grid4x4":
        return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      case "grid3x3":
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
    }
  };

  const handleViewAll = () => {
    navigate(`/products?sort=${sortBy}`);
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
          <GridLayoutSelector layout={layout} onChange={setLayout} />
        </div>
        <div className={cn("grid gap-4", getGridClass())}>
          {Array(limit).fill(0).map((_, i) => (
            <ShoppingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          {showViewAll && (
            <Button variant="outline" onClick={handleViewAll}>
              View All
            </Button>
          )}
          <GridLayoutSelector layout={layout} onChange={setLayout} />
        </div>
      </div>
      <div className={cn("grid gap-4", getGridClass())}>
        {products.map((product) => (
          <ShoppingCard
            key={product.id}
            id={product.id}
            name={product.title}
            description={product.description}
            price={product.price}
            image={product.image_url || ""}
            category={product.category || ""}
          />
        ))}
      </div>
    </div>
  );
};
