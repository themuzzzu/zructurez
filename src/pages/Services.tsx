
import { useState, useEffect } from "react";
import { ServiceCard } from "@/components/service-marketplace/ServiceCard";
import { ServicesGrid } from "@/components/service-marketplace/ServicesGrid";
import { supabase } from "@/integrations/supabase/client";
import type { Service } from "@/types/service";
import { Heading } from "@/components/ui/heading";
import { ServiceBannerAd } from "@/components/ads/ServiceBannerAd";
import { SponsoredServices } from "@/components/service-marketplace/SponsoredServices";
import { SuggestedServices } from "@/components/service-marketplace/SuggestedServices";
import { TopServices } from "@/components/service-marketplace/TopServices";
import { RecommendedServices } from "@/components/service-marketplace/RecommendedServices";
import { SearchInput } from "@/components/SearchInput";
import { AdvancedSearch } from "@/components/marketplace/AdvancedSearch";

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .limit(12);

        if (error) {
          throw error;
        }

        // Transform the data to ensure availability is always an array
        const transformedData = data?.map(item => ({
          ...item,
          // If availability is a string, parse it as JSON if it starts with [, otherwise make it an array with one item
          availability: typeof item.availability === 'string' ? 
            (item.availability.startsWith('[') ? JSON.parse(item.availability) : [item.availability]) 
            : item.availability || []
        })) || [];

        setServices(transformedData);
        setFilteredServices(transformedData);
      } catch (err: any) {
        setError(err.message || "Failed to load services");
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredServices(services);
      return;
    }
    
    const filtered = services.filter(service => 
      service.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredServices(filtered);
  }, [searchQuery, services]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (loading) {
    return <div className="p-4">Loading services...</div>;
  }

  if (error) {
    return <div className="p-4">Error: {error}</div>;
  }
  
  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      <Heading>Services</Heading>
      
      {/* Search functionality */}
      <div className="mb-6">
        <AdvancedSearch 
          className="w-full" 
          onSearch={handleSearch}
        />
      </div>
      
      {/* Service-specific banner ad */}
      <ServiceBannerAd />
      
      {/* Display recommended services - horizontal scrollable */}
      <RecommendedServices />
      
      {/* Display sponsored services */}
      <SponsoredServices />
      
      {/* Display top services */}
      <TopServices />
      
      {/* Display suggested services */}
      <SuggestedServices />
      
      {/* Regular service listings */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {searchQuery ? `Search Results (${filteredServices.length})` : "All Services"}
        </h2>
        {filteredServices.length > 0 ? (
          <ServicesGrid layout="grid3x3" services={filteredServices} />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No services found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
