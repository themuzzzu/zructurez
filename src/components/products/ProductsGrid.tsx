
import { ProductCard } from "./ProductCard";
import { GridLayoutType } from "./types/layouts";

export interface ProductsGridProps {
  products: any[];
  layout: GridLayoutType;
  setLayout?: (layout: GridLayoutType) => void;
}

export const ProductsGrid = ({ products, layout, setLayout }: ProductsGridProps) => {
  // Get grid classes based on layout
  const getGridClasses = () => {
    switch (layout) {
      case "grid2x2":
        return "grid grid-cols-1 sm:grid-cols-2 gap-4";
      case "grid3x3":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
      case "grid4x4":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
      case "list":
        return "flex flex-col gap-4";
      default:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
    }
  };

  return (
    <div className={getGridClasses()}>
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
