import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileCardProps {
  profile: {
    name: string | null;
    username: string | null;
    avatar_url: string | null;
    bio: string | null;
    id: string;
  };
  onEditClick: () => void;
}

export const ProfileCard = ({ profile, onEditClick }: ProfileCardProps) => {
  const { data: followerCount = 0 } = useQuery({
    queryKey: ['followerCount', profile.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', profile.id);
      return count || 0;
    }
  });

  const { data: followingCount = 0 } = useQuery({
    queryKey: ['followingCount', profile.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', profile.id);
      return count || 0;
    }
  });

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
              <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{followingCount}</span>
                  <span className="text-muted-foreground">Following</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{followerCount}</span>
                  <span className="text-muted-foreground">Followers</span>
                </div>
              </div>
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