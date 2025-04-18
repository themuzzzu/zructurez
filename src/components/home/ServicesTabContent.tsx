
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceCard } from '@/components/ServiceCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ServicesTabContentProps {
  category?: string;
}

export const ServicesTabContent = ({ category = 'all' }: ServicesTabContentProps) => {
  const { data: services, isLoading } = useQuery({
    queryKey: ['tab-services', category],
    queryFn: async () => {
      let query = supabase.from('services').select('*');
      
      if (category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.limit(8);
      
      if (error) {
        console.error('Error fetching services:', error);
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

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No services found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};
