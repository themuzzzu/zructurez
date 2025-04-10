
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
      <div className="h-40 overflow-hidden">
        <img
          src={service.imageUrl || service.image_url || "/placeholder.svg"}
          alt={service.title}
          className="object-cover w-full h-full"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      </div>
      <div className="p-4 space-y-2 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold line-clamp-1">{service.title}</h3>
          {service.category && (
            <Badge variant="outline" className="text-xs">
              {service.category}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </p>
        <div className="font-semibold">₹{service.price}</div>
      </div>
      <div className="p-4 pt-0 mt-auto">
        <div className="grid grid-cols-3 gap-2">
          <Button 
            className="w-full" 
            size="sm"
            onClick={() => navigate(`/services/${service.id}/book`)}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Book
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              if (service.contact_info) {
                window.location.href = `tel:${service.contact_info}`;
              } else {
                toast.error("Contact information not available");
                navigate(`/services/${service.id}`);
              }
            }}
          >
            <Phone className="h-4 w-4 mr-1" />
            Call
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              if (service.contact_info) {
                window.open(`https://wa.me/${service.contact_info.replace(/\D/g, '')}?text=Hi, I'm interested in your service: ${service.title}`, '_blank');
              } else {
                toast.error("Contact information not available");
                navigate(`/services/${service.id}`);
              }
            }}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Chat
          </Button>
        </div>
      </div>
    </Card>
  );
};
