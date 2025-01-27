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
        className="bg-gray-800 text-white hover:bg-gray-700"
      >
        {isEditing ? "Cancel" : "Edit Profile"}
      </Button>
    </CardHeader>
  );
};