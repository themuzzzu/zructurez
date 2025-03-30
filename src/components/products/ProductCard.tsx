
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ProductCardCompact } from "./ProductCardCompact";
import { ProductCardStandard } from "./ProductCardStandard";
import { ProductType } from "./types/ProductTypes";

export interface ProductCardProps {
  product: ProductType;
  onClick?: () => void;
  layout?: "grid4x4" | "grid2x2" | "grid1x1";
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
  if (layout === "grid1x1") {
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
