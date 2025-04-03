
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessCard } from "@/components/BusinessCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, Users, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const BusinessRankingsSection = () => {
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['top-businesses'],
    queryFn: async () => {
      // Get top businesses by views from business_analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('business_analytics')
        .select('business_id, page_views')
        .order('page_views', { ascending: false })
        .limit(8);
      
      if (analyticsError) throw analyticsError;
      
      if (!analyticsData || analyticsData.length === 0) {
        // Fallback: just get all businesses
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .limit(8);
          
        if (error) throw error;
        return data || [];
      }
      
      // Get the business details
      const businessIds = analyticsData.map(item => item.business_id);
      const { data: businesses, error } = await supabase
        .from('businesses')
        .select('*')
        .in('id', businessIds);
        
      if (error) throw error;
      
      // Sort them according to analytics
      const sortedBusinesses = businessIds.map(id => 
        businesses?.find(business => business.id === id)
      ).filter(Boolean);
      
      return sortedBusinesses || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const [activeTab, setActiveTab] = useState("viewed");

  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
        <h3 className="text-xl md:text-2xl font-bold">Business Rankings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!businesses || businesses.length === 0) {
    return null;
  }

  // Helper function to render rank badges
  const renderRankBadge = (index: number) => {
    // Different badge styles based on ranking
    if (index === 0) {
      return (
        <Badge className="absolute top-2 left-2 z-10 bg-yellow-500 font-bold">
          <Star className="h-3 w-3 mr-1" fill="white" /> Top Rated
        </Badge>
      );
    } else if (index === 1) {
      return (
        <Badge className="absolute top-2 left-2 z-10 bg-slate-400 font-bold">
          🥈 Runner Up
        </Badge>
      );
    } else if (index === 2) {
      return (
        <Badge className="absolute top-2 left-2 z-10 bg-amber-700 font-bold">
          🥉 3rd Place
        </Badge>
      );
    } else if (index < 10) {
      return (
        <Badge className="absolute top-2 left-2 z-10 bg-blue-500 font-bold">
          <Star className="h-3 w-3 mr-1" /> Top 10
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold">Rankings</h2>
      </div>

      <Tabs defaultValue="viewed" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="viewed" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>Most Viewed</span>
          </TabsTrigger>
          
          <TabsTrigger value="rated" className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>Top Rated</span>
          </TabsTrigger>
          
          <TabsTrigger value="growing" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>Fastest Growing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="viewed" className="space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {businesses.map((business, index) => (
              <div key={business.id} className="relative">
                {renderRankBadge(index)}
                <BusinessCard
                  id={business.id}
                  name={business.name}
                  category={business.category}
                  image={business.image_url}
                  location={business.location}
                  rating={4.5} // Default rating for now
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rated" className="space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {businesses.map((business, index) => (
              <div key={business.id} className="relative">
                {renderRankBadge(index)}
                <BusinessCard
                  id={business.id}
                  name={business.name}
                  category={business.category}
                  image={business.image_url}
                  location={business.location}
                  rating={4.5} // Default rating for now
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="growing" className="space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {businesses.map((business, index) => (
              <div key={business.id} className="relative">
                {renderRankBadge(index)}
                <BusinessCard
                  id={business.id}
                  name={business.name}
                  category={business.category}
                  image={business.image_url}
                  location={business.location}
                  rating={4.5} // Default rating for now
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
