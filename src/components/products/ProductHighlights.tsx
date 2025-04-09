
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductHighlightsProps {
  product: Product;
}

export const ProductHighlights = ({ product }: ProductHighlightsProps) => {
  // Use product information to generate highlights
  const highlights = [
    product.category && `Category: ${product.category}`,
    product.brand_name && `Brand: ${product.brand_name}`,
    product.condition && `Condition: ${product.condition}`,
    product.model && `Model: ${product.model}`,
    product.is_branded && "Branded Product",
    product.is_used ? "Used" : "New",
  ].filter(Boolean);

  if (highlights.length === 0) {
    // Default highlights if no product info is available
    return (
      <ul className="mt-2 space-y-2">
        <li className="flex items-start gap-2">
          <Check className="h-5 w-5 text-primary mt-0.5" />
          <span>Quality product</span>
        </li>
        <li className="flex items-start gap-2">
          <Check className="h-5 w-5 text-primary mt-0.5" />
          <span>Fast shipping</span>
        </li>
        <li className="flex items-start gap-2">
          <Check className="h-5 w-5 text-primary mt-0.5" />
          <span>Satisfaction guaranteed</span>
        </li>
      </ul>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-2">
        {highlights.map((highlight, index) => (
          <Badge key={index} variant="outline" className="bg-background">
            {highlight}
          </Badge>
        ))}
      </div>
    </div>
  );
};
