
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid3X3, Grid2X2, LayoutList } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { motion } from "framer-motion";

export interface ProductsGridProps {
  products: Product[];
  layout?: "grid2x2" | "grid3x3" | "grid4x4" | "list";
  isLoading?: boolean;
  onOpenAddProductDialog?: () => void;
  onLayoutChange?: (layout: "grid2x2" | "grid3x3" | "grid4x4" | "list") => void;
}

export const ProductsGrid = ({ 
  products, 
  layout = "grid3x3", 
  isLoading = false,
  onOpenAddProductDialog,
  onLayoutChange
}: ProductsGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLayout, setCurrentLayout] = useState(layout);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [loadedCount, setLoadedCount] = useState(8);

  // Update layout when prop changes
  useEffect(() => {
    setCurrentLayout(layout);
  }, [layout]);
  
  // Implement progressive loading
  useEffect(() => {
    if (products) {
      setVisibleProducts(products.slice(0, loadedCount));
    }
  }, [products, loadedCount]);
  
  // Implement intersection observer to load more products
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleProducts.length < (products?.length || 0)) {
          setLoadedCount(prev => Math.min(prev + 8, products?.length || 0));
        }
      },
      { threshold: 0.1 }
    );
    
    const footer = document.getElementById('load-more-trigger');
    if (footer) {
      observer.observe(footer);
    }
    
    return () => {
      if (footer) {
        observer.unobserve(footer);
      }
    };
  }, [visibleProducts, products]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleLayoutChange = (value: string) => {
    if (value === "grid2x2" || value === "grid3x3" || value === "grid4x4" || value === "list") {
      setCurrentLayout(value);
      if (onLayoutChange) {
        onLayoutChange(value);
      }
    }
  };

  // Define layouts
  const layoutClasses = {
    grid2x2: "grid-cols-1 sm:grid-cols-2",
    grid3x3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    grid4x4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    list: "grid-cols-1"
  };

  // Use the selected layout or default to grid3x3
  const gridClass = layoutClasses[currentLayout || "grid3x3"];

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-end mb-3 mr-1">
          <ToggleGroup type="single" value={currentLayout} onValueChange={handleLayoutChange}>
            <ToggleGroupItem value="grid4x4">
              <Grid3X3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid2x2">
              <Grid2X2 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list">
              <LayoutList className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className={`grid ${gridClass} gap-4`}>
          {Array(8).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square w-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No products found</p>
        {onOpenAddProductDialog && (
          <Button onClick={onOpenAddProductDialog}>Add Your Product</Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-3 mr-1">
        <ToggleGroup type="single" value={currentLayout} onValueChange={handleLayoutChange}>
          <ToggleGroupItem value="grid4x4">
            <Grid3X3 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid2x2">
            <Grid2X2 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list">
            <LayoutList className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className={`grid ${gridClass} gap-4`}>
        {visibleProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -5 }}
          >
            <Card 
              className="overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={product.image_url || '/placeholder-product.jpg'} 
                    alt={product.title || product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {product.is_discounted && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.discount_percentage || "SALE"}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-base mb-1 line-clamp-2">{product.title || product.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-lg">${product.price}</span>
                  {product.is_discounted && product.original_price && (
                    <span className="text-sm line-through text-muted-foreground">
                      ${product.original_price}
                    </span>
                  )}
                </div>
                {product.rating !== undefined && (
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(product.rating || 0) ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs ml-1">({product.rating_count || 0})</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Invisible element to trigger loading more products */}
      {visibleProducts.length < (products?.length || 0) && (
        <div id="load-more-trigger" className="h-10 mt-4"></div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedProduct && (
            <div className="space-y-4">
              <div className="h-[300px] overflow-hidden rounded-md">
                <img 
                  src={selectedProduct.image_url || '/placeholder-product.jpg'} 
                  alt={selectedProduct.title || selectedProduct.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold">{selectedProduct.title || selectedProduct.name}</h2>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">${selectedProduct.price}</span>
                {selectedProduct.is_discounted && selectedProduct.original_price && (
                  <div className="flex items-center">
                    <span className="text-lg line-through text-muted-foreground mr-2">
                      ${selectedProduct.original_price}
                    </span>
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SAVE {Math.round((1 - Number(selectedProduct.price) / Number(selectedProduct.original_price)) * 100)}%
                    </span>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground">{selectedProduct.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedProduct.category && (
                  <span className="px-3 py-1 bg-muted rounded-full text-xs">
                    {selectedProduct.category}
                  </span>
                )}
                {selectedProduct.brand_name && (
                  <span className="px-3 py-1 bg-muted rounded-full text-xs">
                    Brand: {selectedProduct.brand_name}
                  </span>
                )}
                {selectedProduct.condition && (
                  <span className="px-3 py-1 bg-muted rounded-full text-xs">
                    Condition: {selectedProduct.condition}
                  </span>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
                <Button>Add to Cart</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
