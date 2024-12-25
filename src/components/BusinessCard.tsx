import { Star, MapPin, Clock, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

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
  serviceName: string;
  cost: number;
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
  serviceName,
  cost
}: BusinessCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/business/${id}`)}
    >
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{category}</span>
          <span>•</span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1">{rating}</span>
            <span className="ml-1">({reviews})</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {location}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          {hours}
        </div>
        {verified && <Badge variant="outline">Verified</Badge>}
        <div className="flex items-center justify-between mt-4">
          <span className="font-semibold">₹{cost}</span>
          <Button onClick={() => window.location.href = `tel:${contact}`} className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            Contact
          </Button>
        </div>
      </div>
    </Card>
  );
};
