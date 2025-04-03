
import { Badge } from "@/components/ui/badge";

type ProductProps = {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    category?: string;
    subcategory?: string;
    brand_name?: string;
    condition?: string;
    model?: string;
    size?: string;
    is_discounted?: boolean;
    is_used?: boolean;
    is_branded?: boolean;
    [key: string]: any;
  };
};

export const ProductHighlights = ({ product }: ProductProps) => {
  // Create highlights based on product properties
  const highlights = [
    { label: "Category", value: product.category },
    { label: "Brand", value: product.brand_name },
    { label: "Model", value: product.model },
    { label: "Condition", value: product.condition || (product.is_used ? "Used" : "New") },
    { label: "Size", value: product.size }
  ].filter(highlight => highlight.value);

  // Additional features (could be from a separate field in the database)
  const additionalFeatures = [
    product.is_branded && "Branded Product",
    product.is_discounted && "Special Discount",
    product.subcategory && `${product.subcategory} Subcategory`
  ].filter(Boolean);

  return (
    <div className="mt-3 space-y-4">
      {highlights.length > 0 && (
        <ul className="space-y-2">
          {highlights.map((highlight, index) => (
            <li key={index} className="grid grid-cols-3 text-sm">
              <span className="text-muted-foreground col-span-1">{highlight.label}:</span>
              <span className="font-medium col-span-2">{highlight.value}</span>
            </li>
          ))}
        </ul>
      )}
      
      {additionalFeatures.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {additionalFeatures.map((feature, index) => (
            <Badge key={index} variant="outline" className="bg-primary/10">
              {feature}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
