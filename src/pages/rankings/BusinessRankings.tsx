
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getBusinessRankings } from "@/services/rankingService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Building2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BusinessRankings = () => {
  const navigate = useNavigate();
  
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['business-rankings'],
    queryFn: () => getBusinessRankings("views", 20),
  });
  
  const navigateToBusiness = (id: string) => {
    navigate(`/businesses/${id}`);
  };
  
  const getBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/90 text-white";
    if (rank === 2) return "bg-gray-400/90 text-white";
    if (rank === 3) return "bg-amber-600/90 text-white";
    if (rank <= 10) return "bg-blue-500/90 text-white";
    return "bg-primary/90 text-white";
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex p-4">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businesses?.map((business) => (
          <Card 
            key={business.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigateToBusiness(business.id)}
          >
            <CardContent className="p-0">
              <div className="flex p-4">
                <div className="relative">
                  <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                    {business.image_url ? (
                      <img
                        src={business.image_url}
                        alt={business.name || "Business"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        <Building2 className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  {business.rank && (
                    <div className="absolute -top-2 -left-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {business.rank}
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex-1">
                  <h3 className="font-medium line-clamp-1">{business.name || business.title}</h3>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{business.category}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end justify-between">
                  {business.badge && (
                    <Badge className={getBadgeColor(business.rank || 0)}>
                      {business.badge}
                    </Badge>
                  )}
                  <div className="flex items-center mt-2">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium ml-1">
                      {business.views?.toLocaleString() || 0} Views
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
