import { Star, MapPin, Clock, Phone, Share2, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  appointment_price?: number;
  consultation_price?: number;
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
  consultation_price
}: BusinessCardProps) => {
  const navigate = useNavigate();

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const businessUrl = `${window.location.origin}/business/${id}`;
    
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Check out ${name} - ${description}`,
        url: businessUrl
      }).catch(() => {
        // Fallback if share fails
        navigator.clipboard.writeText(businessUrl);
        toast.success("Link copied to clipboard!");
      });
    } else {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(businessUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const greeting = `Hi! I found your business profile for ${name}. I'm interested in learning more about your services.`;
    const whatsappUrl = `https://wa.me/${contact.replace(/\D/g, '')}?text=${encodeURIComponent(greeting)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/business/${id}`)}
    >
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{name}</h3>
          {verified && <Badge variant="outline">Verified</Badge>}
        </div>
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
        
        <div className="flex flex-col gap-2 mt-4">
          {appointment_price && (
            <div className="text-sm">
              <span className="font-semibold">Appointment:</span> ₹{appointment_price}
            </div>
          )}
          {consultation_price && (
            <div className="text-sm">
              <span className="font-semibold">Consultation:</span> ₹{consultation_price}
            </div>
          )}
          <div className="flex gap-2">
            <Button 
              onClick={handleWhatsApp} 
              className="flex-1 flex items-center gap-1"
              variant="default"
            >
              <MessageSquare className="h-4 w-4" />
              Message
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${contact}`;
            }} 
            variant="outline"
            className="flex items-center gap-1"
          >
            <Phone className="h-4 w-4" />
            Call
          </Button>
        </div>
      </div>
    </Card>
  );
};