
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ProductCardCompact } from "./ProductCardCompact";
import { ProductCardStandard } from "./ProductCardStandard";
import { GridLayoutType, ProductType } from "./types/ProductTypes";
import { Product } from "@/types/product";
import { ProductLikeButton } from "./ProductLikeButton";
import { motion } from "framer-motion";

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
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Use IntersectionObserver for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
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
      <div ref={cardRef}>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCardCompact 
              product={product} 
              onClick={handleClick}
              sponsored={sponsored}
            />
          </motion.div>
        )}
        {!isVisible && (
          <Card className="overflow-hidden">
            <div className="h-24 w-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
          </Card>
        )}
      </div>
    );
  }
  
  // Use standard card layout for grid views
  return (
    <div ref={cardRef}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <ProductCardStandard
            product={product}
            onClick={handleClick}
            isGrid2x2={layout === "grid2x2"}
            sponsored={sponsored}
          />
        </motion.div>
      )}
      {!isVisible && (
        <Card className="overflow-hidden">
          <div className="aspect-square w-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/2"></div>
          </div>
        </Card>
      )}
    </div>
  );
};
