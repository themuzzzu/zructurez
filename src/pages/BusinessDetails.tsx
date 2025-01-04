import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Clock, Phone, Building, Mail } from "lucide-react";
import { toast } from "sonner";
import { ErrorView } from "@/components/ErrorView";
import { LoadingView } from "@/components/LoadingView";
import { BusinessOfferings } from "@/components/business-details/BusinessOfferings";
import { BusinessEditButton } from "@/components/business-details/BusinessEditButton";

const BusinessDetails = () => {
  const { id } = useParams();

  // Validate if id is a valid UUID
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '');

  const { data: business, isLoading, error, refetch } = useQuery({
    queryKey: ['business', id],
    queryFn: async () => {
      if (!isValidUUID) {
        throw new Error('Invalid business ID format');
      }

      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          business_portfolio (*),
          business_products (*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Business not found');
      return data;
    },
    enabled: isValidUUID
  });

  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const isOwner = currentUser?.id === business?.user_id;

  const handleContact = () => {
    if (business?.contact) {
      if (business.contact.includes('@')) {
        window.location.href = `mailto:${business.contact}`;
      } else {
        window.location.href = `tel:${business.contact}`;
      }
    } else {
      toast.error("No contact information available");
    }
  };

  if (!isValidUUID) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-[1400px] pt-20 pb-16">
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <h2 className="text-2xl font-semibold">Invalid Business ID</h2>
            <p className="text-muted-foreground">The business ID format is invalid.</p>
            <Link to="/business">
              <Button variant="default">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Businesses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorView />;
  }

  if (isLoading) {
    return <LoadingView />;
  }

  if (!business) {
    return <ErrorView message="Business not found" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/business">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <div className="text-muted-foreground">{business.category}</div>
              </div>
            </div>
            {isOwner && (
              <BusinessEditButton 
                business={business}
                onSuccess={refetch}
              />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {business.image_url && (
                <img
                  src={business.image_url}
                  alt={business.name}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              )}

              <Card className="p-6 space-y-4">
                <h2 className="text-2xl font-semibold">About this business</h2>
                <p className="text-muted-foreground">{business.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {business.location || "Location not specified"}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {business.hours || "Hours not specified"}
                  </div>
                </div>
              </Card>

              {isOwner && (
                <BusinessOfferings 
                  businessId={business.id} 
                  onSuccess={refetch}
                />
              )}

              {/* Display Business Products */}
              {business.business_products && business.business_products.length > 0 && (
                <Card className="p-6 space-y-4">
                  <h2 className="text-2xl font-semibold">Products</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {business.business_products.map((product) => (
                      <Card key={product.id} className="p-4 space-y-2">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        )}
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <div className="font-semibold">₹{product.price}</div>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}

              {/* Display Business Portfolio */}
              {business.business_portfolio && business.business_portfolio.length > 0 && (
                <Card className="p-6 space-y-4">
                  <h2 className="text-2xl font-semibold">Portfolio</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {business.business_portfolio.map((item) => (
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
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  <span className="font-semibold">Business Information</span>
                </div>
                <Button className="w-full" onClick={handleContact}>
                  Contact Business
                </Button>
                <div className="space-y-2">
                  {business.contact && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {business.contact.includes('@') ? (
                        <Mail className="h-4 w-4" />
                      ) : (
                        <Phone className="h-4 w-4" />
                      )}
                      {business.contact}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;