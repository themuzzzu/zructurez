
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, User } from "lucide-react";
import type { Profile } from "@/types/profile";

interface ProfileDisplayProps {
  profile: Profile;
  onEdit: () => void;
  isOwnProfile?: boolean;
}

export function ProfileDisplay({ profile, onEdit, isOwnProfile = true }: ProfileDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24 border-2 border-background shadow-md">
            <AvatarImage 
              src={profile.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
              alt="Profile" 
            />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-2xl font-bold">{profile.username || "Username"}</h1>
            {profile.location && (
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{profile.location}</span>
              </div>
            )}
            <p className="mt-2 text-muted-foreground">
              Joined {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {isOwnProfile && (
          <Button onClick={onEdit} variant="outline" className="gap-2">
            <Edit className="h-4 w-4" /> Edit Profile
          </Button>
        )}
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-2">Bio</h2>
        <p className="text-muted-foreground">
          {profile.bio || "No bio provided yet."}
        </p>
      </div>
    </div>
  );
}
