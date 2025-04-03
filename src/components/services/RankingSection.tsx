
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Award, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getServiceRankings } from "@/services/rankingService";
import { Spinner } from "@/components/common/Spinner";
import { formatPrice } from "@/utils/productUtils";

export const RankingSection = () => {
  const navigate = useNavigate();
  const { data: services, isLoading } = useQuery({
    queryKey: ["serviceRankings"],
    queryFn: () => getServiceRankings("views", 5),
  });

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Top Ranked Services
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Top Ranked Services
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/rankings")}
          className="flex items-center gap-1"
        >
          View All
          <ExternalLink className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div 
              key={service.id}
              className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:bg-muted/30 p-2 rounded-md transition-colors"
              onClick={() => navigate(`/services/${service.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold">
                  {service.rank}
                </div>
                <div 
                  className="h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0"
                  style={{
                    backgroundImage: service.image_url ? `url(${service.image_url})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                />
                <div>
                  <div className="font-medium">{service.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {service.price !== undefined ? formatPrice(service.price) : ""}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{service.views?.toLocaleString()}</span>
                </Badge>
                <Badge className="bg-amber-500">{service.badge}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
