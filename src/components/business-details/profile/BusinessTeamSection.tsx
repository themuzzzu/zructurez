import { Card } from "@/components/ui/card";
import { Building, Users } from "lucide-react";
import { BusinessOwnerCard } from "./BusinessOwnerCard";
import { BusinessStaffCard } from "./BusinessStaffCard";
import type { BusinessOwner, StaffMember } from "@/types/business";

interface BusinessTeamSectionProps {
  owners?: BusinessOwner[];
  staff_details?: StaffMember[];
}

export const BusinessTeamSection = ({ owners, staff_details }: BusinessTeamSectionProps) => {
  const hasValidStaff = staff_details && staff_details.length > 0 && staff_details.some(staff => staff.name);

  return (
    <>
      {owners && owners.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Building className="h-4 w-4" />
            Owners
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {owners.map((owner, index) => (
              <BusinessOwnerCard key={index} {...owner} />
            ))}
          </div>
        </Card>
      )}

      {hasValidStaff && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff_details.map((staff, index) => (
              staff.name && <BusinessStaffCard key={index} {...staff} />
            ))}
          </div>
        </Card>
      )}
    </>
  );
};