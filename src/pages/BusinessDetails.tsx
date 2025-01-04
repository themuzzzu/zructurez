import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ErrorView } from "@/components/ErrorView";
import { LoadingView } from "@/components/LoadingView";
import { BusinessHeader } from "@/components/business-details/BusinessHeader";
import { BusinessProfile } from "@/components/business-details/BusinessProfile";
import { BusinessContent } from "@/components/business-details/BusinessContent";
import { BusinessEditButton } from "@/components/business-details/BusinessEditButton";
import { useState } from "react";

const BusinessDetails = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

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

  if (!isValidUUID || error) {
    return <ErrorView message={!isValidUUID ? "Invalid business ID format" : undefined} />;
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
          <BusinessHeader
            name={business.name}
            category={business.category}
            isOwner={isOwner}
            onEdit={() => setIsEditing(true)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <BusinessProfile
                description={business.description}
                location={business.location}
                hours={business.hours}
                contact={business.contact}
                verified={business.verified}
                image_url={business.image_url}
              />

              <BusinessContent
                businessId={business.id}
                isOwner={isOwner}
                business_products={business.business_products}
                business_portfolio={business.business_portfolio}
                onSuccess={refetch}
              />
            </div>
          </div>
        </div>
      </div>

      {isOwner && isEditing && (
        <BusinessEditButton
          business={business}
          onSuccess={() => {
            setIsEditing(false);
            refetch();
          }}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default BusinessDetails;