
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
  const business = businessData ? {
    id: businessData.id,
    name: businessData.name,
    description: businessData.description,
    category: businessData.category,
    subcategory: businessData.subcategory,
    image_url: businessData.image_url || '',
    bio: businessData.bio || '',
    created_at: businessData.created_at,
    business_portfolio: businessData.business_portfolio || [],
    business_products: businessData.business_products || [],
    posts: businessData.posts || [],
    appointment_price: businessData.appointment_price,
    consultation_price: businessData.consultation_price,
    verified: businessData.verified || false,
    location: businessData.location || '',
    contact: businessData.contact || '',
    hours: businessData.hours || '',
    user_id: businessData.user_id,
    owner_id: businessData.user_id,
    is_open: businessData.is_open ?? true,
    closure_reason: businessData.closure_reason,
    wait_time: businessData.wait_time,
    website: businessData.website || '',
    owners: businessData.owners || [],
    staff_details: businessData.staff_details || [],
    image_position: businessData.image_position || { x: 50, y: 50 },
    cover_url: businessData.cover_url || ''
  } as Business : {} as Business;

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
