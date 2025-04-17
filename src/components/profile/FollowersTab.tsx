
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Follower {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
}

export const FollowersTab = () => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [filteredFollowers, setFilteredFollowers] = useState<Follower[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = followers.filter((follower) =>
        follower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        follower.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFollowers(filtered);
    } else {
      setFilteredFollowers(followers);
    }
  }, [searchTerm, followers]);

  const fetchFollowers = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // This is a mock implementation - replace with actual API call
      const { data, error } = await supabase
        .from('followers')
        .select('id, name, username, avatar_url')
        .eq('followed_id', user.id);

      if (error) throw error;

      const followerData: Follower[] = data || [];
      setFollowers(followerData);
      setFilteredFollowers(followerData);
    } catch (error) {
      console.error("Error fetching followers:", error);
      toast.error("Failed to load followers");
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (followerId: string) => {
    try {
      // This would be your actual unfollow logic
      const { error } = await supabase
        .from('followers')
        .delete()
        .match({ follower_id: followerId });
        
      if (error) throw error;
      
      setFollowers((prev) => prev.filter((follower) => follower.id !== followerId));
      toast.success("User unfollowed successfully");
    } catch (error) {
      console.error("Error unfollowing user:", error);
      toast.error("Failed to unfollow user");
    }
  };

  if (loading) {
    return <p>Loading followers...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search followers..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredFollowers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm ? "No followers match your search" : "You don't have any followers yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFollowers.map((follower) => (
            <div key={follower.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={follower.avatar_url || undefined} />
                  <AvatarFallback>{follower.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{follower.name}</p>
                  <p className="text-sm text-muted-foreground">@{follower.username}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUnfollow(follower.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
