
import { Button } from "../ui/button";
import { ShoppingBag, Share2, Eye, CheckCircle, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface ProductCardActionsProps {
  productId: string;
  stock: number;
  views?: number;
}

export const ProductCardActions = ({ productId, stock, views = 0 }: ProductCardActionsProps) => {
  const queryClient = useQueryClient();
  const [isAdded, setIsAdded] = useState(false);

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
      queryClient.invalidateQueries({ queryKey: ['cartCount'] });
      setIsAdded(true);
      toast.success("Added to cart!");
      
      // Reset the added state after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
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
        <span className="text-xs text-muted-foreground flex items-center">
          <Eye className="h-3.5 w-3.5 mr-1 text-gray-400" />
          {views.toLocaleString()} views
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            className={`gap-1.5 px-3 ${isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent navigation when clicking the button
              if (!isAdded && !addToCartMutation.isPending) {
                addToCartMutation.mutate({ productId, quantity: 1 });
              }
            }}
            disabled={addToCartMutation.isPending || stock === 0 || isAdded}
          >
            {addToCartMutation.isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Adding...</span>
              </>
            ) : isAdded ? (
              <>
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>{stock === 0 ? 'Out of stock' : 'Add to Cart'}</span>
              </>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="px-2"
                onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking the share button
              >
                <Share2 className="h-3.5 w-3.5" />
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
      <div className="flex items-center text-xs font-medium mt-2">
        {stock > 0 ? (
          <span className={`${stock < 10 ? 'text-amber-600' : 'text-green-600'}`}>
            {stock < 10 ? `Only ${stock} left in stock` : 'In stock'}
          </span>
        ) : (
          <span className="text-red-600">Out of stock</span>
        )}
      </div>
    </div>
  );
};
