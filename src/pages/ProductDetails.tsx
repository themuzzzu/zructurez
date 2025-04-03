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
  AlertTriangle,
  ThumbsUp,
  MessageCircle,
  Gift,
  Tag,
  Percent,
  MapPin,
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
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductHighlights } from "@/components/products/ProductHighlights";
import { ProductSpecifications } from "@/components/products/ProductSpecifications";
import { ProductOffers } from "@/components/products/ProductOffers";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LikeProvider } from "@/components/products/LikeContext";

// Import View Tracking Functions
const incrementViews = async (tableName: string, id: string) => {
  try {
    const { error } = await supabase.rpc('increment_views', {
      table_name: tableName,
      row_id: id
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
};

// Import Recommendations Service
const getPeopleBoughtTogether = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('id', productId)
      .limit(5);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
};

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const queryClient = useQueryClient();

  // Fetch product details
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

  // Fetch people also bought products
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['peopleBoughtTogether', productId],
    queryFn: () => getPeopleBoughtTogether(productId as string),
    enabled: !!productId,
  });

  // Add to cart mutation
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
      queryClient.invalidateQueries({ queryKey: ['cartCount'] });
      toast.success("Added to cart!");
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      toast.error(error instanceof Error ? error.message : "Failed to add to cart");
    },
  });

  // Add to wishlist mutation
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

  const buyNowHandler = () => {
    if (addToCartMutation.isPending) return;
    
    addToCartMutation.mutate({ 
      productId: product.id, 
      quantity 
    }, {
      onSuccess: () => {
        navigate('/checkout');
      }
    });
  };

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

  // Calculate discount percentage if not provided
  const getDiscountPercentage = () => {
    if (!product) return 0;
    if (product.discount_percentage) return product.discount_percentage;
    if (product.original_price && product.price) {
      return Math.round(((product.original_price - product.price) / product.original_price) * 100);
    }
    return 0;
  };

  // Increment product views
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

  // Mock data for product images (in a real app, this would come from the database)
  const productImages = [
    product.image_url || '/placeholder.svg',
    // Additional images would be here in a real application
  ];

  // Sample offers for the product
  const productOffers = [
    { 
      title: "Bank Offer", 
      description: "10% off on HDFC Bank Credit Card, up to ₹1500 on orders above ₹5000" 
    },
    { 
      title: "Special Price", 
      description: `Get ${getDiscountPercentage()}% off on this product` 
    },
    { 
      title: "No Cost EMI", 
      description: "No Cost EMI available on select cards" 
    },
    { 
      title: "Partner Offer", 
      description: "Get GST invoice and save up to 28% on business purchases" 
    }
  ];

  const stockStatus = product.stock > 10 
    ? "In Stock" 
    : product.stock > 0 
      ? `Only ${product.stock} left in stock - order soon` 
      : "Out of Stock";

  return (
    <Layout hideSidebar>
      <LikeProvider>
        <div className="min-h-screen bg-background">
          <div className="bg-primary px-4 py-3 mb-4 shadow-md sticky top-0 z-30">
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
            {/* Breadcrumb navigation */}
            <div className="text-sm text-muted-foreground mb-4">
              <span className="hover:underline cursor-pointer" onClick={() => navigate('/marketplace')}>Home</span>
              <span> &gt; </span>
              <span className="hover:underline cursor-pointer" onClick={() => navigate(`/marketplace?category=${product.category}`)}>{product.category}</span>
              <span> &gt; </span>
              <span>{product.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column - Product Images */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  <div className="bg-background border border-border rounded-lg p-4">
                    <div className="mb-4 relative group">
                      <AspectRatio ratio={1}>
                        <img 
                          src={productImages[activeImageIndex]} 
                          alt={product.title} 
                          className="w-full h-full object-contain rounded-md transition-transform duration-300 group-hover:scale-105" 
                        />
                      </AspectRatio>

                      {product.is_discounted && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                          {getDiscountPercentage()}% OFF
                        </div>
                      )}

                      {product.is_branded && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                          BRANDED
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <Carousel>
                        <CarouselContent>
                          {productImages.map((img, index) => (
                            <CarouselItem key={index} className="basis-1/4">
                              <AspectRatio ratio={1}>
                                <img 
                                  src={img} 
                                  alt={`${product.title} - View ${index + 1}`} 
                                  className={`w-full h-full object-cover rounded-md cursor-pointer border-2 ${
                                    activeImageIndex === index ? 'border-primary' : 'border-transparent'
                                  }`}
                                  onClick={() => setActiveImageIndex(index)}
                                />
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
                        disabled={addToCartMutation.isPending || product.stock <= 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button 
                        variant="secondary" 
                        className="w-full" 
                        onClick={buyNowHandler}
                        disabled={addToCartMutation.isPending || product.stock <= 0}
                      >
                        Buy Now
                      </Button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <Button 
                        variant="outline" 
                        className="w-full mr-2" 
                        onClick={() => addToWishlistMutation.mutate(product.id)}
                        disabled={addToWishlistMutation.isPending}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Wishlist
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleShare('copy')}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>

                    <div className="mt-4 text-sm text-muted-foreground flex items-center gap-1">
                      <Eye className="h-4 w-4" /> 
                      {product.views || 0} people viewed this
                    </div>
                  </div>
                </div>
              </div>

              {/* Center column - Product Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h1 className="text-2xl font-bold text-foreground">{product.title}</h1>
                  
                  <div className="flex items-center mt-2">
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm flex items-center">
                      <Star className="h-3 w-3 fill-current mr-1" />
                      4.5
                    </div>
                    <span className="mx-2 text-muted-foreground">|</span>
                    <span className="text-muted-foreground text-sm">{product.views || 0} views</span>
                    <span className="mx-2 text-muted-foreground">|</span>
                    <span className="text-muted-foreground text-sm">42 ratings & 15 reviews</span>
                  </div>

                  {/* Stock status */}
                  <div className="mt-2">
                    {product.stock > 0 ? (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" /> {stockStatus}
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" /> Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Price section */}
                  <div className="mt-6">
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
                            {getDiscountPercentage()}% off
                          </span>
                        </>
                      )}
                    </div>
                    
                    {product.stock > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Inclusive of all taxes
                      </div>
                    )}
                  </div>

                  {/* Offers section */}
                  <div className="mt-6">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Tag className="h-4 w-4 text-orange-500" /> Available Offers
                    </h3>
                    <ProductOffers offers={productOffers} />
                  </div>

                  {/* Delivery information */}
                  <div className="mt-6 flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span>Deliver to:</span>
                        <span className="font-medium">Enter Pincode</span>
                        <Button variant="link" className="h-auto p-0 text-sm">Change</Button>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Typically delivered in 5-7 days
                      </div>
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div className="mt-6">
                    <p className="text-sm font-medium mb-2">Quantity:</p>
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || product.stock <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-4 font-medium text-foreground">{quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={quantity >= (product.stock || 10) || product.stock <= 0}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <span className="ml-4 text-sm text-muted-foreground">
                        {product.stock} items available
                      </span>
                    </div>
                  </div>

                  {/* Highlights section */}
                  <div className="mt-6">
                    <h3 className="font-semibold">Highlights</h3>
                    <ProductHighlights product={product} />
                  </div>
                </div>

                {/* Product specifications */}
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Specifications</h2>
                  <ProductSpecifications product={product} />
                </div>

                {/* Product details tabs */}
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Tabs defaultValue="description">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="features">Features</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                      <TabsTrigger value="questions">Questions</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="description" className="mt-4">
                      <h3 className="font-semibold mb-2">Product Description</h3>
                      <p className="text-foreground">{product.description}</p>
                    </TabsContent>
                    
                    <TabsContent value="features" className="mt-4">
                      <h3 className="font-semibold mb-2">Key Features</h3>
                      <ul className="list-disc pl-5 space-y-2 text-foreground">
                        <li>High-quality material</li>
                        <li>Durable design</li>
                        <li>Easy to use</li>
                        <li>Versatile functionality</li>
                        <li>Modern aesthetic</li>
                      </ul>
                    </TabsContent>
                    
                    <TabsContent value="reviews" className="mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Customer Reviews</h3>
                        <Button variant="outline" size="sm">Write a Review</Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm flex items-center">
                                <Star className="h-3 w-3 fill-current mr-1" />
                                5.0
                              </div>
                              <span className="font-medium">Great product!</span>
                            </div>
                            <span className="text-sm text-muted-foreground">2 days ago</span>
                          </div>
                          <p className="mt-2 text-sm">This product exceeded my expectations. The quality is excellent and it arrived quickly.</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Button variant="ghost" size="sm" className="h-8">
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              Helpful (3)
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Comment
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm flex items-center">
                              <Star className="h-3 w-3 fill-current mr-1" />
                              4.0
                            </div>
                            <span className="font-medium">Good value for money</span>
                          </div>
                          <span className="text-sm text-muted-foreground">1 week ago</span>
                        </div>
                        <p className="mt-2 text-sm">Good product for the price. Delivery was prompt and packaging was secure.</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Button variant="ghost" size="sm" className="h-8">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Helpful (1)
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4">
                      Load More Reviews
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="questions" className="mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Questions & Answers</h3>
                      <Button variant="outline" size="sm">Ask a Question</Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-primary">Q:</span>
                          <span>Does this product come with a warranty?</span>
                        </div>
                        <div className="flex items-start gap-2 mt-2">
                          <span className="font-medium text-green-600">A:</span>
                          <span>Yes, it comes with a 1-year manufacturer warranty.</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-primary">Q:</span>
                          <span>Is this product water resistant?</span>
                        </div>
                        <div className="flex items-start gap-2 mt-2">
                          <span className="font-medium text-green-600">A:</span>
                          <span>It is water resistant but not waterproof. It can handle light splashes but shouldn't be submerged in water.</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4">
                      See All Questions
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Delivery & warranty */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Delivery & Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Free Delivery</p>
                      <p className="text-sm text-muted-foreground">Delivered within 5-7 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Warranty Protection</p>
                      <p className="text-sm text-muted-foreground">1 year manufacturer warranty</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RefreshCw className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Easy Returns</p>
                      <p className="text-sm text-muted-foreground">10 days return policy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Genuine Product</p>
                      <p className="text-sm text-muted-foreground">100% authentic products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* People also bought section */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <Separator className="my-8" />
              <h2 className="text-xl font-semibold text-foreground mb-6">People Also Bought</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard 
                    key={relatedProduct.id} 
                    product={relatedProduct}
                    layout="grid4x4"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </LikeProvider>
    </Layout>
  );
};

export default ProductDetails;
