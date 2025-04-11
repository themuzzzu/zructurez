
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/productUtils";
import { useNavigate } from "react-router-dom";
import { CheckCircle, MapPin, Clock } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";

interface BusinessCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  image_url?: string; // Added to handle both image and image_url props
  rating?: number;
  reviews?: number;
  location?: string;
  contact?: string;
  hours?: string;
  verified?: boolean;
  appointment_price?: number | null;
  consultation_price?: number | null;
  is_open?: boolean;
  wait_time?: string;
  closure_reason?: string;
  size?: "small" | "medium" | "large";
}

export const BusinessCard = ({
  id,
  name,
  category,
  description,
  image,
  image_url,
  rating = 0,
  reviews = 0,
  location,
  hours,
  verified = false,
  appointment_price,
  consultation_price,
  is_open = true,
  wait_time,
  closure_reason,
  size = "medium"
}: BusinessCardProps) => {
  const navigate = useNavigate();
  const imageSource = image || image_url || "/placeholder.svg";

  const handleClick = () => {
    navigate(`/businesses/${id}`);
  };

  const isSmall = size === "small";
  const imageHeight = isSmall ? "h-24" : "h-36";
  const paddingSize = isSmall ? "p-2" : "p-3";

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col cursor-pointer"
      onClick={handleClick}
    >
      <div className={`relative ${imageHeight} overflow-hidden`}>
        <img 
          src={imageSource} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
        {verified && (
          <Badge 
            variant="secondary" 
            className="absolute top-1.5 right-1.5 bg-green-50 text-green-700 text-[9px] h-5 px-1.5 flex items-center gap-1"
          >
            <CheckCircle className="h-2.5 w-2.5" />
            Verified
          </Badge>
        )}
        {!is_open && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-xs">
              {closure_reason || "Closed"}
            </Badge>
          </div>
        )}
      </div>
      
      <div className={`${paddingSize} flex-1 space-y-1.5`}>
        <div className="flex justify-between items-start">
          <h3 className={`font-medium line-clamp-1 ${isSmall ? 'text-xs' : 'text-sm'}`}>{name}</h3>
        </div>
        
        <Badge 
          variant="outline" 
          className={`${isSmall ? 'text-[9px]' : 'text-xs'} bg-transparent`}
        >
          {category}
        </Badge>
        
        {!isSmall && (
          <p className="text-[11px] text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="flex items-center gap-1">
          <StarRating 
            rating={rating} 
            size={isSmall ? "extraSmall" : "small"} 
          />
          <span className={`text-muted-foreground ${isSmall ? 'text-[9px]' : 'text-xs'}`}>
            ({reviews})
          </span>
        </div>
        
        {(location && !isSmall) && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground truncate">
              {location}
            </span>
          </div>
        )}
        
        {(appointment_price || consultation_price) && (
          <div className="text-[11px] font-medium">
            {appointment_price && (
              <div>Appointment: {formatPrice(appointment_price)}</div>
            )}
            {consultation_price && (
              <div>Consultation: {formatPrice(consultation_price)}</div>
            )}
          </div>
        )}
        
        {(wait_time && is_open) && (
          <div className="flex items-center gap-1 text-amber-600">
            <Clock className="h-3 w-3" />
            <span className="text-[10px]">{wait_time} wait</span>
          </div>
        )}
      </div>
    </Card>
  );
};
