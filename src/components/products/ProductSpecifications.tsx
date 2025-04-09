
import React from "react";
import { Product } from "@/types/product";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ProductSpecificationsProps {
  product: Product;
}

export const ProductSpecifications = ({ product }: ProductSpecificationsProps) => {
  // Create specs from product data
  const generalSpecs = {
    "Category": product.category || "General",
    "Brand": product.brand_name || product.brand || "Not specified",
    "Model": product.model || "Not specified",
    "Condition": product.condition || (product.is_used ? "Used" : "New"),
  };

  // Get product labels if available
  const productLabels = product.labels || [];

  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="general">
          <AccordionTrigger>General</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {Object.entries(generalSpecs).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 gap-2">
                  <span className="font-medium">{key}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {productLabels.map((label) => (
          <AccordionItem key={label.id || label.name} value={label.name}>
            <AccordionTrigger>{label.name}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {label.attributes.map((attribute, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <span className="font-medium">
                      {typeof attribute === 'object' && attribute !== null && attribute
                        ? attribute.name || 'Attribute' 
                        : typeof attribute === 'string' && attribute && attribute.includes(':')
                          ? attribute.split(':')[0]
                          : 'Feature'
                      }
                    </span>
                    <span>
                      {typeof attribute === 'object' && attribute !== null && attribute
                        ? attribute.value || '-' 
                        : typeof attribute === 'string' && attribute && attribute.includes(':')
                          ? attribute.split(':')[1]
                          : attribute
                      }
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}

        <AccordionItem value="additional">
          <AccordionTrigger>Additional Information</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Stock</span>
                <span>{product.stock || 0} available</span>
              </div>
              {product.size && (
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium">Size</span>
                  <span>{product.size}</span>
                </div>
              )}
              {product.discount_percentage && (
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium">Discount</span>
                  <span>{product.discount_percentage}% off</span>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
