
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Heading } from "@/components/ui/heading";
import { AdvancedSearch } from "@/components/marketplace/AdvancedSearch";
import { ServiceBannerAd } from "@/components/ads/ServiceBannerAd";
import { ServiceSection } from "@/components/service/ServiceSection";
import { BusinessSection } from "@/components/business/BusinessSection";
import { ServicesGrid } from "@/components/service-marketplace/ServicesGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ServicesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services', searchQuery],
    queryFn: async () => {
      try {
        let query = supabase.from("services").select("*");
        
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
        }
        
        const { data } = await query.limit(12);
        
        // Transform the data to ensure availability is always an array
        return data?.map(item => ({
          ...item,
          // If availability is a string, parse it as JSON if it starts with [, otherwise make it an array with one item
          availability: typeof item.availability === 'string' ? 
            (item.availability.startsWith('[') ? JSON.parse(item.availability) : [item.availability]) 
            : item.availability || []
        })) || [];
      } catch (err) {
        console.error("Error fetching services:", err);
        return [];
      }
    }
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Layout>
      <div className="container px-3 py-4 max-w-7xl mx-auto">
        <Heading>Services</Heading>
        
        {/* Service-specific search functionality */}
        <div className="mb-6">
          <AdvancedSearch 
            className="w-full" 
            onSearch={handleSearch}
            placeholder="Find services like plumbing, cleaning, repairs..."
          />
        </div>
        
        {/* Service-specific banner ad */}
        <ServiceBannerAd />
        
        {!searchQuery && (
          <div className="mt-6 space-y-6">
            {/* Trending services section */}
            <ServiceSection type="trending" />
            
            {/* Sponsored services section */}
            <ServiceSection type="sponsored" />
            
            {/* Suggested services section */}
            <ServiceSection type="suggested" />
            
            {/* Related businesses section */}
            <div className="pt-4 border-t">
              <h2 className="text-lg font-bold mb-3">Related Businesses</h2>
              <BusinessSection type="trending" />
            </div>
          </div>
        )}
        
        {/* Search results or all services */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            {searchQuery ? `Search Results (${services.length})` : "All Services"}
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-48 animate-pulse bg-muted rounded-md" />
              ))}
            </div>
          ) : services.length > 0 ? (
            <ServicesGrid layout="grid3x3" services={services} />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No services found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ServicesPage;
