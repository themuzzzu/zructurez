
import { useState } from "react";

interface Product {
  id: string;
  name?: string;
  title?: string;
  price?: number;
  image?: string;
  image_url?: string;
  description?: string;
  category?: string;
  is_featured?: boolean;
}

interface ProductsGridProps {
  products: Product[];
  layout?: "grid1x1" | "grid2x2" | "grid3x3" | "grid4x4";
}

export const ProductsGrid = ({ 
  products = [], 
  layout = "grid3x3" 
}: ProductsGridProps) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  
  const layoutClasses = {
    grid1x1: "grid-cols-1 gap-4",
    grid2x2: "grid-cols-1 sm:grid-cols-2 gap-4",
    grid3x3: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4",
    grid4x4: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
  };

  return (
    <div className={`grid ${layoutClasses[layout]}`}>
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg overflow-hidden transition-shadow hover:shadow-md"
          onMouseEnter={() => setHoveredProduct(product.id)}
          onMouseLeave={() => setHoveredProduct(null)}
        >
          <div className="relative h-40 overflow-hidden">
            <img
              src={product.image_url || product.image || "/placeholder-product.jpg"}
              alt={product.name || product.title || "Product"}
              className="w-full h-full object-cover transition-transform duration-300"
              style={{
                transform: hoveredProduct === product.id ? "scale(1.05)" : "scale(1)"
              }}
              loading="lazy"
            />
            {product.is_featured && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                Featured
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm line-clamp-1">
              {product.name || product.title}
            </h3>
            {product.price !== undefined && (
              <p className="text-sm font-bold mt-1">₹{product.price.toLocaleString()}</p>
            )}
            {product.category && (
              <p className="text-xs text-gray-500 mt-1">{product.category}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
