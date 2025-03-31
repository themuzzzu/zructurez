
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

export interface ServiceCardProps {
  id: string;
  title?: string;
  name?: string;
  description: string;
  image?: string;
  image_url?: string;
  price?: number;
  hourlyRate?: number;
  providerId?: string;
  providerName?: string;
  provider?: string;
  avatar?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  views?: number;
  location?: string;
  tags?: string[];
  isFeatured?: boolean;
  isRecommended?: boolean;
  isPopular?: boolean;
}

export const ServiceCard = ({
  id,
  title,
  name,
  description,
  image,
  image_url,
  price,
  hourlyRate,
  providerId,
  providerName,
  provider,
  avatar,
  category,
  rating = 0,
  reviews = 0,
  location,
  tags,
  isFeatured,
  isRecommended,
  isPopular,
}: ServiceCardProps) => {
  const displayName = title || name || "";
  const displayImage = image || image_url || "/placeholder.jpg";
  const displayPrice = price || hourlyRate || 0;
  const displayProvider = providerName || provider || "";

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border">
      <div className="relative">
        <img 
          src={displayImage} 
          alt={displayName} 
          className="w-full h-48 object-cover" 
        />
        {isFeatured && (
          <Badge className="absolute top-2 right-2 bg-yellow-500">Featured</Badge>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg truncate">{displayName}</h3>
          <Badge variant="outline">
            ${displayPrice}
            {hourlyRate ? "/hr" : ""}
          </Badge>
        </div>
        
        <p className="text-muted-foreground text-sm my-2 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>
          
          <Link to={`/services/${id}`}>
            <Button size="sm" variant="outline">View Details</Button>
          </Link>
        </div>
        
        {displayProvider && (
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground flex items-center">
            By {displayProvider}
          </div>
        )}
      </div>
    </Card>
  );
};
