
import { BusinessContent } from "@/components/business-details/BusinessContent";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo } from "react";
import type { Business, BusinessProduct } from "@/types/business";

interface BusinessProductsTabProps {
  businessId: string;
  isOwner: boolean;
  products: Business['business_products'];
  onSuccess: () => void;
}

export const BusinessProductsTab = ({ businessId, isOwner, products, onSuccess }: BusinessProductsTabProps) => {
  // Group products by category
  const productCategories = useMemo(() => {
    const categories = new Set<string>();
    
    // Add "All" category and extract unique categories
    categories.add("All");
    products?.forEach(product => {
      if (product.category) {
        categories.add(product.category);
      } else {
        categories.add("Uncategorized");
      }
    });
    
    return Array.from(categories);
  }, [products]);
  
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") {
      return products;
    }
    
    if (activeCategory === "Uncategorized") {
      return products.filter(product => !product.category);
    }
    
    return products.filter(product => product.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <Card className="p-4 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      
      {productCategories.length > 1 && (
        <div className="mb-4 border border-border/30 rounded-md p-1">
          <ScrollArea className="pb-1">
            <TabsList className="flex w-full min-w-fit bg-transparent justify-start">
              {productCategories.map(category => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setActiveCategory(category)}
                  className={`transition-all duration-300 px-3 py-1.5 text-xs sm:text-sm rounded-md ${
                    activeCategory === category ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        </div>
      )}
      
      <BusinessContent
        // Create a minimal Business object with required properties
        business={{ 
          id: businessId,
          name: "", // Provide empty strings for required properties
          description: "",
          category: ""
        }}
        business_products={filteredProducts}
        business_portfolio={[]}
        onSuccess={onSuccess}
        activeCategory={activeCategory !== "All" && activeCategory !== "Uncategorized" ? activeCategory : undefined}
      />
    </Card>
  );
};
