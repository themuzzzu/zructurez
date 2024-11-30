import { Star, MapPin, Clock, Phone, Shield, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface BusinessCardProps {
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
}

export const BusinessCard = ({
  name,
  category,
  description,
  image,
  rating,
  reviews,
  location,
  contact,
  hours,
  verified
}: BusinessCardProps) => {
  const handleContact = () => {
    toast.success("Contact information copied to clipboard!");
    navigator.clipboard.writeText(contact);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-up">
      <div className="relative h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge variant={verified ? "default" : "secondary"} className="gap-1">
            <Shield className="h-3 w-3" />
            {verified ? "Verified" : "Unverified"}
          </Badge>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{name}</h3>
            <Badge variant="outline">{category}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span>{rating}</span>
            <span>({reviews} reviews)</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {location}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {hours}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 gap-2"
            onClick={handleContact}
          >
            <Phone className="h-4 w-4" />
            Contact
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(location)}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};