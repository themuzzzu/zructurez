
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ProductCardCompact } from "./ProductCardCompact";
import { ProductCardStandard } from "./ProductCardStandard";
import { GridLayoutType, ProductType } from "./types/ProductTypes";
import { Product } from "@/types/product";

export interface ProductCardProps {
  product: Product | ProductType;
  onClick?: () => void;
  layout?: GridLayoutType;
  sponsored?: boolean;
}

export const ProductCard = ({ 
  product, 
  onClick, 
  layout = "grid4x4", 
  sponsored = false 
}: ProductCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  // Use compact layout for list view
  if (layout === "list") {
    return (
      <ProductCardCompact 
        product={product} 
        onClick={handleClick}
        sponsored={sponsored}
      />
    );
  }
  
  // Use standard card layout for grid views
  return (
    <ProductCardStandard
      product={product}
      onClick={handleClick}
      isGrid2x2={layout === "grid2x2"}
      sponsored={sponsored}
    />
  );
};
