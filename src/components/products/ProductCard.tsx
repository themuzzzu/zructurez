import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ShoppingBag, DollarSign, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const queryClient = useQueryClient();

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

  const handleShare = () => {
    toast.success("Share feature coming soon!");
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
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
              onClick={() => addToCartMutation.mutate({ productId: product.id, quantity: 1 })}
              disabled={addToCartMutation.isPending}
            >
              <ShoppingBag className="h-4 w-4" />
              {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};