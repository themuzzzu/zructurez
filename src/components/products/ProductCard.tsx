
import { Card } from "../ui/card";
import { useEffect } from "react";
import { incrementViews } from "@/services/postService";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/productUtils";
import { Badge } from "@/components/ui/badge";
import { ProductCardImage } from "./ProductCardImage";
import { ProductCardInfo } from "./ProductCardInfo";
import { ProductCardActions } from "./ProductCardActions";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number | null;
  discount_percentage?: number | null;
  category: string;
  subcategory: string | null;
  image_url: string | null;
  stock: number;
  views?: number;
  reach?: number;
  is_branded?: boolean;
  is_used?: boolean;
  is_discounted?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    incrementViews('products', product.id);
  }, [product.id]);

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card className="overflow-hidden group transition-all duration-300 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700">
      <div className="relative">
        <ProductCardImage 
          imageUrl={product.image_url}
          title={product.title}
          price={product.price}
          onClick={handleProductClick}
        />
        
        {product.is_discounted && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold">
            SALE
          </Badge>
        )}
        
        {product.is_branded && (
          <Badge variant="outline" className="absolute bottom-2 left-2 bg-white/80 dark:bg-black/50 text-xs">
            BRANDED
          </Badge>
        )}
      </div>
      
      <ProductCardInfo 
        title={product.title}
        description={product.description}
        category={product.category}
        subcategory={product.subcategory}
        price={product.price}
        originalPrice={product.original_price}
        discountPercentage={product.discount_percentage}
        onClick={handleProductClick}
      />
      
      <ProductCardActions 
        productId={product.id}
        stock={product.stock}
        views={product.views || 0}
      />
    </Card>
  );
};
