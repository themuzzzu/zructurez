import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ServiceHeader } from "@/components/service-details/ServiceHeader";
import { ServiceInfo } from "@/components/service-details/ServiceInfo";
import { ServicePortfolio } from "@/components/service-details/ServicePortfolio";
import { ServiceContactSidebar } from "@/components/service-details/ServiceContactSidebar";
import { ServiceProducts } from "@/components/service-details/ServiceProducts";
import { ErrorView } from "@/components/ErrorView";
import { LoadingView } from "@/components/LoadingView";
import { toast } from "sonner";

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
                <ServiceProducts
                  serviceId={service.id}
                  serviceProducts={service.service_products}
                  marketplaceProducts={service.marketplaceProducts}
                  onAddToCart={handleAddToCart}
                />
              )}
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