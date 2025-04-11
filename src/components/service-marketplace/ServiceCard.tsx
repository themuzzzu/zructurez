
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { Service } from "@/types/service";

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-32 overflow-hidden">
        <img
          src={service.imageUrl || service.image_url || "/placeholder.svg"}
          alt={service.title}
          className="object-cover w-full h-full"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      </div>
      <div className="p-3 space-y-1.5 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm line-clamp-1">{service.title}</h3>
          {service.category && (
            <Badge variant="outline" className="text-[9px] h-4 px-1">
              {service.category}
            </Badge>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground line-clamp-2">
          {service.description}
        </p>
        <div className="font-medium text-xs">₹{service.price.toLocaleString('en-IN')}</div>
      </div>
      <div className="p-3 pt-0 mt-auto">
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
