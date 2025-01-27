import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { Edit } from "lucide-react";

interface ProfileHeaderProps {
  isEditing: boolean;
  onEditClick: () => void;
}

export const ProfileHeader = ({ isEditing, onEditClick }: ProfileHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <h2 className="text-2xl font-semibold">Profile Settings</h2>
      <Button
        variant={isEditing ? "secondary" : "default"}
        onClick={onEditClick}
        className="gap-2"
      >
        <Edit className="h-4 w-4" />
        {isEditing ? "Cancel Editing" : "Edit Profile"}
      </Button>
    </CardHeader>
  );
};