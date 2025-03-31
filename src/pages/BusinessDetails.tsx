
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ErrorView } from "@/components/ErrorView";
import { LoadingView } from "@/components/LoadingView";
import { BusinessHeader } from "@/components/business-details/BusinessHeader";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateBusinessForm } from "@/components/CreateBusinessForm";
import { useState, useEffect } from "react";
import { BusinessTabs } from "@/components/business-details/BusinessTabs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Business } from "@/types/business";

const BusinessDetails = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '');

  const { data: businessData, isLoading, error, refetch } = useQuery({
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
          business_products (*),
          posts (*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Business not found');
      
      return data;
    },
    enabled: isValidUUID
  });

  // Convert database data to Business type
  const business: Business = businessData ? {
    id: businessData.id,
    name: businessData.name,
    description: businessData.description,
    category: businessData.category,
    location: businessData.location || '',
    contact: businessData.contact || '',
    user_id: businessData.user_id,
    owner_id: businessData.user_id,
    verified: businessData.verified || false,
    image_url: businessData.image_url || '',
    bio: businessData.bio || '',
    created_at: businessData.created_at,
    business_portfolio: businessData.business_portfolio || [],
    business_products: businessData.business_products || [],
    posts: businessData.posts || [],
    is_open: businessData.is_open || false,
    appointment_price: businessData.appointment_price,
    consultation_price: businessData.consultation_price,
    address: businessData.address || '',
    city: businessData.city || '',
    state: businessData.state || '',
    zip: businessData.zip || '',
    phone: businessData.phone || businessData.contact || '',
    email: businessData.email || '',
    sub_category: businessData.sub_category || businessData.category || '',
    logo_url: businessData.logo_url || businessData.image_url || '',
    ratings: businessData.ratings || 0,
    reviews_count: businessData.reviews_count || 0,
    is_verified: businessData.is_verified || businessData.verified || false,
    is_featured: businessData.is_featured || false,
    latitude: businessData.latitude || null,
    longitude: businessData.longitude || null,
    tags: businessData.tags || [],
    social_media: businessData.social_media || {},
    services: businessData.services || [],
    products: businessData.products || [],
    cover_url: businessData.cover_url || '',
    updated_at: businessData.updated_at || businessData.created_at,
    website: businessData.website || null
  } : {} as Business;

  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const isOwner = currentUser?.id === business.user_id;

  useEffect(() => {
    if (id && !isLoading && business && currentUser?.id !== business.user_id) {
      const trackView = async () => {
        try {
          const { error } = await supabase.rpc('increment_business_views', { business_id_param: id });
          if (error) {
            console.error('Error tracking business view:', error);
          }
        } catch (err) {
          console.error('Error calling business view function:', err);
        }
      };
      
      trackView();
    }
  }, [id, isLoading, business, currentUser]);

  if (!isValidUUID || error) {
    return <ErrorView message={!isValidUUID ? "Invalid business ID format" : undefined} />;
  }

  if (isLoading) {
    return <LoadingView />;
  }

  if (!business.id) {
    return <ErrorView message="Business not found" />;
  }

  return (
    <div className="min-h-screen bg-background">
      {!isMobile && <Navbar />}
      
      <div className={`max-w-[1400px] mx-auto ${isMobile ? 'pt-2' : 'pt-20'} pb-16 px-3 sm:px-6`}>
        <div className="space-y-4 animate-fade-in">
          <BusinessHeader
            id={business.id}
            name={business.name}
            category={business.category}
            isOwner={isOwner}
            isOpen={business.is_open}
            onEdit={() => setIsEditing(true)}
          />

          <BusinessTabs
            business={business}
            isOwner={isOwner}
            onRefetch={refetch}
          />
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[600px] h-[90vh]">
          <DialogTitle>Edit Business</DialogTitle>
          <ScrollArea className="h-full pr-4">
            <CreateBusinessForm
              initialData={business}
              onSuccess={() => {
                setIsEditing(false);
                refetch();
              }}
              onCancel={() => setIsEditing(false)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessDetails;
