import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";

interface FollowData {
  id: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
  is_business: boolean;
}

export const FollowersTab = () => {
  const { profile } = useProfile();
  const [followers, setFollowers] = useState<FollowData[]>([]);
  const [following, setFollowing] = useState<FollowData[]>([]);
  const [activeTab, setActiveTab] = useState("followers");

  useEffect(() => {
    if (profile.id) {
      fetchFollowers();
      fetchFollowing();
    }
  }, [profile.id]);

  const fetchFollowers = async () => {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        is_business,
        follower:profiles!followers_follower_id_fkey (
          id,
          name,
          username,
          avatar_url
        )
      `)
      .eq('following_id', profile.id);

    if (!error && data) {
      const formattedData = data.map(item => ({
        id: item.follower.id,
        name: item.follower.name,
        username: item.follower.username,
        avatar_url: item.follower.avatar_url,
        is_business: item.is_business || false
      }));
      setFollowers(formattedData);
    }
  };

  const fetchFollowing = async () => {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        is_business,
        following:profiles!followers_following_id_fkey (
          id,
          name,
          username,
          avatar_url
        )
      `)
      .eq('follower_id', profile.id);

    if (!error && data) {
      const formattedData = data.map(item => ({
        id: item.following.id,
        name: item.following.name,
        username: item.following.username,
        avatar_url: item.following.avatar_url,
        is_business: item.is_business || false
      }));
      setFollowing(formattedData);
    }
  };

  const renderFollowList = (data: FollowData[], type: "followers" | "following") => {
    const people = data.filter(item => !item.is_business);
    const businesses = data.filter(item => item.is_business);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">People</h3>
          <div className="space-y-4">
            {people.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <img
                    src={item.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                    alt={item.name || "Profile"}
                  />
                </Avatar>
                <div>
                  <p className="font-medium">{item.name || "Anonymous"}</p>
                  <p className="text-sm text-muted-foreground">@{item.username || "username"}</p>
                </div>
              </div>
            ))}
            {people.length === 0 && (
              <p className="text-muted-foreground">No people {type} yet</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Businesses</h3>
          <div className="space-y-4">
            {businesses.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <img
                    src={item.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                    alt={item.name || "Business"}
                  />
                </Avatar>
                <div>
                  <p className="font-medium">{item.name || "Business"}</p>
                  <p className="text-sm text-muted-foreground">@{item.username || "business"}</p>
                </div>
              </div>
            ))}
            {businesses.length === 0 && (
              <p className="text-muted-foreground">No businesses {type} yet</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followers">
              Followers ({followers.length})
            </TabsTrigger>
            <TabsTrigger value="following">
              Following ({following.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="followers" className="mt-6">
            {renderFollowList(followers, "followers")}
          </TabsContent>
          <TabsContent value="following" className="mt-6">
            {renderFollowList(following, "following")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};