
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BusinessCard } from "@/components/BusinessCard";
import { Sparkles } from "lucide-react";

interface LocalBusiness {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  location: string;
  verified: boolean;
}

interface LocalBusinessSpotlightProps {
  businessType?: string;
}

export const LocalBusinessSpotlight = ({ businessType }: LocalBusinessSpotlightProps) => {
  const [currentBusinessIndex, setCurrentBusinessIndex] = useState(0);
  
  // Define the query function with explicit return type
  const fetchLocalBusinesses = async (): Promise<LocalBusiness[]> => {
    try {
      let query = supabase
        .from("businesses")
        .select("*");
        
      // Filter by type if provided
      if (businessType) {
        query = query.eq("type", businessType);
      }
      
      const { data, error } = await query.limit(5);
      
      if (error) throw error;
      return data as LocalBusiness[];
    } catch (err) {
      console.error("Error fetching local businesses:", err);
      return [];
    }
  };
  
  // Fix type instantiation issue by properly typing the query
  const { data: localBusinesses, isLoading } = useQuery({
    queryKey: ["local-businesses", businessType],
    queryFn: fetchLocalBusinesses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Auto-rotate businesses
  useEffect(() => {
    if (!localBusinesses || localBusinesses.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentBusinessIndex((prevIndex) => 
        (prevIndex + 1) % localBusinesses.length
      );
    }, 10000); // Change every 10 seconds
    
    return () => clearInterval(interval);
  }, [localBusinesses]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span>Local Business Spotlight</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <Skeleton className="h-48 w-full" />
            <div className="space-y-2 mt-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!localBusinesses || localBusinesses.length === 0) {
    return null;
  }
  
  const currentBusiness = localBusinesses[currentBusinessIndex];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <span>Local Business Spotlight</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BusinessCard
          id={currentBusiness.id}
          name={currentBusiness.name}
          description={currentBusiness.description}
          image={currentBusiness.image_url}
          category={currentBusiness.category}
          location={currentBusiness.location}
          rating={4.5} // Default rating
          reviews={10} // Default reviews count
          verified={currentBusiness.verified || false}
          contact=""
          hours=""
        />
      </CardContent>
    </Card>
  );
};
