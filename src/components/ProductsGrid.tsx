
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";

export interface ProductsGridProps {
  products: Product[];
  layout?: string;
  isLoading?: boolean;
  onOpenAddProductDialog?: () => void;
}

export const ProductsGrid = ({ 
  products, 
  layout = "grid3x3", 
  isLoading = false,
  onOpenAddProductDialog
}: ProductsGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  // Define layouts
  const layoutClasses = {
    grid2x2: "grid-cols-1 sm:grid-cols-2",
    grid3x3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    grid4x4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    list: "grid-cols-1"
  };

  // Use the selected layout or default to grid3x3
  const gridClass = layoutClasses[layout as keyof typeof layoutClasses] || layoutClasses.grid3x3;

  if (isLoading) {
    return (
      <div className={`grid ${gridClass} gap-4`}>
        {Array(8).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-[200px] w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
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
      <div className={`grid ${gridClass} gap-4`}>
        {products.map((product) => (
          <Card 
            key={product.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleProductClick(product)}
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={product.image_url || '/placeholder-product.jpg'} 
                alt={product.title || product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium">{product.title || product.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold">${product.price}</span>
                {product.is_discounted && (
                  <span className="text-sm line-through text-muted-foreground">
                    ${product.original_price}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

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
                {selectedProduct.is_discounted && (
                  <span className="text-lg line-through text-muted-foreground">
                    ${selectedProduct.original_price}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">{selectedProduct.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedProduct.category && (
                  <span className="px-3 py-1 bg-muted rounded-full text-xs">
                    {selectedProduct.category}
                  </span>
                )}
                {selectedProduct.is_branded && (
                  <span className="px-3 py-1 bg-muted rounded-full text-xs">
                    Branded: {selectedProduct.brand_name}
                  </span>
                )}
                {selectedProduct.is_used && (
                  <span className="px-3 py-1 bg-muted rounded-full text-xs">
                    Used: {selectedProduct.condition}
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
