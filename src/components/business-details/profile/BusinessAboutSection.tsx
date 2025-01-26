import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Mail, Globe, Calendar, Star } from "lucide-react";
import { BusinessCommentSection } from "../comments/BusinessCommentSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BusinessAboutSectionProps {
  businessId: string;
  description: string;
  location?: string;
  hours?: string;
  contact?: string;
  website?: string;
  verified?: boolean;
  appointment_price?: number;
  onBookAppointment: () => void;
}

export const BusinessAboutSection = ({
  businessId,
  description,
  location,
  hours,
  contact,
  website,
  verified,
  appointment_price,
  onBookAppointment,
}: BusinessAboutSectionProps) => {
  // Fetch average rating
  const { data: ratingData } = useQuery({
    queryKey: ['business-rating', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_comments')
        .select('rating')
        .eq('business_id', businessId)
        .not('rating', 'is', null);

      if (error) throw error;
      
      if (!data || data.length === 0) return { average: 0, count: 0 };
      
      const ratings = data.map(r => r.rating).filter(Boolean);
      const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      
      return {
        average: Number(average.toFixed(1)),
        count: ratings.length
      };
    }
  });

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">About</h2>
          {verified && (
            <Badge variant="outline">
              Verified
            </Badge>
          )}
        </div>
        {ratingData && ratingData.count > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(ratingData.average)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({ratingData.average} • {ratingData.count} reviews)
            </span>
          </div>
        )}
      </div>
      
      <p className="text-muted-foreground break-words">{description}</p>

      <div className="grid gap-4">
        {location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="break-words">{location}</span>
          </div>
        )}
        
        {hours && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{hours}</span>
          </div>
        )}
        
        {contact && (
          <div className="flex items-center gap-2 text-muted-foreground">
            {contact.includes('@') ? (
              <Mail className="h-4 w-4 shrink-0" />
            ) : (
              <Phone className="h-4 w-4 shrink-0" />
            )}
            <span>{contact}</span>
          </div>
        )}

        {website && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-4 w-4 shrink-0" />
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors break-words"
            >
              {website}
            </a>
          </div>
        )}
      </div>

      {appointment_price && (
        <div className="pt-4">
          <Button
            onClick={onBookAppointment}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Book Appointment
          </Button>
        </div>
      )}
    </Card>
  );
};