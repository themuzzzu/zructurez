import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Clock, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

const ServiceDetails = () => {
  const { id } = useParams();

  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      // First get the service details
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

      // Then get the profile details using the user_id
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

  const handleContact = () => {
    if (service?.contact_info) {
      if (service.contact_info.includes('@')) {
        window.location.href = `mailto:${service.contact_info}`;
      } else {
        window.location.href = `tel:${service.contact_info}`;
      }
    } else {
      toast.error("No contact information available");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-[1400px] pt-20 pb-16">
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <h2 className="text-2xl font-semibold">Service not found</h2>
            <p className="text-muted-foreground">
              The service you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/services">
              <Button variant="default">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-[1400px] pt-20 pb-16">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-pulse">Loading service details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-[1400px] pt-20 pb-16">
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <h2 className="text-2xl font-semibold">Service not found</h2>
            <p className="text-muted-foreground">
              The service you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/services">
              <Button variant="default">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link to="/services">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">{service.title}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {service.image_url && (
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              )}

              <Card className="p-6 space-y-4">
                <h2 className="text-2xl font-semibold">About this service</h2>
                <p className="text-muted-foreground">{service.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {service.location || "Location not specified"}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {service.availability || "Availability not specified"}
                  </div>
                </div>
              </Card>

              {service.service_portfolio && service.service_portfolio.length > 0 && (
                <Card className="p-6 space-y-4">
                  <h2 className="text-2xl font-semibold">Portfolio</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.service_portfolio.map((item) => (
                      <Card key={item.id} className="p-4 space-y-2">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        )}
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="p-6 space-y-4">
                <div className="text-2xl font-bold">₹{service.price}</div>
                <Button className="w-full" onClick={handleContact}>
                  Contact Service Provider
                </Button>
                <div className="space-y-2">
                  {service.contact_info && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {service.contact_info.includes('@') ? (
                        <Mail className="h-4 w-4" />
                      ) : (
                        <Phone className="h-4 w-4" />
                      )}
                      {service.contact_info}
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <h3 className="font-semibold">Service Provider</h3>
                <div className="flex items-center gap-3">
                  <img
                    src={service.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${service.user_id}`}
                    alt="Provider"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">
                      {service.profile?.username || "Anonymous"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Service Provider
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;