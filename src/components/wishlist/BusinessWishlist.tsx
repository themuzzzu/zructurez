
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessCard } from "@/components/BusinessCard";
import { Loader2, Search, Building, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const BusinessWishlist = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: likedBusinesses = [], isLoading } = useQuery({
    queryKey: ['user-liked-businesses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('business_likes')
        .select(`
          business_id,
          businesses (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching liked businesses:', error);
        return [];
      }

      return data?.map(item => item.businesses) || [];
    },
  });
  
  const filteredBusinesses = likedBusinesses.filter((business: any) => {
    const businessName = business.name || '';
    const businessDesc = business.description || '';
    const query = searchQuery.toLowerCase();
    
    return businessName.toLowerCase().includes(query) || 
           businessDesc.toLowerCase().includes(query);
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (likedBusinesses.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <Building className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-xl font-semibold">No liked businesses yet</h3>
          <p className="text-muted-foreground">
            Like businesses by clicking the heart icon on business profiles.
          </p>
          <Button onClick={() => window.location.href = '/businesses'}>
            Explore Businesses
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search liked businesses..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
            onClick={() => setSearchQuery("")}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {filteredBusinesses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No matching businesses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business: any) => (
            <div key={business.id} className="h-full">
              <BusinessCard
                id={business.id}
                name={business.name}
                category={business.category || ''}
                description={business.description}
                image={business.image_url || 'https://placehold.co/600x400?text=No+Image'}
                rating={4.5}
                reviews={10}
                location={business.location || ''}
                contact={business.contact || ''}
                hours={business.hours || ''}
                verified={business.verified || false}
                appointment_price={business.appointment_price}
                consultation_price={business.consultation_price}
                wait_time={business.wait_time}
                closure_reason={business.closure_reason}
                is_open={business.is_open}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
