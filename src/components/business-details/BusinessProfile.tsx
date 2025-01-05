import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Phone, Mail, Building, Users } from "lucide-react";
import { BusinessOwnerCard } from "./profile/BusinessOwnerCard";
import { BusinessStaffCard } from "./profile/BusinessStaffCard";

interface BusinessProfileProps {
  description: string;
  location?: string;
  hours?: string;
  contact?: string;
  verified?: boolean;
  image_url?: string;
  bio?: string;
  owners?: { 
    name: string; 
    role: string; 
    position: string; 
    experience?: string;
    image_url?: string | null;
  }[];
  staff_details?: { 
    name: string; 
    position: string; 
    experience?: string;
    image_url?: string | null;
  }[];
}

export const BusinessProfile = ({
  description,
  location,
  hours,
  contact,
  verified,
  image_url,
  bio,
  owners,
  staff_details,
}: BusinessProfileProps) => {
  return (
    <div className="space-y-6">
      {/* Business Image */}
      {image_url && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <img
            src={image_url}
            alt="Business"
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {/* About Section */}
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

        <div className="grid gap-4">
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

      {/* Bio Section */}
      {bio && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Bio</h2>
          <p className="text-muted-foreground">{bio}</p>
        </Card>
      )}

      {/* Owners Section */}
      {owners && owners.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Building className="h-4 w-4" />
            Owners
          </h3>
          <div className="grid gap-6">
            {owners.map((owner, index) => (
              <BusinessOwnerCard key={index} {...owner} />
            ))}
          </div>
        </Card>
      )}

      {/* Staff Section */}
      {staff_details && staff_details.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff
          </h3>
          <div className="grid gap-6">
            {staff_details.map((staff, index) => (
              <BusinessStaffCard key={index} {...staff} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};