import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingBag, DollarSign, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string | null;
  image_url: string | null;
  stock: number;
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    title: "MacBook Pro M2",
    description: "Latest MacBook Pro with M2 chip, perfect for professionals.",
    price: 1299.99,
    category: "Electronics",
    subcategory: "Laptops",
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    stock: 10
  },
  {
    id: "223e4567-e89b-12d3-a456-426614174001",
    title: "Wireless Noise-Canceling Headphones",
    description: "Premium wireless headphones with active noise cancellation.",
    price: 249.99,
    category: "Electronics",
    subcategory: "Audio",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    stock: 15
  },
  {
    id: "323e4567-e89b-12d3-a456-426614174002",
    title: "Designer Denim Jacket",
    description: "Classic denim jacket with modern styling.",
    price: 89.99,
    category: "Clothing",
    subcategory: "Outerwear",
    image_url: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=800",
    stock: 20
  },
  {
    id: "423e4567-e89b-12d3-a456-426614174003",
    title: "Smart Watch Series 5",
    description: "Advanced smartwatch with health monitoring features.",
    price: 399.99,
    category: "Electronics",
    subcategory: "Wearables",
    image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
    stock: 8
  }
];

export const ShoppingSection = () => {
  const queryClient = useQueryClient();

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching products:', error);
          throw error;
        }
        
        return data.length > 0 ? data : SAMPLE_PRODUCTS;
      } catch (error) {
        console.error('Failed to fetch products:', error);
        return SAMPLE_PRODUCTS;
      }
    },
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity: number }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to add items to cart');
      }

      const { data, error } = await supabase
        .from('cart_items')
        .upsert(
          {
            user_id: session.session.user.id,
            product_id: productId,
            quantity,
          },
          {
            onConflict: 'user_id, product_id',
            ignoreDuplicates: false,
          }
        );

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success("Added to cart!");
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      toast.error(error instanceof Error ? error.message : "Failed to add to cart");
    },
  });

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
    } catch (error) {
      // Error is handled in mutation callbacks
    }
  };

  const handleShare = (productId: string) => {
    toast.success("Share feature coming soon!");
  };

  if (isLoading) {
    return <div className="text-center">Loading products...</div>;
  }

  if (isError) {
    toast.error("Failed to load products. Showing sample products instead.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Featured Products</h2>
        <Button variant="outline" className="gap-2">
          <ShoppingBag className="h-4 w-4" />
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(products || SAMPLE_PRODUCTS).map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <div className="text-sm text-muted-foreground">
                    {product.category} {product.subcategory && `• ${product.subcategory}`}
                  </div>
                </div>
                <span className="text-lg font-bold text-primary flex items-center">
                  <DollarSign className="h-4 w-4" />
                  {product.price}
                </span>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {product.stock} in stock
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addToCartMutation.isPending}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleShare(product.id)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};