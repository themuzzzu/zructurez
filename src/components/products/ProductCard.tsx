
import { Card } from "../ui/card";
import { useEffect } from "react";
import { incrementViews } from "@/services/postService";
import { useNavigate } from "react-router-dom";
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
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-card border-border">
      <ProductCardImage 
        imageUrl={product.image_url}
        title={product.title}
        price={product.price}
        onClick={handleProductClick}
      />
      
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
