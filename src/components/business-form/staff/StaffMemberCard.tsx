
import { Button } from "../../ui/button";
import { X } from "lucide-react";
import { StaffFormFields } from "./StaffFormFields";
import type { StaffMember } from "../types/staff";

interface StaffMemberCardProps {
  member: StaffMember;
  onUpdate: (field: keyof StaffMember, value: string) => void;
  onRemove: () => void;
}

export const StaffMemberCard = ({ member, onUpdate, onRemove }: StaffMemberCardProps) => {
  return (
    <div className="grid gap-2 p-4 border rounded-lg bg-muted/50">
      <div className="flex justify-between items-start">
        <StaffFormFields 
          name={member.name}
          position={member.position || ""}  // Ensure position is always provided
          experience={member.experience || ""} // Ensure experience is provided
          bio={member.bio}
          image_url={member.image_url}
          onUpdate={onUpdate} 
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
