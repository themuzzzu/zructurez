
import { BusinessCardRating } from "../business/BusinessCardRating";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge"; 
import { Clock } from "lucide-react";

export interface BusinessCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  image?: string;
  image_url?: string; // Added this to support both image and image_url
  rating: number;
  reviews: number;
  location: string;
  contact: string;
  hours: string;
  verified?: boolean;
  appointment_price?: number;
  consultation_price?: number;
  is_open?: boolean;
  wait_time?: string;
  closure_reason?: string;
}

export const BusinessCard = ({
  id,
  name,
  category,
  description,
  image,
  image_url,
  rating,
  reviews,
  location,
  contact,
  hours,
  verified,
  appointment_price,
  consultation_price,
  is_open,
  wait_time,
  closure_reason
}: BusinessCardProps) => {
  
  const getReasonLabel = (reason?: string) => {
    if (!reason) return '';
    switch (reason) {
      case 'food_break': return 'Food Break';
      case 'sick': return 'Sick Leave';
      case 'holiday': return 'Holiday';
      case 'next_day': return 'Available Next Day';
      case 'other': return 'Other';
      default: return reason.replace(/_/g, ' ');
    }
  };
  
  return (
    <div className="border rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={image_url || image} 
          alt={name} 
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-3 text-white">
          <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
          <p className="text-sm text-gray-200 mb-1">{category}</p>
        </div>
        <Badge 
          variant={is_open ? "success" : "destructive"}
          className="absolute top-3 right-3"
        >
          {is_open ? "Open" : "Closed"}
        </Badge>
        {verified && (
          <Badge 
            variant="secondary"
            className="absolute top-3 left-3"
          >
            Verified
          </Badge>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          {!is_open && wait_time && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              <Clock className="h-3 w-3" />
              <span>Available in {wait_time}</span>
              {closure_reason && (
                <span className="text-gray-500">({getReasonLabel(closure_reason)})</span>
              )}
            </div>
          )}
          
          <BusinessCardRating rating={rating} reviews={reviews} businessId={id} />
          <p className="text-sm text-gray-700 mt-2 line-clamp-2">{description}</p>
          <p className="text-sm text-gray-500 mt-1">{location}</p>
        </div>
        <div className="mt-4">
          <Button asChild className="w-full">
            <Link to={`/businesses/${id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
