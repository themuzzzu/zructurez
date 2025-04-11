
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/productUtils";
import type { Service } from "@/types/service";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
    image_url?: string;
    category?: string;
    contact_info?: string;
  };
  compact?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, compact = false }) => {
  const navigate = useNavigate();
  const imageUrl = service.imageUrl || service.image_url;
  
  const imageHeight = compact ? "h-24" : "h-32";
  const textSize = compact ? "text-xs" : "text-sm";
  const padding = compact ? "p-2" : "p-3";
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className={`${imageHeight} overflow-hidden`}>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={service.title}
          className="object-cover w-full h-full"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      </div>
      <div className={`${padding} space-y-1.5 flex-1`}>
        <div className="flex justify-between items-start">
          <h3 className={`font-medium line-clamp-1 ${textSize}`}>{service.title}</h3>
          {service.category && (
            <Badge variant="outline" className="text-[9px] h-4 px-1">
              {service.category}
            </Badge>
          )}
        </div>
        {!compact && service.description && (
          <p className="text-[11px] text-muted-foreground line-clamp-2">
            {service.description}
          </p>
        )}
        <div className="font-medium text-xs">{formatPrice(service.price)}</div>
      </div>
      <div className={`${padding} pt-0 mt-auto`}>
        <div className="grid grid-cols-3 gap-1.5">
          <Button 
            className="w-full text-[10px] h-7" 
            size="sm"
            onClick={() => navigate(`/services/${service.id}/book`)}
          >
            <Calendar className="h-3 w-3 mr-0.5" />
            Book
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-[10px] h-7"
            onClick={() => {
              if (service.contact_info) {
                window.location.href = `tel:${service.contact_info}`;
              } else {
                toast.error("Contact information not available");
                navigate(`/services/${service.id}`);
              }
            }}
          >
            <Phone className="h-3 w-3 mr-0.5" />
            Call
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-[10px] h-7"
            onClick={() => {
              if (service.contact_info) {
                window.open(`https://wa.me/${service.contact_info.replace(/\D/g, '')}?text=Hi, I'm interested in your service: ${service.title}`, '_blank');
              } else {
                toast.error("Contact information not available");
                navigate(`/services/${service.id}`);
              }
            }}
          >
            <MessageSquare className="h-3 w-3 mr-0.5" />
            Chat
          </Button>
        </div>
      </div>
    </Card>
  );
};
