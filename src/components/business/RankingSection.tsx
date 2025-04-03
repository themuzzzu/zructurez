
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Award, Star, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBusinessRankings } from "@/services/rankingService";
import { Spinner } from "@/components/common/Spinner";

export const RankingSection = () => {
  const navigate = useNavigate();
  const { data: businesses, isLoading } = useQuery({
    queryKey: ["businessRankings"],
    queryFn: () => getBusinessRankings("views", 5),
  });

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Top Ranked Businesses
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  if (!businesses || businesses.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Top Ranked Businesses
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
          {businesses.map((business) => (
            <div 
              key={business.id}
              className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:bg-muted/30 p-2 rounded-md transition-colors"
              onClick={() => navigate(`/businesses/${business.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold">
                  {business.rank}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={business.image_url} alt={business.name} />
                  <AvatarFallback>{business.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{business.name}</div>
                  <div className="text-xs text-muted-foreground">{business.category}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{business.views?.toLocaleString()}</span>
                </Badge>
                <Badge className="bg-amber-500">{business.badge}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
