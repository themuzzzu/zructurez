import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileAvatarProps {
  avatarUrl: string;
  isEditing: boolean;
  onAvatarChange: (url: string) => void;
}

export const ProfileAvatar = ({ avatarUrl, isEditing, onAvatarChange }: ProfileAvatarProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} />
        <AvatarFallback>User</AvatarFallback>
      </Avatar>
      {isEditing && (
        <div className="w-full">
          <Label htmlFor="avatar_url">Avatar URL</Label>
          <Input
            id="avatar_url"
            value={avatarUrl || ""}
            onChange={(e) => onAvatarChange(e.target.value)}
            placeholder="Enter avatar URL"
          />
        </div>
      )}
    </div>
  );
};