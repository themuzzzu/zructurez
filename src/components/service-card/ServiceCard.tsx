
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, Share2, MessageSquare, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { shareBusinessProfile, openWhatsAppChat } from "@/utils/businessCardUtils";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  price: number;
  providerId: string;
  providerName: string;
  sponsored?: boolean;
  contact_info?: string;
  category?: string;
  location?: string;
  // We don't need views in the interface if we're not using it
}

export const ServiceCard = ({
  id,
  title,
  description,
  image_url,
  price,
  providerId,
  providerName,
  contact_info,
  sponsored = false,
  category,
  location
}: ServiceCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/services/${id}`);
  };

  const handleProviderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/businesses/${providerId}`);
  };
  
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    shareBusinessProfile(e, title, description, id);
  };
  
  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (contact_info) {
      openWhatsAppChat(e, title, contact_info);
    } else {
      toast.error("Contact information not available");
      navigate(`/services/${id}`);
    }
  };
  
  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (contact_info) {
      window.location.href = `tel:${contact_info}`;
    } else {
      toast.error("Contact information not available");
      navigate(`/services/${id}`);
    }
  };

  // Format price for display - fixed the "toString" issue
  const formattedPrice = typeof price === 'number' 
    ? `$${price.toFixed(2)}` 
    : '$0.00';

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        {sponsored && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
            Sponsored
          </Badge>
        )}
        <img 
          src={image_url || '/placeholder.svg'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </div>
      
      <CardContent className="flex-1 p-4 space-y-2 cursor-pointer" onClick={handleClick}>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold line-clamp-1">{title}</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        
        <Badge 
          variant="outline" 
          className="text-xs bg-transparent cursor-pointer hover:bg-secondary"
          onClick={handleProviderClick}
        >
          {providerName}
        </Badge>
        
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-2">
          <span className="font-bold">{formattedPrice}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button 
            className="w-full gap-1" 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/services/${id}/book`);
            }}
          >
            <Calendar className="h-4 w-4" />
            Book
          </Button>
          <Button 
            variant="outline"
            className="w-full gap-1" 
            onClick={handleMessageClick}
          >
            <MessageSquare className="h-4 w-4" />
            Chat
          </Button>
          <Button 
            variant="outline"
            className="w-full gap-1" 
            onClick={handleShareClick}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button 
            variant="outline"
            className="w-full gap-1" 
            onClick={handleCallClick}
          >
            <Phone className="h-4 w-4" />
            Call
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
