
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Sparkles, Award, TrendingUp, BarChart } from "lucide-react";

interface AdRecommendation {
  id: string;
  product_id?: string;
  product_title?: string;
  ad_type: string;
  placement: string;
  recommended_bid: number;
  ctr_prediction: number;
  conversion_prediction: number;
  reasoning: string;
}

export function AIAdRecommendations() {
  const [isApplying, setIsApplying] = useState<string | null>(null);
  
  // Fetch AI recommendations
  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ['ai-ad-recommendations'],
    queryFn: async () => {
      // In a real implementation, this would fetch from the database
      // For now, we'll return mock data
      return [
        {
          id: "rec-1",
          product_id: "prod-1",
          product_title: "Wireless Headphones",
          ad_type: "product",
          placement: "Homepage - Featured Products",
          recommended_bid: 120,
          ctr_prediction: 4.2,
          conversion_prediction: 1.8,
          reasoning: "High performing product with good margin. Recent search trends show increased interest in audio products."
        },
        {
          id: "rec-2",
          product_id: "prod-2",
          product_title: "Smart Watch",
          ad_type: "recommendation",
          placement: "Product Detail - Recommended",
          recommended_bid: 85,
          ctr_prediction: 3.7,
          conversion_prediction: 1.5,
          reasoning: "Complements popular products. Users who view phones often click on smartwatch ads."
        },
        {
          id: "rec-3",
          product_id: "prod-3",
          product_title: "Organic Cotton T-Shirt",
          ad_type: "banner",
          placement: "Marketplace - Top Banner",
          recommended_bid: 150,
          ctr_prediction: 2.9,
          conversion_prediction: 0.9,
          reasoning: "Seasonal trend indicates rising interest in sustainable clothing. Banner ad will increase brand visibility."
        }
      ] as AdRecommendation[];
    },
  });
  
  // Apply recommendation
  const applyRecommendation = async (recommendation: AdRecommendation) => {
    setIsApplying(recommendation.id);
    
    try {
      // In a real implementation, this would create/update an ad based on the recommendation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Recommendation applied successfully");
    } catch (error) {
      console.error('Error applying recommendation:', error);
      toast.error("Failed to apply recommendation");
    } finally {
      setIsApplying(null);
    }
  };
  
  // Regenerate recommendations
  const regenerateRecommendations = () => {
    toast.info("Generating new recommendations...");
    // In a real implementation, this would trigger a new AI analysis
  };
  
  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "product":
        return <TrendingUp className="h-4 w-4" />;
      case "recommendation":
        return <Sparkles className="h-4 w-4" />;
      case "banner":
        return <BarChart className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            <CardTitle>AI Ad Recommendations</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={regenerateRecommendations}>
            Regenerate
          </Button>
        </div>
        <CardDescription>
          Smart recommendations to optimize your ad performance and ROI
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Analyzing your products and market trends...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-8">
            <p>No recommendations available at this time.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={regenerateRecommendations}
            >
              Generate Recommendations
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <Card key={recommendation.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="p-4 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getTypeIcon(recommendation.ad_type)}
                        {recommendation.ad_type.charAt(0).toUpperCase() + recommendation.ad_type.slice(1)}
                      </Badge>
                      <Badge variant="secondary">
                        {recommendation.placement}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium">{recommendation.product_title}</h3>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Rec. Bid:</span>{" "}
                        <span className="font-medium">₹{recommendation.recommended_bid}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pred. CTR:</span>{" "}
                        <span className="font-medium">{recommendation.ctr_prediction}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pred. Conv:</span>{" "}
                        <span className="font-medium">{recommendation.conversion_prediction}%</span>
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        {recommendation.reasoning}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 flex flex-col justify-center items-center md:w-48">
                    <Button 
                      className="w-full"
                      onClick={() => applyRecommendation(recommendation)}
                      disabled={isApplying === recommendation.id}
                    >
                      {isApplying === recommendation.id ? "Applying..." : "Apply"}
                    </Button>
                    <Button 
                      variant="link" 
                      className="mt-2"
                      onClick={() => toast.info("Viewing details...")}
                    >
                      View details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
