
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BusinessCard } from "@/components/BusinessCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SponsoredBusinessesProps {
  limit?: number;
  showTitle?: boolean;
}

export const SponsoredBusinesses = ({
  limit = 4,
  showTitle = true
}: SponsoredBusinessesProps) => {
  const { data: businesses, isLoading } = useQuery({
    queryKey: ["sponsored-businesses"],
    queryFn: async () => {
      try {
        // In a real app, we would have a sponsored field
        // For now, fetch random businesses as a proxy for sponsored
        const { data, error } = await supabase
          .from("businesses")
          .select("*")
          // In a real app we'd filter by is_sponsored=true
          .limit(limit);

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Error fetching sponsored businesses:", err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });

  if (isLoading) {
    return (
      <Card>
        {showTitle && (
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" /> 
              Sponsored Businesses
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(limit)].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!businesses || businesses.length === 0) {
    return null;
  }

  return (
    <Card>
      {showTitle && (
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" /> 
              Sponsored Businesses
            </CardTitle>
            <Link to="/businesses">
              <Button variant="ghost" size="sm">
                View all
                <ExternalLink className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {businesses.map((business) => (
            <div key={business.id} className="relative">
              <BusinessCard 
                id={business.id}
                name={business.name}
                description={business.description}
                image={business.image_url || ""}
                category={business.category || ""}
                location={business.location || ""}
                rating={4.5} // Default rating
                reviews={10} // Default reviews count
                verified={business.verified || false}
                contact={business.contact || ""}
                hours={business.hours || ""}
              />
              <Badge 
                className="absolute top-2 right-2 bg-yellow-500/90 text-xs"
                variant="secondary"
              >
                Sponsored
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
