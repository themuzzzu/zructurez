import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ServiceHeader } from "@/components/service-details/ServiceHeader";
import { ServiceInfo } from "@/components/service-details/ServiceInfo";
import { ServicePortfolio } from "@/components/service-details/ServicePortfolio";
import { ServiceContactSidebar } from "@/components/service-details/ServiceContactSidebar";
import { ServiceProductForm } from "@/components/service-details/ServiceProductForm";
import { ErrorView } from "@/components/ErrorView";
import { LoadingView } from "@/components/LoadingView";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const ServiceDetails = () => {
  const { id } = useParams();

  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select(`
          *,
          service_portfolio (*),
          service_products (
            *,
            service_product_images (*)
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (serviceError) throw serviceError;
      if (!serviceData) throw new Error('Service not found');

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', serviceData.user_id)
        .maybeSingle();

      if (profileError) throw profileError;

      const { data: marketplaceProducts, error: marketplaceError } = await supabase
        .from('products')
        .select(`
          *,
          product_images (*)
        `)
        .eq('user_id', serviceData.user_id)
        .eq('category', 'service-product');

      if (marketplaceError) throw marketplaceError;

      return {
        ...serviceData,
        profile: profileData,
        marketplaceProducts: marketplaceProducts || []
      };
    }
  });

  const handleAddToCart = async (serviceProductId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please log in to add items to cart");
        return;
      }

      // First, check if a corresponding product exists
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('category', 'service-product')
        .eq('service_product_id', serviceProductId)
        .single();

      let productId;

      if (existingProduct) {
        productId = existingProduct.id;
      } else {
        // Find the service product details
        const serviceProduct = service?.service_products?.find(p => p.id === serviceProductId);
        if (!serviceProduct) {
          throw new Error('Service product not found');
        }

        // Create a new product entry
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert({
            title: serviceProduct.name,
            description: serviceProduct.description,
            price: serviceProduct.price,
            category: 'service-product',
            service_product_id: serviceProductId,
            stock: serviceProduct.stock || 1,
            image_url: serviceProduct.image_url,
            user_id: service.user_id
          })
          .select()
          .single();

        if (productError) throw productError;
        productId = newProduct.id;

        // Copy images if they exist
        if (serviceProduct.service_product_images?.length > 0) {
          const imagesToInsert = serviceProduct.service_product_images.map(image => ({
            product_id: productId,
            image_url: image.image_url
          }));

          const { error: imageError } = await supabase
            .from('product_images')
            .insert(imagesToInsert);

          if (imageError) console.error('Error copying images:', imageError);
        }
      }

      // Now add to cart
      const { error: cartError } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: productId,
          quantity: 1
        }, {
          onConflict: 'user_id,product_id'
        });

      if (cartError) throw cartError;
      toast.success("Added to cart!");
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Failed to add to cart");
    }
  };

  if (error) {
    return <ErrorView />;
  }

  if (isLoading) {
    return <LoadingView />;
  }

  if (!service) {
    return <ErrorView message="Service not found" />;
  }

  // ... keep existing code (JSX rendering)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="space-y-6">
          <ServiceHeader title={service.title} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ServiceInfo
                description={service.description}
                location={service.location}
                availability={service.availability}
                imageUrl={service.image_url}
              />
              
              <ServicePortfolio items={service.service_portfolio} />
              
              {(service.service_products?.length > 0 || service.marketplaceProducts?.length > 0) && (
                <Card className="p-6 space-y-4">
                  <h2 className="text-2xl font-semibold">Products</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.service_products?.map((product) => (
                      <Card key={product.id} className="p-4 space-y-2">
                        {product.service_product_images && product.service_product_images.length > 0 ? (
                          <Carousel className="w-full">
                            <CarouselContent>
                              {product.service_product_images.map((image, index) => (
                                <CarouselItem key={index}>
                                  <img
                                    src={image.image_url}
                                    alt={`${product.name} - Image ${index + 1}`}
                                    className="w-full h-48 object-cover rounded-lg"
                                  />
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                          </Carousel>
                        ) : (
                          product.image_url && (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          )
                        )}
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">₹{product.price}</span>
                          <Button
                            onClick={() => handleAddToCart(product.id)}
                            className="gap-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                          </Button>
                        </div>
                      </Card>
                    ))}
                    {service.marketplaceProducts?.map((product) => (
                      <Card key={product.id} className="p-4 space-y-2">
                        {product.product_images && product.product_images.length > 0 ? (
                          <Carousel className="w-full">
                            <CarouselContent>
                              {product.product_images.map((image, index) => (
                                <CarouselItem key={index}>
                                  <img
                                    src={image.image_url}
                                    alt={`${product.title} - Image ${index + 1}`}
                                    className="w-full h-48 object-cover rounded-lg"
                                  />
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                          </Carousel>
                        ) : (
                          product.image_url && (
                            <img
                              src={product.image_url}
                              alt={product.title}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          )
                        )}
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{product.title}</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Marketplace
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">₹{product.price}</span>
                          <Button
                            onClick={() => handleAddToCart(product.id)}
                            className="gap-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}
              
              <ServiceProductForm serviceId={service.id} />
            </div>

            <ServiceContactSidebar
              price={service.price}
              contactInfo={service.contact_info}
              providerName={service.profile?.username}
              providerAvatar={service.profile?.avatar_url}
              userId={service.user_id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
