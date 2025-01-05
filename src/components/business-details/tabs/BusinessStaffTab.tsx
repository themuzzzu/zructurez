import { Card } from "@/components/ui/card";
import type { StaffMember } from "@/types/business";

interface BusinessStaffTabProps {
  staffDetails: StaffMember[];
}

export const BusinessStaffTab = ({ staffDetails }: BusinessStaffTabProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Staff</h2>
      <div className="grid gap-4">
        {staffDetails.map((staff, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <h3 className="font-medium">{staff.name}</h3>
            {staff.position && <p className="text-muted-foreground">{staff.position}</p>}
            {staff.experience && <p className="text-sm text-muted-foreground">Experience: {staff.experience}</p>}
          </div>
        ))}
      </div>
    </Card>
  );
};