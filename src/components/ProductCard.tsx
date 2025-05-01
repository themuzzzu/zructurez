
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  category?: string;
  is_discounted?: boolean;
  discount_percentage?: number;
  original_price?: number;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-all">
        <div className="aspect-square p-3 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
          <img
            src={product.image_url || "/placeholder.png"}
            alt={product.title}
            className="max-h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm line-clamp-1">{product.title}</h3>
          <div className="mt-1 font-bold text-base">
            ${product.price?.toFixed(2)}
            {product.is_discounted && product.original_price && (
              <span className="ml-2 text-xs line-through text-gray-500">
                ${product.original_price?.toFixed(2)}
              </span>
            )}
          </div>
          {product.is_discounted && product.discount_percentage && (
            <Badge variant="destructive" className="mt-1">
              {product.discount_percentage}% OFF
            </Badge>
          )}
          {product.category && (
            <div className="mt-1 text-xs text-gray-500">{product.category}</div>
          )}
          <div className="mt-1 flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
};
