import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Mail, Globe, Calendar } from "lucide-react";
import { CommentSection } from "@/components/CommentSection";

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
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">About</h2>
        {verified && (
          <Badge variant="outline" className="ml-2">
            Verified
          </Badge>
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

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Comments & Reviews</h3>
        <CommentSection postId={businessId} />
      </div>
    </Card>
  );
};