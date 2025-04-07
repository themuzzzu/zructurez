
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BusinessCard } from "@/components/BusinessCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface SuggestedBusinessesProps {
  limit?: number;
  showTitle?: boolean;
}

export const SuggestedBusinesses = ({
  limit = 4,
  showTitle = true
}: SuggestedBusinessesProps) => {
  const { data: businesses, isLoading } = useQuery({
    queryKey: ["suggested-businesses"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("businesses")
          .select("*")
          // In a real app, this would use user preferences or history
          // For now, we'll just get random businesses
          .limit(limit);

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Error fetching suggested businesses:", err);
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
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Suggested Businesses</span>
              <Button variant="ghost" size="sm">
                View all
                <ExternalLink className="ml-1 h-4 w-4" />
              </Button>
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
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Suggested Businesses</CardTitle>
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
            <BusinessCard 
              key={business.id}
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
