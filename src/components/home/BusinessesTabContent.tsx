
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessCard } from '@/components/BusinessCard';
import { Skeleton } from '@/components/ui/skeleton';

interface BusinessesTabContentProps {
  category?: string;
}

export const BusinessesTabContent = ({ category = 'all' }: BusinessesTabContentProps) => {
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['businesses', category],
    queryFn: async () => {
      let query = supabase.from('businesses').select('*');
      
      if (category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.limit(8);
      
      if (error) {
        console.error('Error fetching businesses:', error);
        return [];
      }
      
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="p-4 border rounded-lg">
            <Skeleton className="h-40 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!businesses || businesses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No businesses found in this category.</p>
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
          category={business.category}
          description={business.description}
          image={business.image_url}
          rating={business.rating || 0}
          reviews={business.reviews || 0}
          location={business.location || ""}
          contact={business.contact || ""}
          hours={business.hours || ""}
          verified={business.verified || false}
          appointment_price={business.appointment_price}
          consultation_price={business.consultation_price}
          is_open={business.is_open}
          wait_time={business.wait_time}
          closure_reason={business.closure_reason}
        />
      ))}
    </div>
  );
};
