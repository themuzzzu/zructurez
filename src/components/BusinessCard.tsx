
import { BusinessCardRating } from "./business/BusinessCardRating";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge"; 
import { Clock } from "lucide-react";

interface BusinessCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  contact: string;
  hours: string;
  verified: boolean;
  appointment_price?: number;
  consultation_price?: number;
  is_open: boolean;
  wait_time?: string;
  closure_reason?: string;
}

export const BusinessCard = ({
  id,
  name,
  category,
  description,
  image,
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
    <div className="border rounded-lg shadow-md overflow-hidden">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold">{name}</h3>
          <Badge variant={is_open ? "success" : "destructive"}>
            {is_open ? "Open" : "Closed"}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mb-2">{category}</p>
        
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
        <p className="text-sm text-gray-500">{location}</p>
        {verified && <span className="text-xs text-green-500 inline-block mt-1">Verified</span>}
        <div className="mt-4">
          <Button asChild>
            <Link to={`/businesses/${id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
