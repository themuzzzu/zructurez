import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

interface ProfileCardProps {
  profile: {
    name: string | null;
    username: string | null;
    avatar_url: string | null;
    bio: string | null;
  };
  onEditClick: () => void;
}

export const ProfileCard = ({ profile, onEditClick }: ProfileCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{profile.name || "Anonymous"}</h1>
              </div>
              <p className="text-muted-foreground">@{profile.username || "username"}</p>
              <p className="text-muted-foreground">{profile.bio || "No bio yet"}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={onEditClick}
            className="h-9"
          >
            Edit Profile
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};