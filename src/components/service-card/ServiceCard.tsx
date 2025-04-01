
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, MapPin, Clock, Star, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { trackServiceView } from "@/services/serviceService";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  price: number;
  providerName?: string;
  providerId: string;
  category?: string;
  location?: string;
  views?: number;
  rating?: number;
  sponsored?: boolean;
}

export const ServiceCard = ({
  id,
  title,
  description,
  image_url,
  price,
  providerName,
  providerId,
  category,
  location,
  views,
  rating = 4.5,
  sponsored = false
}: ServiceCardProps) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const handleClick = () => {
    trackServiceView(id); // Track the view
    navigate(`/services/${id}`);
  };

  const handleProviderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/businesses/${providerId}`);
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={handleClick}>
        <img 
          src={image_url || '/placeholder-service.jpg'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {sponsored && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-blue-500/80 text-white hover:bg-blue-600 border-none"
          >
            Sponsored
          </Badge>
        )}
      </div>
      
      <CardContent className="flex-1 p-4 space-y-2 cursor-pointer" onClick={handleClick}>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold line-clamp-1">{title}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={toggleLike}
          >
            <Heart 
              className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} 
            />
          </Button>
        </div>
        
        {providerName && (
          <Badge 
            variant="outline" 
            className="text-xs bg-transparent cursor-pointer hover:bg-secondary"
            onClick={handleProviderClick}
          >
            {providerName}
          </Badge>
        )}
        
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-2">
          <span className="font-bold">₹{price.toLocaleString()}</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {location}
            </span>
          )}
          {category && (
            <span className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              {category}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500" />
            {rating}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full gap-2" 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/services/${id}/book`);
          }}
        >
          <Calendar className="h-4 w-4" />
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};
