import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ShoppingBag, IndianRupee, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const handleShare = async (platform: 'copy' | 'whatsapp' | 'facebook' | 'twitter') => {
    const productUrl = `${window.location.origin}/marketplace?product=${product.id}`;
    
    switch (platform) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(productUrl);
          toast.success("Link copied to clipboard!");
        } catch (error) {
          toast.error("Failed to copy link");
        }
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this product: ${product.title} - ${productUrl}`)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this product: ${product.title}`)}&url=${encodeURIComponent(productUrl)}`, '_blank');
        break;
    }
  };

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-[#0a0a0a] border-border">
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
            <h3 className="text-lg font-semibold text-foreground">{product.title}</h3>
            <div className="text-sm text-muted-foreground">
              {product.category} {product.subcategory && `• ${product.subcategory}`}
            </div>
          </div>
          <span className="text-lg font-bold text-primary flex items-center gap-1">
            <IndianRupee className="h-4 w-4" />
            {formatPrice(product.price).replace('₹', '')}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleShare('copy')}>
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                  Share on WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('facebook')}>
                  Share on Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('twitter')}>
                  Share on Twitter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
};