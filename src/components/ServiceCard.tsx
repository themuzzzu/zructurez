import { Star, MapPin, Clock, Phone, Mail, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";

interface ServiceCardProps {
  name: string;
  provider: string;
  avatar: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  image: string;
  hourlyRate: number;
  location: string;
  availability: string;
}

export const ServiceCard = ({
  name,
  provider,
  avatar,
  category,
  rating,
  reviews,
  description,
  image,
  hourlyRate,
  location,
  availability
}: ServiceCardProps) => {
  const handleContact = () => {
    toast.success("Contact request sent!");
  };

  const handleShare = () => {
    toast.success("Service shared!");
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-up">
      <div className="relative h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
          ${hourlyRate}/hr
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
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
          </div>
          <img
            src={avatar}
            alt={provider}
            className="h-10 w-10 rounded-full"
          />
        </div>

        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {location}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {availability}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={handleContact}
          >
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};