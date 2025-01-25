import { Star, MapPin, Clock, Phone, Share2, MessageSquare, ChevronDown } from "lucide-react";
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
  wait_time?: string;
  closure_reason?: string;
  is_open?: boolean;
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
  consultation_price,
  wait_time,
  closure_reason,
  is_open = true
}: BusinessCardProps) => {
  const navigate = useNavigate();

  // Determine if the business is actually open based on both manual override and hours
  const isActuallyOpen = is_open && checkAvailability(hours);

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

  const getReasonLabel = (reason?: string) => {
    if (!reason) return '';
    switch (reason) {
      case 'food_break':
        return 'Food Break';
      case 'sick':
        return 'Sick Leave';
      case 'holiday':
        return 'Holiday';
      case 'next_day':
        return 'Available Next Day';
      case 'other':
        return 'Other';
      default:
        return '';
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer w-full max-w-[360px] bg-black/95 text-white"
      onClick={() => navigate(`/business/${id}`)}
    >
      <img src={image} alt={name} className="w-full h-40 object-cover" />
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <h3 className="font-semibold text-xl pr-8">{name}</h3>
            {name.length > 25 && (
              <div className="absolute top-1/2 right-0 -translate-y-1/2 bg-gradient-to-l from-black/95 to-transparent px-2">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-300">{category}</span>
            <div className="flex items-center gap-2">
              <Badge 
                variant={isActuallyOpen ? "success" : "destructive"}
                className="text-xs px-2 py-0.5"
              >
                {isActuallyOpen ? "Open" : "Closed"}
              </Badge>
              {verified && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  Verified
                </Badge>
              )}
            </div>
            {!isActuallyOpen && wait_time && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="h-4 w-4" />
                <span>Available in {wait_time}</span>
                {closure_reason && (
                  <span className="text-gray-400">({getReasonLabel(closure_reason)})</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-yellow-400">
          <Star className="h-4 w-4 fill-current" />
          <span>{rating}</span>
          <span className="text-gray-400">({reviews} reviews)</span>
        </div>

        <div className="relative">
          <p className="text-sm text-gray-300 line-clamp-3 mb-2">{description}</p>
          {description.length > 150 && (
            <div className="absolute bottom-0 right-0 bg-gradient-to-l from-black/95 to-transparent px-2">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm text-gray-300">
            <MapPin className="h-4 w-4 shrink-0 mt-1" />
            <div className="flex-1 relative">
              <span className="inline-block pr-6">{location}</span>
              {location.length > 35 && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-black/95 to-transparent px-2">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-300">
            <Clock className="h-4 w-4 shrink-0 mt-1" />
            <div className="flex-1 relative">
              <span className="inline-block pr-6">{hours}</span>
              {hours.length > 35 && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-black/95 to-transparent px-2">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        {(appointment_price || consultation_price) && (
          <div className="space-y-1 text-sm text-gray-300">
            {appointment_price && (
              <div>
                <span className="font-medium">Appointment:</span> ₹{appointment_price}
              </div>
            )}
            {consultation_price && (
              <div>
                <span className="font-medium">Consultation:</span> ₹{consultation_price}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button 
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700"
            variant="default"
          >
            <MessageSquare className="h-4 w-4" />
            Message
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-gray-700 hover:bg-gray-800"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${contact}`;
            }} 
            variant="outline"
            className="w-full col-span-2 flex items-center justify-center gap-2 border-gray-700 hover:bg-gray-800"
          >
            <Phone className="h-4 w-4" />
            Call
          </Button>
        </div>
      </div>
    </Card>
  );
};