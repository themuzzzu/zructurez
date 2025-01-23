import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShoppingBag, Share2, IndianRupee, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { incrementViews } from "@/services/postService";

const ProductDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
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
    const productUrl = window.location.href;
    
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
        window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this product: ${product?.title} - ${productUrl}`)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this product: ${product?.title}`)}&url=${encodeURIComponent(productUrl)}`, '_blank');
        break;
    }
  };

  useEffect(() => {
    if (product?.id) {
      incrementViews('products', product.id);
    }
  }, [product?.id]);

  if (isLoading) {
    return <div className="container max-w-[1400px] pt-20">Loading...</div>;
  }

  if (!product) {
    return <div className="container max-w-[1400px] pt-20">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container max-w-[1400px]">
        <div className="mb-6">
          <Link to="/marketplace">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {product.product_images?.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {product.product_images.map((image: any, index: number) => (
                    <CarouselItem key={index}>
                      <img
                        src={image.image_url}
                        alt={`${product.title} - Image ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full aspect-square object-cover rounded-lg"
              />
            ) : null}
          </div>

          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{product.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{product.category}</span>
                  {product.subcategory && (
                    <>
                      <span>•</span>
                      <span>{product.subcategory}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-primary flex items-center gap-1">
                  <IndianRupee className="h-5 w-5" />
                  {product.price}
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{product.views || 0} views</span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-semibold">Description</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {(product.brand_name || product.model || product.condition) && (
                <div className="space-y-2">
                  <h2 className="font-semibold">Additional Details</h2>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {product.brand_name && (
                      <div>
                        <span className="text-muted-foreground">Brand: </span>
                        <span>{product.brand_name}</span>
                      </div>
                    )}
                    {product.model && (
                      <div>
                        <span className="text-muted-foreground">Model: </span>
                        <span>{product.model}</span>
                      </div>
                    )}
                    {product.condition && (
                      <div>
                        <span className="text-muted-foreground">Condition: </span>
                        <span>{product.condition}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center gap-2">
                <Button 
                  className="flex-1 gap-2"
                  onClick={() => addToCartMutation.mutate({ productId: product.id, quantity: 1 })}
                  disabled={addToCartMutation.isPending}
                >
                  <ShoppingBag className="h-4 w-4" />
                  {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare('copy')}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;