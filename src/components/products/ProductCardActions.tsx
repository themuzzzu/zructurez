
import { Button } from "../ui/button";
import { ShoppingBag, Share2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardActionsProps {
  productId: string;
  stock: number;
  views?: number;
}

export const ProductCardActions = ({ productId, stock, views = 0 }: ProductCardActionsProps) => {
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
    const productUrl = `${window.location.origin}/product/${productId}`;
    
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
        window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this product: ${productUrl}`)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this product`)}&url=${encodeURIComponent(productUrl)}`, '_blank');
        break;
    }
  };

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {stock} in stock
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation(); // Prevent navigation when clicking the button
              addToCartMutation.mutate({ productId, quantity: 1 });
            }}
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
                onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking the share button
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking menu items
                handleShare('copy');
              }}>
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking menu items
                handleShare('whatsapp');
              }}>
                Share on WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking menu items
                handleShare('facebook');
              }}>
                Share on Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking menu items
                handleShare('twitter');
              }}>
                Share on Twitter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground mt-2">
        <Eye className="h-4 w-4" />
        <span>{views} views</span>
      </div>
    </div>
  );
};
