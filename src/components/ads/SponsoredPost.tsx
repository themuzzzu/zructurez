
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface SponsoredPostProps {
  ad: {
    id: string;
    title: string;
    description: string;
    image_url?: string;
    type: string;
    reference_id: string;
    budget: number;
  };
}

export const SponsoredPost = ({ ad }: SponsoredPostProps) => {
  const navigate = useNavigate();
  
  const handleClick = async () => {
    // Record click
    try {
      const { error } = await supabase.rpc('increment_ad_clicks', { ad_id: ad.id });
      if (error) console.error('Error incrementing clicks:', error);
      
      // Navigate based on type
      switch(ad.type) {
        case 'business':
          navigate(`/business/${ad.reference_id}`);
          break;
        case 'service':
          navigate(`/services/${ad.reference_id}`);
          break;
        case 'product':
          navigate(`/product/${ad.reference_id}`);
          break;
      }
    } catch (err) {
      console.error('Error handling ad click:', err);
    }
  };

  return (
    <Card className="overflow-hidden border-yellow-300 hover:shadow-md transition-all">
      <div className="relative">
        {ad.image_url && (
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={ad.image_url} 
              alt={ad.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-yellow-500/90">
          Sponsored
        </Badge>
      </div>
      
      <CardHeader>
        <CardTitle>{ad.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground">{ad.description}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleClick}>
          View {ad.type}
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
