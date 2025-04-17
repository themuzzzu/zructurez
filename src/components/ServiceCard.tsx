
import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Heart, Share2, MessageSquare, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { shareBusinessProfile, openWhatsAppChat } from "@/utils/businessCardUtils";

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  providerName: string;
  providerId: string;
  contact_info?: string; // Added contact_info property
}

export const ServiceCard = ({
  id,
  name,
  description,
  image,
  price,
  providerName,
  providerId,
  contact_info
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
    shareBusinessProfile(e, name, description, id);
  };
  
  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (contact_info) {
      openWhatsAppChat(e, name, contact_info);
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

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image || '/placeholder-image.jpg'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardContent className="flex-1 p-4 space-y-2 cursor-pointer" onClick={handleClick}>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold line-clamp-1">{name}</h3>
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
          <span className="font-bold">{price}</span>
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
