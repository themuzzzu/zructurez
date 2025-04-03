
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

type ProductProps = {
  product: {
    id: string;
    title: string;
    price: number;
    description: string;
    category?: string;
    subcategory?: string;
    brand_name?: string;
    condition?: string;
    model?: string;
    size?: string;
    stock?: number;
    [key: string]: any;
  };
};

export const ProductSpecifications = ({ product }: ProductProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Generate specifications from product data
  const generateSpecifications = () => {
    const specs = [
      { 
        category: "General",
        items: [
          { name: "Brand", value: product.brand_name || "Not specified" },
          { name: "Model", value: product.model || "Not specified" },
          { name: "Type", value: product.subcategory || product.category || "Not specified" },
          { name: "Condition", value: product.condition || (product.is_used ? "Used" : "New") }
        ]
      },
      {
        category: "Dimensions",
        items: [
          { name: "Size", value: product.size || "Not specified" },
          { name: "Weight", value: product.weight || "Not specified" }
        ]
      }
    ];
    
    // If we have product-specific specs in the data, add them
    if (product.specifications) {
      return [...specs, ...product.specifications];
    }
    
    return specs;
  };
  
  const specifications = generateSpecifications();
  const displaySpecifications = isExpanded 
    ? specifications 
    : specifications.slice(0, 2);
  
  return (
    <div className="space-y-6">
      {displaySpecifications.map((specGroup, groupIndex) => (
        <div key={groupIndex}>
          <h3 className="font-medium mb-3 text-foreground">{specGroup.category}</h3>
          <div className="bg-muted rounded-md overflow-hidden">
            {specGroup.items.map((spec, specIndex) => (
              <div 
                key={specIndex} 
                className={`grid grid-cols-3 p-3 text-sm ${
                  specIndex % 2 === 0 ? 'bg-muted' : 'bg-muted/50'
                }`}
              >
                <span className="text-muted-foreground col-span-1">{spec.name}</span>
                <span className="font-medium col-span-2">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {specifications.length > 2 && (
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show More
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
