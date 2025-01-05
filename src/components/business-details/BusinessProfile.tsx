import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Phone, Mail, Building, GraduationCap, Users } from "lucide-react";

interface BusinessProfileProps {
  description: string;
  location?: string;
  hours?: string;
  contact?: string;
  verified?: boolean;
  image_url?: string;
  bio?: string;
  owner_profession?: string;
  owner_qualification?: string;
  staff_details?: { name: string; role: string }[];
}

export const BusinessProfile = ({
  description,
  location,
  hours,
  contact,
  verified,
  image_url,
  bio,
  owner_profession,
  owner_qualification,
  staff_details,
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
      
      {bio && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Bio</h2>
          <p className="text-muted-foreground">{bio}</p>
        </Card>
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

          {owner_profession && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building className="h-4 w-4" />
              <span>Owner's Profession: {owner_profession}</span>
            </div>
          )}

          {owner_qualification && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              <span>Owner's Qualification: {owner_qualification}</span>
            </div>
          )}
        </div>

        {staff_details && staff_details.length > 0 && (
          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Staff
            </h3>
            <div className="grid gap-2">
              {staff_details.map((staff, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                  <span className="font-medium">{staff.name}</span>
                  <span className="text-muted-foreground">{staff.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};