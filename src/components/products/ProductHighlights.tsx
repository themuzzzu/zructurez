
import { Check } from "lucide-react";

interface ProductHighlightsProps {
  product: any;
}

export const ProductHighlights = ({ product }: ProductHighlightsProps) => {
  // Generate highlights based on product data
  // In a real app, this would come from the database
  const highlights = [
    product.brand_name ? `Brand: ${product.brand_name}` : 'Premium Quality',
    product.size ? `Size: ${product.size}` : 'Standard Size',
    product.condition ? `Condition: ${product.condition}` : 'New Item',
    product.color ? `Color: ${product.color}` : 'Multiple Colors Available',
    'Free & Fast Shipping',
    product.warranty ? `Warranty: ${product.warranty}` : '1 Year Warranty'
  ];

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
      {highlights.map((highlight, index) => (
        <li key={index} className="flex items-start gap-2">
          <Check className="h-4 w-4 text-green-500 mt-0.5" />
          <span className="text-sm">{highlight}</span>
        </li>
      ))}
    </ul>
  );
};
