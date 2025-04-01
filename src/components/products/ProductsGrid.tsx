
import { ProductCard } from "./ProductCard";
import { GridLayoutType } from "./types/layouts";
import { Product } from "@/types/product";
import { Spinner } from "@/components/common/Spinner";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";
import { Button } from "@/components/ui/button";

export interface ProductsGridProps {
  products: Product[] | any[];
  layout?: GridLayoutType;
  isLoading?: boolean;
  onOpenAddProductDialog?: () => void;
  searchQuery?: string;
  onLayoutChange?: (layout: GridLayoutType) => void;
}

export const ProductsGrid = ({ 
  products, 
  layout = "grid3x3",
  isLoading = false,
  onOpenAddProductDialog,
  searchQuery,
  onLayoutChange
}: ProductsGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return searchQuery ? (
      <EmptySearchResults searchTerm={searchQuery} />
    ) : (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No products found</p>
        {onOpenAddProductDialog && (
          <Button onClick={onOpenAddProductDialog}>Add Your Product</Button>
        )}
      </div>
    );
  }

  const gridLayoutClass = {
    grid2x2: "grid-cols-1 sm:grid-cols-2 gap-4",
    grid3x3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
    grid4x4: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4",
    list: "flex flex-col gap-3"
  };

  return (
    <div className={`grid ${gridLayoutClass[layout]}`}>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          layout={layout}
        />
      ))}
    </div>
  );
};
