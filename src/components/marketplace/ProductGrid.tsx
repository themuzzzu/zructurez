
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import { Spinner } from "@/components/common/Spinner";
import { GridLayoutType } from "@/components/products/types/layouts";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export interface ProductGridProps {
  category?: string;
  subcategory?: string;
  searchTerm?: string;
  limit?: number;
  showPagination?: boolean;
  gridLayout?: GridLayoutType;
  showHeader?: boolean;
  title?: string;
  userId?: string;
  isBookmarked?: boolean;
  excludeIds?: string[];
  onlyDiscounted?: boolean;
  sortOrder?: "newest" | "price_asc" | "price_desc" | "popularity" | "trending";
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  category,
  subcategory,
  searchTerm = "",
  limit = 12,
  showPagination = true,
  gridLayout = "grid3x3",
  showHeader = true,
  title = "Products",
  userId,
  isBookmarked = false,
  excludeIds = [],
  onlyDiscounted = false,
  sortOrder = "newest"
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      try {
        // Build the base query
        let query = supabase
          .from('products')
          .select(`
            *,
            product_images (*)
          `);
        
        // Apply filters
        if (category && category !== "all") {
          query = query.eq('category', category);
        }
        
        if (subcategory) {
          query = query.eq('subcategory', subcategory);
        }
        
        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }
        
        if (userId) {
          query = query.eq('user_id', userId);
        }
        
        if (excludeIds.length > 0) {
          query = query.not('id', 'in', `(${excludeIds.join(',')})`);
        }
        
        if (onlyDiscounted) {
          query = query.eq('is_discounted', true);
        }
        
        // Get total count for pagination
        const countQuery = query.count();
        const { count, error: countError } = await countQuery;
        
        if (countError) {
          console.error('Error getting count:', countError);
          setTotalProducts(0);
        } else {
          setTotalProducts(count || 0);
          setTotalPages(Math.ceil((count || 0) / limit));
        }
        
        // Apply sorting
        switch (sortOrder) {
          case "price_asc":
            query = query.order('price', { ascending: true });
            break;
          case "price_desc":
            query = query.order('price', { ascending: false });
            break;
          case "popularity":
            query = query.order('views', { ascending: false });
            break;
          case "trending":
            query = query.order('views', { ascending: false }); // For now, using views as trending
            break;
          case "newest":
          default:
            query = query.order('created_at', { ascending: false });
        }
        
        // Apply pagination
        query = query.range((page - 1) * limit, page * limit - 1);
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [category, subcategory, searchTerm, page, limit, userId, excludeIds, onlyDiscounted, sortOrder]);
  
  // Handle page change
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  
  // Get grid classes based on layout
  const getGridClasses = () => {
    switch (gridLayout) {
      case "grid4x4":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
      case "grid2x2":
        return "grid grid-cols-1 sm:grid-cols-2 gap-4";
      case "list":
        return "flex flex-col gap-4";
      case "grid1x1":
        return "grid grid-cols-1 gap-4";
      case "grid3x3":
      default:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
    }
  };
  
  if (loading) {
    return (
      <div className="w-full flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="w-full py-10 text-center">
        <p className="text-muted-foreground">No products found</p>
      </div>
    );
  }
  
  return (
    <div>
      {showHeader && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          {totalProducts > limit && (
            <Button variant="link" onClick={() => navigate("/marketplace")}>
              View All
            </Button>
          )}
        </div>
      )}
      
      <motion.div 
        className={getGridClasses()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {products.map((product) => (
          <ProductCard 
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            originalPrice={product.original_price}
            description={product.description}
            category={product.category}
            imageUrl={product.image_url}
            images={product.product_images}
            views={product.views}
            brandName={product.brand_name}
            condition={product.condition}
            isDiscounted={product.is_discounted}
            isUsed={product.is_used}
            isBranded={product.is_branded}
            stock={product.stock}
          />
        ))}
      </motion.div>
      
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={page === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="flex items-center px-3">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
