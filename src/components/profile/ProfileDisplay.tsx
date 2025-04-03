import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, User, Calendar, Mail, Phone } from "lucide-react";
import type { Profile } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";

interface ProfileDisplayProps {
  profile: Profile;
  onEdit: () => void;
  isOwnProfile?: boolean;
}

export function ProfileDisplay({ profile, onEdit, isOwnProfile = true }: ProfileDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Cover Photo Area */}
      <div className="relative w-full h-32 sm:h-48 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-lg overflow-hidden mb-16">
        {/* Add cover photo logic here if needed */}
        
        {/* Profile Picture - Positioned to overflow onto the cover photo */}
        <div className="absolute -bottom-12 left-6">
          <AvatarWithFallback 
            src={profile.avatar_url} 
            name={profile.username || profile.name}
            userId={profile.id}
            size="xl"
            className="border-4 border-background shadow-md"
          />
        </div>
        
        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <Button onClick={onEdit} variant="secondary" size="sm" className="gap-2">
              <Edit className="h-4 w-4" /> Edit Profile
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{profile.username || "Username"}</h1>
            {profile.theme_preference === "dark" && (
              <Badge variant="outline" className="text-xs">Dark Mode User</Badge>
            )}
          </div>
          
          <div className="flex flex-col gap-1 text-muted-foreground">
            {profile.location && (
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{profile.location}</span>
              </div>
            )}
            
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
            </div>
            
            {/* Add contact info if shared in privacy settings */}
            {profile.privacy_settings?.profile_visibility === "public" && (
              <>
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Contact via messages</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {!isOwnProfile && (
          <div className="flex gap-2 self-start">
            <Button size="sm">Follow</Button>
            <Button size="sm" variant="outline">Message</Button>
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-2">Bio</h2>
        <p className="text-muted-foreground">
          {profile.bio || "No bio provided yet."}
        </p>
      </div>
      
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 py-2 border-t border-b">
        <div className="text-center py-2">
          <div className="font-semibold">0</div>
          <div className="text-xs text-muted-foreground">Posts</div>
        </div>
        <div className="text-center py-2">
          <div className="font-semibold">0</div>
          <div className="text-xs text-muted-foreground">Followers</div>
        </div>
        <div className="text-center py-2">
          <div className="font-semibold">0</div>
          <div className="text-xs text-muted-foreground">Following</div>
        </div>
      </div>
    </div>
  );
}
