
import { ProductCard } from "./ProductCard";
import { GridLayoutType } from "./types/layouts";
import { Product } from "@/types/product";
import { Spinner } from "@/components/common/Spinner";

export interface ProductsGridProps {
  products: Product[] | any[];
  layout?: GridLayoutType;
  isLoading?: boolean;
  onOpenAddProductDialog?: () => void;
}

export const ProductsGrid = ({ 
  products, 
  layout = "grid3x3",
  isLoading = false,
  onOpenAddProductDialog
}: ProductsGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const gridLayoutClass = {
    grid2x2: "grid-cols-1 sm:grid-cols-2 gap-4",
    grid3x3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
    grid4x4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
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
