
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessCard } from "@/components/BusinessCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface BusinessType {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  image_url?: string;
  category?: string;
  location?: string;
  rating?: number;
  reviews?: number;
  contact?: string;
  hours?: string;
  is_verified?: boolean;
  is_open?: boolean;
  wait_time?: string;
  closure_reason?: string;
  verified?: boolean;
}

interface LocalBusinessSpotlightProps {
  businessType?: string;
}

export const LocalBusinessSpotlight = ({ businessType }: LocalBusinessSpotlightProps) => {
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['local-businesses', businessType],
    queryFn: async () => {
      try {
        let query = supabase
          .from('businesses')
          .select('id, name, description, image_url, category, location, contact, hours, is_open, wait_time, closure_reason, verified');
          
        // Apply businessType filter if it's provided
        if (businessType) {
          query = query.eq('business_type', businessType);
        }
        
        query = query.order('created_at', { ascending: false })
          .limit(4);
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (!data) return [] as BusinessType[];
        
        // Use type assertion to avoid excessive type instantiation
        return (data as any[]).map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          image_url: item.image_url,
          category: item.category,
          location: item.location,
          is_open: item.is_open,
          wait_time: item.wait_time,
          closure_reason: item.closure_reason,
          verified: item.verified,
        } as BusinessType));
      } catch (err) {
        console.error("Error fetching local businesses:", err);
        return [] as BusinessType[];
      }
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // No results
  if (!businesses || businesses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No local businesses found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {businesses.map((business) => (
        <BusinessCard 
          key={business.id}
          id={business.id}
          name={business.name}
          description={business.description || ""}
          image={business.image_url || ""}
          category={business.category || ""}
          location={business.location || ""}
          rating={4.0}
          reviews={0}
          contact={business.contact || ""}
          hours={business.hours || ""}
          verified={business.verified || false}
          is_open={business.is_open}
          wait_time={business.wait_time}
          closure_reason={business.closure_reason}
        />
      ))}
    </div>
  );
};
