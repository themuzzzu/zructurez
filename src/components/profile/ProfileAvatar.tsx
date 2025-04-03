
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";

interface ProfileAvatarProps {
  avatarUrl: string;
  isEditing: boolean;
  onAvatarChange: (file: File) => void;
  username?: string;
  userId?: string;
}

export const ProfileAvatar = ({ 
  avatarUrl, 
  isEditing, 
  onAvatarChange, 
  username = "User",
  userId 
}: ProfileAvatarProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAvatarChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <AvatarWithFallback 
          src={avatarUrl} 
          name={username}
          userId={userId}
          size="xl"
        />
        
        {isEditing && (
          <label 
            htmlFor="avatar-upload" 
            className="absolute bottom-0 right-0 cursor-pointer bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
          >
            <Camera className="h-4 w-4 text-white" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
};
