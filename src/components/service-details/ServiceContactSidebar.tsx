
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PhoneCall, MessageCircle, DollarSign } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface ServiceContactSidebarProps {
  price: number;
  contactInfo?: string;
  providerName?: string;
  providerAvatar?: string;
  userId: string;
  onBookAppointment: () => void;
  onContactClick?: () => void;
}

export const ServiceContactSidebar = ({ 
  price, 
  contactInfo, 
  providerName, 
  providerAvatar,
  userId,
  onBookAppointment,
  onContactClick
}: ServiceContactSidebarProps) => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick();
    }
    if (userId) {
      navigate(`/messages?user=${userId}`);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={providerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`} />
              <AvatarFallback>{providerName?.charAt(0) || "S"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{providerName || "Service Provider"}</h3>
              <p className="text-sm text-muted-foreground">Service Provider</p>
            </div>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded-md">
            <span className="mr-1">$</span>
            <span className="font-semibold">{price}</span>
            <span className="text-sm">/hr</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Contact Information</h4>
          <p className="text-sm text-muted-foreground">{contactInfo || "Contact the provider for more information"}</p>
        </div>
        
        <div className="space-y-2">
          <Button className="w-full" onClick={onBookAppointment}>
            <DollarSign className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
          
          <Button variant="outline" className="w-full" onClick={handleContactClick}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Message Provider
          </Button>
          
          <Button variant="ghost" className="w-full" onClick={handleContactClick}>
            <PhoneCall className="mr-2 h-4 w-4" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
