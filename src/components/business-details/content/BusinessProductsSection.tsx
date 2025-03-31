
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product, Package, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import type { BusinessProduct } from "@/types/business";

interface BusinessProductsSectionProps {
  products?: BusinessProduct[];
  businessId: string;
}

export const BusinessProductsSection = ({ products, businessId }: BusinessProductsSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    if (products && products.length > 0) {
      // Extract unique categories
      const uniqueCategories = [...new Set(products.map(product => product.category || "uncategorized"))];
      setCategories(uniqueCategories);
      setActiveCategory("all");
    }
  }, [products]);
  
  if (!products || products.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Package className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No Products</h3>
        <p className="text-muted-foreground">This business hasn't added any products yet.</p>
      </Card>
    );
  }
  
  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(product => (product.category || "uncategorized") === activeCategory);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Product className="h-5 w-5" />
          Products
        </h3>
        <Badge variant="outline">{products.length} product{products.length !== 1 ? 's' : ''}</Badge>
      </div>
      
      {categories.length > 1 && (
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList className="w-full overflow-x-auto pb-1 justify-start">
            <TabsTrigger value="all" className="flex-shrink-0">All</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="flex-shrink-0">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProducts.map(product => (
          <Card key={product.id} className="overflow-hidden flex flex-col h-full">
            {product.image_url ? (
              <div 
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${product.image_url})` }}
              />
            ) : (
              <div className="h-40 bg-muted flex items-center justify-center">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            
            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium line-clamp-2">{product.name}</h4>
                <span className="font-semibold whitespace-nowrap">₹{product.price}</span>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3 flex-1">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                {product.category && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {product.category}
                  </Badge>
                )}
                
                {product.stock !== undefined && (
                  <span className="text-xs text-muted-foreground">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};
