import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Plus, 
  Minus, 
  Truck, 
  Shield, 
  RefreshCw,
  IndianRupee,
  Eye,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { incrementViews } from "@/services/postService";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['relatedProducts', product?.category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', product?.category)
        .neq('id', productId)
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!product?.category,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
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

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to add items to wishlist');
      }

      const { data, error } = await supabase
        .from('wishlists')
        .upsert(
          {
            user_id: session.session.user.id,
            product_id: productId,
          },
          {
            onConflict: 'user_id, product_id',
          }
        );

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Added to wishlist!");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to add to wishlist");
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    if (productId) {
      incrementViews('products', productId);
    }
  }, [productId]);

  if (isLoading) {
    return (
      <Layout hideSidebar>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout hideSidebar>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Button onClick={() => navigate('/marketplace')}>Return to Marketplace</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideSidebar>
      <div className="min-h-screen bg-background">
        <div className="bg-primary px-4 py-3 mb-4 shadow-md sticky top-0 z-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/10"
                onClick={() => navigate('/marketplace')}
                aria-label="Back to marketplace"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg md:text-xl font-bold text-white truncate">
                {product.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="mb-4">
                <AspectRatio ratio={1}>
                  <img 
                    src={product.image_url || '/placeholder.svg'} 
                    alt={product.title} 
                    className="w-full h-full object-contain rounded-md"
                  />
                </AspectRatio>
              </div>
              
              <div className="mt-4">
                <Carousel>
                  <CarouselContent>
                    <CarouselItem className="basis-1/4">
                      <AspectRatio ratio={1}>
                        <img 
                          src={product.image_url || '/placeholder.svg'} 
                          alt={product.title} 
                          className="w-full h-full object-cover rounded-md border-2 border-primary"
                        />
                      </AspectRatio>
                    </CarouselItem>
                    {[1, 2, 3, 4].map((_, index) => (
                      <CarouselItem key={index} className="basis-1/4">
                        <AspectRatio ratio={1}>
                          <div className="w-full h-full bg-muted flex items-center justify-center rounded-md">
                            <span className="text-muted-foreground text-sm">View {index + 1}</span>
                          </div>
                        </AspectRatio>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button 
                  className="w-full" 
                  onClick={() => addToCartMutation.mutate({ productId: product.id, quantity })}
                  disabled={addToCartMutation.isPending}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => addToWishlistMutation.mutate(product.id)}
                  disabled={addToWishlistMutation.isPending}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Eye className="h-4 w-4" /> 
                  {product.views || 0} views
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleShare('copy')}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{product.title}</h1>
                <div className="flex items-center mt-2">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm flex items-center">
                    <Star className="h-3 w-3 fill-current mr-1" />
                    4.5
                  </div>
                  <span className="mx-2 text-muted-foreground">|</span>
                  <span className="text-muted-foreground text-sm">{product.views || 0} views</span>
                </div>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground flex items-center">
                    <IndianRupee className="h-5 w-5" />
                    {formatPrice(product.price).replace('₹', '')}
                  </span>
                  {product.original_price && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        ₹{formatPrice(product.original_price).replace('₹', '')}
                      </span>
                      <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                        {product.discount_percentage}% off
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Quantity:</p>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-4 font-medium text-foreground">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= (product.stock || 10)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="ml-4 text-sm text-muted-foreground">
                      {product.stock} items available
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-2">Product Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="flex justify-between py-1 border-b border-border">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium text-foreground">{product.category}</span>
                    </p>
                    {product.subcategory && (
                      <p className="flex justify-between py-1 border-b border-border">
                        <span className="text-muted-foreground">Subcategory</span>
                        <span className="font-medium text-foreground">{product.subcategory}</span>
                      </p>
                    )}
                    {product.brand_name && (
                      <p className="flex justify-between py-1 border-b border-border">
                        <span className="text-muted-foreground">Brand</span>
                        <span className="font-medium text-foreground">{product.brand_name}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    {product.model && (
                      <p className="flex justify-between py-1 border-b border-border">
                        <span className="text-muted-foreground">Model</span>
                        <span className="font-medium text-foreground">{product.model}</span>
                      </p>
                    )}
                    {product.size && (
                      <p className="flex justify-between py-1 border-b border-border">
                        <span className="text-muted-foreground">Size</span>
                        <span className="font-medium text-foreground">{product.size}</span>
                      </p>
                    )}
                    {product.condition && (
                      <p className="flex justify-between py-1 border-b border-border">
                        <span className="text-muted-foreground">Condition</span>
                        <span className="font-medium text-foreground">{product.condition}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <Tabs defaultValue="description">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="specs">Specifications</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="mt-4">
                    <p className="text-foreground">{product.description}</p>
                  </TabsContent>
                  <TabsContent value="features" className="mt-4">
                    <ul className="list-disc pl-5 space-y-2 text-foreground">
                      <li>High-quality material</li>
                      <li>Durable design</li>
                      <li>Easy to use</li>
                      <li>Versatile functionality</li>
                      <li>Modern aesthetic</li>
                    </ul>
                  </TabsContent>
                  <TabsContent value="specs" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="flex justify-between py-1 border-b border-border">
                          <span className="text-muted-foreground">Dimensions</span>
                          <span className="font-medium text-foreground">10 x 5 x 2 cm</span>
                        </p>
                        <p className="flex justify-between py-1 border-b border-border">
                          <span className="text-muted-foreground">Weight</span>
                          <span className="font-medium text-foreground">150g</span>
                        </p>
                        <p className="flex justify-between py-1 border-b border-border">
                          <span className="text-muted-foreground">Material</span>
                          <span className="font-medium text-foreground">Premium plastic</span>
                        </p>
                      </div>
                      <div>
                        <p className="flex justify-between py-1 border-b border-border">
                          <span className="text-muted-foreground">Color</span>
                          <span className="font-medium text-foreground">Multiple available</span>
                        </p>
                        <p className="flex justify-between py-1 border-b border-border">
                          <span className="text-muted-foreground">Warranty</span>
                          <span className="font-medium text-foreground">1 year</span>
                        </p>
                        <p className="flex justify-between py-1 border-b border-border">
                          <span className="text-muted-foreground">Manufacturing</span>
                          <span className="font-medium text-foreground">Made in India</span>
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Delivery & Services</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Free Delivery</p>
                      <p className="text-sm text-muted-foreground">Delivered within 3-7 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Warranty Protection</p>
                      <p className="text-sm text-muted-foreground">1 year manufacturer warranty</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RefreshCw className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">7 Days Return Policy</p>
                      <p className="text-sm text-muted-foreground">Easy returns if you change your mind</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.is_branded && (
                  <Badge variant="outline" className="border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400">
                    <CheckCircle className="h-3 w-3 mr-1" /> Branded
                  </Badge>
                )}
                {product.is_discounted && (
                  <Badge variant="outline" className="border-green-500 text-green-500 dark:border-green-400 dark:text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" /> On Sale
                  </Badge>
                )}
                {product.is_used && (
                  <Badge variant="outline" className="border-amber-500 text-amber-500 dark:border-amber-400 dark:text-amber-400">
                    <Clock className="h-3 w-3 mr-1" /> Used Item
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-12">
              <Separator className="my-8" />
              <h2 className="text-xl font-semibold text-foreground mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <div 
                    key={relatedProduct.id}
                    className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  >
                    <AspectRatio ratio={16/9}>
                      <img 
                        src={relatedProduct.image_url || '/placeholder.svg'} 
                        alt={relatedProduct.title} 
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                    <div className="p-3">
                      <h3 className="font-medium text-foreground truncate">{relatedProduct.title}</h3>
                      <p className="text-primary font-semibold mt-1">
                        ₹{formatPrice(relatedProduct.price).replace('₹', '')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
