
import { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { trackServiceView, trackContactClick } from "@/services/serviceService";
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  price: number;
  providerName?: string;
  providerId?: string;
  category?: string;
  location?: string;
  rating?: number;
  views?: number;
  sponsored?: boolean;
}

export function ServiceCard({
  id,
  title,
  description,
  image_url,
  price,
  providerName,
  providerId,
  category,
  location,
  rating = 4.5,
  views,
  sponsored,
}: ServiceCardProps) {
  // Track view when card is rendered
  useEffect(() => {
    trackServiceView(id);
  }, [id]);

  // Handle contact click
  const handleContactClick = () => {
    trackContactClick(id);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/services/${id}`} className="block">
        <div className="relative">
          {image_url ? (
            <img 
              src={image_url} 
              alt={title} 
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholders/service-placeholder.jpg";
              }}
            />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          
          {category && (
            <span className="absolute top-2 right-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded">
              {category}
            </span>
          )}

          {sponsored && (
            <span className="absolute top-2 left-2 bg-yellow-500/80 text-white text-xs px-2 py-1 rounded">
              Sponsored
            </span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium mb-1 line-clamp-1">{title}</h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-semibold text-primary">₹{price}</span>
              {location && (
                <span className="text-xs text-muted-foreground ml-2">
                  {location}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {views !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {views} views
                </span>
              )}
              
              {rating && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-yellow-500">★</span>
                  <span>{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 border-t mt-2 pt-3">
        <div className="flex items-center justify-between">
          {providerName && (
            <span className="text-xs text-muted-foreground">
              By {providerName}
            </span>
          )}
          
          <Button 
            size="sm" 
            onClick={handleContactClick}
            className="gap-1"
          >
            <Phone className="h-3 w-3" />
            Contact
          </Button>
        </div>
      </div>
    </Card>
  );
}
