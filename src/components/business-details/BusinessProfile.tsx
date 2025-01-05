import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, Phone, Mail, Building, Users, Award, Briefcase } from "lucide-react";

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
        </div>

        {owners && owners.length > 0 && (
          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Owners
            </h3>
            <div className="grid gap-4">
              {owners.map((owner, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <Avatar className="h-16 w-16">
                    {owner.image_url ? (
                      <AvatarImage src={owner.image_url} alt={owner.name} />
                    ) : (
                      <AvatarFallback>
                        {owner.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-lg">{owner.name}</span>
                      <Badge variant="secondary">{owner.role}</Badge>
                    </div>
                    {owner.position && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="h-3 w-3" />
                        <span>{owner.position}</span>
                      </div>
                    )}
                    {owner.experience && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="h-3 w-3" />
                        <span>{owner.experience}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {staff_details && staff_details.length > 0 && (
          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Staff
            </h3>
            <div className="grid gap-4">
              {staff_details.map((staff, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <Avatar className="h-16 w-16">
                    {staff.image_url ? (
                      <AvatarImage src={staff.image_url} alt={staff.name} />
                    ) : (
                      <AvatarFallback>
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-lg">{staff.name}</span>
                      {staff.position && <Badge variant="secondary">{staff.position}</Badge>}
                    </div>
                    {staff.experience && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="h-3 w-3" />
                        <span>{staff.experience}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};