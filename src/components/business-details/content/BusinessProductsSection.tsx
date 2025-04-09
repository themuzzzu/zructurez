
import React, { useState, useEffect } from "react";
import { ShoppingCard } from "@/components/ShoppingCard";
import { Card } from "@/components/ui/card";
import type { BusinessProduct } from "@/types/business";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPrice } from "@/utils/productUtils";

interface BusinessProductsSectionProps {
  products: BusinessProduct[];
  businessId: string;
  activeCategory?: string;
}

export const BusinessProductsSection: React.FC<BusinessProductsSectionProps> = ({ 
  products,
  businessId,
  activeCategory
}) => {
  const [filteredProducts, setFilteredProducts] = useState<BusinessProduct[]>(products);

  useEffect(() => {
    if (activeCategory) {
      setFilteredProducts(products.filter(product => product.category === activeCategory));
    } else {
      setFilteredProducts(products);
    }
  }, [products, activeCategory]);

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState
          title="No Products Found"
          description={activeCategory ? `No products found in ${activeCategory} category` : "This business hasn't added any products yet."}
          icon="package"
        />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <ShoppingCard
          key={product.id}
          id={product.id}
          title={product.name}
          description={product.description || ""}
          image={product.image_url || ""}
          price={formatPrice(product.price)}
          category={product.category}
          type="business"
        />
      ))}
    </div>
  );
};
