import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileHeaderProps {
  isEditing: boolean;
  onEditClick: () => void;
}

export const ProfileHeader = ({ isEditing, onEditClick }: ProfileHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">Profile</CardTitle>
        <Button 
          variant={isEditing ? "ghost" : "outline"} 
          onClick={onEditClick}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>
    </CardHeader>
  );
};