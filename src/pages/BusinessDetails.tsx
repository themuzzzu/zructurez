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
import { useState } from "react";
import { BusinessTabs } from "@/components/business-details/BusinessTabs";
import type { Business, StaffMember, BusinessOwner } from "@/types/business";

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
          business_products (*),
          posts (*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Business not found');
      
      // Parse JSON fields with proper typing
      const parsedData: Business = {
        ...data,
        staff_details: Array.isArray(data.staff_details) 
          ? data.staff_details.map((staff: any): StaffMember => ({
              name: staff.name || null,
              position: staff.position || null,
              experience: staff.experience || null
            }))
          : [],
        owners: Array.isArray(data.owners)
          ? data.owners.map((owner: any): BusinessOwner => ({
              name: owner.name || null,
              role: owner.role || 'Primary Owner',
              position: owner.position || null,
              experience: owner.experience || null
            }))
          : [],
        image_position: typeof data.image_position === 'object' && data.image_position !== null && !Array.isArray(data.image_position)
          ? {
              x: Number(data.image_position.x) || 50,
              y: Number(data.image_position.y) || 50
            }
          : { x: 50, y: 50 },
        posts: data.posts || [],
        business_portfolio: data.business_portfolio || [],
        business_products: data.business_products || []
      };

      return parsedData;
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