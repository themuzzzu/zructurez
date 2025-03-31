
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BusinessOwner, StaffMember } from "@/types/business";
import { useState } from "react";

interface BusinessTeamSectionProps {
  owners?: BusinessOwner[];
  staff_details?: StaffMember[];
}

interface BusinessOwnerCardProps {
  name: string;
  role: string;
  position?: string;
  experience?: string;
  bio?: string;
  image_url?: string | null;
}

interface BusinessStaffCardProps {
  name: string | null;
  position?: string | null;
  experience?: string | null;
  bio?: string;
  image_url?: string | null;
}

export const BusinessTeamSection = ({ owners = [], staff_details = [] }: BusinessTeamSectionProps) => {
  const [activeTab, setActiveTab] = useState("owners");

  // Handle empty or invalid data
  const validOwners = owners?.filter(owner => owner && owner.name) || [];
  const validStaff = staff_details?.filter(staff => staff && staff.name) || [];

  if (validOwners.length === 0 && validStaff.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Our Team</h3>

        <Tabs defaultValue="owners" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="owners" disabled={validOwners.length === 0}>
              Owners
            </TabsTrigger>
            <TabsTrigger value="staff" disabled={validStaff.length === 0}>
              Staff
            </TabsTrigger>
          </TabsList>

          <TabsContent value="owners" className="mt-0">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {validOwners.map((owner, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4 border rounded-lg">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={owner.image_url || ""} alt={owner.name} />
                    <AvatarFallback>{owner.name?.charAt(0) || "O"}</AvatarFallback>
                  </Avatar>
                  <h4 className="font-semibold">{owner.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{owner.role}</p>
                  {owner.position && <p className="text-sm">{owner.position}</p>}
                  {owner.experience && <p className="text-xs text-muted-foreground">{owner.experience} experience</p>}
                  {owner.bio && <p className="mt-2 text-sm">{owner.bio}</p>}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="staff" className="mt-0">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {validStaff.map((staff, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4 border rounded-lg">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={staff.image_url || ""} alt={staff.name || ""} />
                    <AvatarFallback>{staff.name?.charAt(0) || "S"}</AvatarFallback>
                  </Avatar>
                  <h4 className="font-semibold">{staff.name}</h4>
                  {staff.position && <p className="text-sm text-muted-foreground mb-2">{staff.position}</p>}
                  {staff.experience && <p className="text-xs text-muted-foreground">{staff.experience} experience</p>}
                  {staff.bio && <p className="mt-2 text-sm">{staff.bio}</p>}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
