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
            <div className="grid gap-6">
              {owners.map((owner, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="flex flex-col">
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {owner.image_url ? (
                            <AvatarImage src={owner.image_url} alt={owner.name} />
                          ) : (
                            <AvatarFallback>
                              {owner.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{owner.name}</h4>
                          <p className="text-sm text-muted-foreground">{owner.role}</p>
                        </div>
                      </div>
                    </div>
                    {owner.image_url && (
                      <div className="relative aspect-square">
                        <img
                          src={owner.image_url}
                          alt={owner.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      {owner.position && (
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="h-4 w-4" />
                          <span>{owner.position}</span>
                        </div>
                      )}
                      {owner.experience && (
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="h-4 w-4" />
                          <span>{owner.experience}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
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
            <div className="grid gap-6">
              {staff_details.map((staff, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="flex flex-col">
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {staff.image_url ? (
                            <AvatarImage src={staff.image_url} alt={staff.name} />
                          ) : (
                            <AvatarFallback>
                              {staff.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{staff.name}</h4>
                          <p className="text-sm text-muted-foreground">{staff.position}</p>
                        </div>
                      </div>
                    </div>
                    {staff.image_url && (
                      <div className="relative aspect-square">
                        <img
                          src={staff.image_url}
                          alt={staff.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {staff.experience && (
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="h-4 w-4" />
                          <span>{staff.experience}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};