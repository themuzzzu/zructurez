
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { incrementAdClick } from "@/services/adService";
import { useNavigate } from "react-router-dom";
import { Advertisement } from "@/services/adService";

interface SponsoredPostProps {
  ad: Advertisement;
}

export const SponsoredPost = ({ ad }: SponsoredPostProps) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    // Record ad click
    await incrementAdClick(ad.id);
    
    // Navigate based on ad type
    if (ad.reference_id) {
      if (ad.type === "sponsored_product") {
        navigate(`/products/${ad.reference_id}`);
      } else if (ad.type === "sponsored_business") {
        navigate(`/business/${ad.reference_id}`);
      } else if (ad.type === "sponsored_service" || ad.type === "recommended_service") {
        navigate(`/services/${ad.reference_id}`);
      } else {
        // Default navigation or external link
        navigate(`/${ad.location}`);
      }
    }
  };

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        {ad.image_url && (
          <img 
            src={ad.image_url}
            alt={ad.title}
            className="w-full h-48 object-cover"
          />
        )}
        <Badge variant="secondary" className="absolute top-2 right-2">
          Sponsored
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{ad.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {ad.description}
        </p>
        <Button onClick={handleClick} className="w-full" variant="outline">
          Learn More
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default SponsoredPost;
