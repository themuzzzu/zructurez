import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Phone, Mail, Building } from "lucide-react";

interface BusinessProfileProps {
  description: string;
  location?: string;
  hours?: string;
  contact?: string;
  verified?: boolean;
  image_url?: string;
}

export const BusinessProfile = ({
  description,
  location,
  hours,
  contact,
  verified,
  image_url,
}: BusinessProfileProps) => {
  return (
    <div className="space-y-6">
      {image_url && (
        <div className="relative h-[300px] w-full overflow-hidden rounded-lg">
          <img
            src={image_url}
            alt="Business cover"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">About</h2>
          {verified && (
            <Badge variant="outline" className="ml-2">
              Verified
            </Badge>
          )}
        </div>
        
        <p className="text-muted-foreground">{description}</p>

        <div className="grid gap-4 pt-4">
          {location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          )}
          
          {hours && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{hours}</span>
            </div>
          )}
          
          {contact && (
            <div className="flex items-center gap-2 text-muted-foreground">
              {contact.includes('@') ? (
                <Mail className="h-4 w-4" />
              ) : (
                <Phone className="h-4 w-4" />
              )}
              <span>{contact}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};