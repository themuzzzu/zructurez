
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";

interface Service {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  image_url?: string;
  price?: number;
  rating?: number;
  location?: string;
  is_available?: boolean;
  created_at: string;
  updated_at: string;
}

interface ServiceCardProps {
  service: Service;
  layout?: string;
}

export const ServiceCard = ({ service, layout = "grid3x3" }: ServiceCardProps) => {
  const isListLayout = layout === "list";

  return (
    <Card className={`shadow-md hover:shadow-lg transition-shadow ${isListLayout ? 'flex' : ''}`}>
      <div className={`${isListLayout ? 'w-1/3' : 'w-full'}`}>
        <img
          src={service.image_url || "/placeholder.svg"}
          alt={service.title}
          className={`object-cover rounded-t-md ${isListLayout ? 'h-full rounded-l-md rounded-t-none' : 'w-full h-40'}`}
        />
      </div>
      <CardContent className={`p-4 ${isListLayout ? 'flex-1' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{service.title}</h3>
          {service.category && (
            <Badge variant="secondary">{service.category}</Badge>
          )}
        </div>
        
        {service.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {service.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {service.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                <span className="text-sm text-gray-500">{service.location}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {service.rating && (
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">{service.rating}</span>
              </div>
            )}
            {service.price && (
              <span className="text-lg font-bold text-primary">₹{service.price}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
