import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";

interface ProfileHeaderProps {
  isEditing: boolean;
  onEditClick: () => void;
}

export const ProfileHeader = ({ isEditing, onEditClick }: ProfileHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <Button 
        variant="outline"
        onClick={onEditClick}
      >
        {isEditing ? "Cancel" : "Edit Profile"}
      </Button>
    </CardHeader>
  );
};