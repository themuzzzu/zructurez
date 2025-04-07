
import { supabase } from "@/integrations/supabase/client";
import { BusinessCard } from "@/components/BusinessCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useOptimizedQuery } from "@/hooks/useOptimizedQuery";
import { useMemo } from "react";

// Define a simple interface for business data
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
  is_open?: boolean;
  wait_time?: string;
  closure_reason?: string;
  verified?: boolean;
}

interface LocalBusinessSpotlightProps {
  businessType?: string;
}

export const LocalBusinessSpotlight = ({ businessType }: LocalBusinessSpotlightProps) => {
  // Create stable query key
  const queryKey = useMemo(() => 
    ['local-businesses', businessType], 
    [businessType]
  );
  
  // Define a type-safe fetch function with explicit return type
  const fetchBusinesses = async (): Promise<BusinessType[]> => {
    try {
      let query = supabase
        .from('businesses')
        .select('id, name, description, image_url, category, location, contact, hours, is_open, wait_time, closure_reason, verified');
        
      // Apply businessType filter if provided
      if (businessType) {
        query = query.eq('business_type', businessType);
      }
      
      // Add limit to reduce data transfer
      query = query.order('created_at', { ascending: false })
        .limit(4);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (!data) return [];

      // Map raw data to the BusinessType interface
      return data.map(item => ({
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
      }));
    } catch (err) {
      console.error("Error fetching local businesses:", err);
      return [];
    }
  };

  // Use optimized query with longer cache time - fixed function call syntax to use object parameter
  const { data: businesses, isLoading } = useOptimizedQuery({
    queryKey,
    queryFn: fetchBusinesses,
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000  // 30 minutes
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

  // No results - explicitly check for array properties with proper typing
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
