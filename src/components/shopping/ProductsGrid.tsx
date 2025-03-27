
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductsGridProps {
  products: any[] | null;
  isLoading: boolean;
  onOpenAddProductDialog: () => void;
}

export const ProductsGrid = ({ products, isLoading, onOpenAddProductDialog }: ProductsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-3">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm dark:bg-zinc-800">
        <p className="text-muted-foreground">No products found matching your filters.</p>
        <Button variant="outline" className="mt-4" onClick={onOpenAddProductDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Product
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="h-full">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};
