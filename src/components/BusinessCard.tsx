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

const checkAvailability = (hours: string): boolean => {
  if (!hours) return false;

  try {
    const hoursData = JSON.parse(hours);
    const now = new Date();
    const dayOfWeek = now.toLocaleString('en-US', { weekday: 'short' }).toLowerCase();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    if (!hoursData[dayOfWeek]?.isOpen) return false;

    const { openTime, closeTime, openPeriod, closePeriod } = hoursData[dayOfWeek];
    
    const parseTime = (time: string, period: 'AM' | 'PM'): number => {
      const [hours, minutes] = time.split(':').map(Number);
      let adjustedHours = hours;
      
      if (period === 'PM' && hours !== 12) {
        adjustedHours += 12;
      } else if (period === 'AM' && hours === 12) {
        adjustedHours = 0;
      }
      
      return adjustedHours * 100 + minutes;
    };

    const openTimeNum = parseTime(openTime, openPeriod);
    const closeTimeNum = parseTime(closeTime, closePeriod);

    return currentTime >= openTimeNum && currentTime <= closeTimeNum;
  } catch (error) {
    console.error('Error parsing business hours:', error);
    return false;
  }
};

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
  const isOpen = checkAvailability(hours);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const businessUrl = `${window.location.origin}/business/${id}`;
    
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Check out ${name} - ${description}`,
        url: businessUrl
      }).catch(() => {
        navigator.clipboard.writeText(businessUrl);
        toast.success("Link copied to clipboard!");
      });
    } else {
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
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer w-full max-w-sm"
      onClick={() => navigate(`/business/${id}`)}
    >
      <img src={image} alt={name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-base truncate max-w-[60%]">{name}</h3>
          <div className="flex gap-1.5">
            {verified && <Badge variant="outline" className="text-xs px-2 py-0.5">Verified</Badge>}
            <Badge 
              variant={isOpen ? "success" : "destructive"}
              className="text-xs px-2 py-0.5 min-w-[70px] text-center whitespace-nowrap"
            >
              {isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="font-medium truncate max-w-[150px]">{category}</span>
            <span>•</span>
            <div className="flex items-center gap-0.5 whitespace-nowrap">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span>{rating}</span>
              <span>({reviews})</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{description}</p>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            <span className="truncate">{hours}</span>
          </div>
        </div>
        
        {(appointment_price || consultation_price) && (
          <div className="space-y-1.5 mb-3">
            {appointment_price && (
              <div className="text-xs">
                <span className="font-semibold">Appointment:</span> ₹{appointment_price}
              </div>
            )}
            {consultation_price && (
              <div className="text-xs">
                <span className="font-semibold">Consultation:</span> ₹{consultation_price}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex gap-2">
            <Button 
              onClick={handleWhatsApp} 
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 h-8 text-xs"
              variant="default"
            >
              <MessageSquare className="h-3 w-3" />
              Message
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="min-w-[80px] flex items-center justify-center gap-1.5 py-1.5 h-8 text-xs"
            >
              <Share2 className="h-3 w-3" />
              Share
            </Button>
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${contact}`;
            }} 
            variant="outline"
            className="w-full flex items-center justify-center gap-1.5 py-1.5 h-8 text-xs"
          >
            <Phone className="h-3 w-3" />
            Call
          </Button>
        </div>
      </div>
    </Card>
  );
};