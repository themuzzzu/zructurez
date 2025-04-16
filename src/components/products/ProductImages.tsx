
import { useState, useEffect } from "react";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ProductImage } from "@/types/product";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ProductImagesProps {
  productId: string;
  mainImageUrl?: string | null;
}

export const ProductImages = ({ productId, mainImageUrl }: ProductImagesProps) => {
  const { data: productImages, isLoading } = useQuery({
    queryKey: ['product-images', productId],
    queryFn: async () => {
      // Fetch additional product images
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      
      // Convert Supabase response to match ProductImage interface
      return (data as Array<any>).map(item => ({
        id: item.id,
        product_id: item.product_id,
        image_url: item.image_url,
        display_order: item.display_order || 0 // Provide default value if missing
      })) as ProductImage[];
    },
    staleTime: 60000, // Cache for 1 minute
  });
  
  const [allImages, setAllImages] = useState<string[]>([]);
  
  useEffect(() => {
    const images: string[] = [];
    
    // Add main image first if available
    if (mainImageUrl) {
      images.push(mainImageUrl);
    }
    
    // Add additional images
    if (productImages && productImages.length > 0) {
      productImages.forEach(img => {
        if (img.image_url) {
          images.push(img.image_url);
        }
      });
    }
    
    setAllImages(images);
  }, [mainImageUrl, productImages]);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-16 w-16" />
          <Skeleton className="h-16 w-16" />
          <Skeleton className="h-16 w-16" />
        </div>
      </div>
    );
  }
  
  // If no images at all, show placeholder
  if (allImages.length === 0) {
    return (
      <Card className="h-64 flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </Card>
    );
  }
  
  return <ProductImageCarousel images={allImages} aspectRatio={1} />;
};
