import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ServiceHeader } from "@/components/service-details/ServiceHeader";
import { ServiceInfo } from "@/components/service-details/ServiceInfo";
import { ServicePortfolio } from "@/components/service-details/ServicePortfolio";
import { ServiceContactSidebar } from "@/components/service-details/ServiceContactSidebar";
import { ServiceProductForm } from "@/components/service-details/ServiceProductForm";
import { ErrorView } from "@/components/ErrorView";
import { LoadingView } from "@/components/LoadingView";

const ServiceDetails = () => {
  const { id } = useParams();

  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select(`
          *,
          service_portfolio (*)
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

      return {
        ...serviceData,
        profile: profileData
      };
    }
  });

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