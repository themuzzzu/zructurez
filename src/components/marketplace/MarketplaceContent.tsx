
import React from "react";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Service } from "@/types/service";

export const MarketplaceContent = () => {
  const [products, setProducts] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .limit(10);

        if (error) {
          console.error("Error fetching products:", error);
          return;
        }

        setProducts(data || []);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const mockProducts = [
    {
      id: "1",
      title: "Handmade Wall Art",
      description: "Beautiful handcrafted wall art for your home",
      price: 79.99,
      image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Home Decor",
      user_id: "user1",
    },
    {
      id: "2",
      title: "Organic Skin Care Set",
      description: "100% natural ingredients for healthy skin",
      price: 49.99,
      image_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "Beauty",
      user_id: "user2",
    }
  ];

  const displayProducts = products.length > 0 ? products : mockProducts;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <p>Loading products...</p>
        ) : (
          displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};
