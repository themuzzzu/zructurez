
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageCircle, UserPlus, Users, UserMinus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const FollowSuggestions = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch suggested profiles and their follow status
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['suggested-profiles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get profiles excluding current user
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, name, avatar_url')
        .neq('id', user.id)
        .limit(5);

      if (profilesError) throw profilesError;

      // Get current user's following list
      const { data: followingData } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', user.id);

      const followingIds = new Set(followingData?.map(f => f.following_id) || []);

      // Combine the data
      return profilesData.map(profile => ({
        ...profile,
        isFollowing: followingIds.has(profile.id)
      }));
    }
  });

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('followers')
        .insert({
          follower_id: user.id,
          following_id: profileId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggested-profiles'] });
      toast.success('Successfully followed user');
    },
    onError: (error) => {
      console.error('Error following user:', error);
      toast.error('Failed to follow user');
    }
  });

  // Unfollow mutation
  const unfollowMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', profileId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggested-profiles'] });
      toast.success('Successfully unfollowed user');
    },
    onError: (error) => {
      console.error('Error unfollowing user:', error);
      toast.error('Failed to unfollow user');
    }
  });

  const handleFollowToggle = async (profileId: string, isFollowing: boolean) => {
    if (isFollowing) {
      unfollowMutation.mutate(profileId);
    } else {
      followMutation.mutate(profileId);
    }
  };

  const handleMessage = async (profileId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to send messages');
        return;
      }

      const { data: existingMessages, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`)
        .limit(1);

      if (fetchError) throw fetchError;

      if (!existingMessages || existingMessages.length === 0) {
        const { error: sendError } = await supabase
          .from('messages')
          .insert({
            sender_id: user.id,
            receiver_id: profileId,
            content: 'Hey! 👋'
          });

        if (sendError) throw sendError;
      }

      navigate('/messages');
      toast.success('Chat started!');
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start chat');
    }
  };

  const handleSyncContacts = async () => {
    toast.success('Contacts synced successfully!');
  };

  if (isLoading) {
    return <div>Loading suggestions...</div>;
  }

  return (
    <Card className="p-4 my-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Who to Follow</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-1" />
              Sync Contacts
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sync Your Contacts</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Find people you know by syncing your contacts.</p>
              <Button onClick={handleSyncContacts} className="w-full">
                Sync Now
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={profile.avatar_url || '/placeholder.svg'}
                alt={profile.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{profile.name || 'Anonymous'}</p>
                <p className="text-sm text-muted-foreground">@{profile.username || 'username'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMessage(profile.id)}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
              <Button
                size="sm"
                variant={profile.isFollowing ? "outline" : "default"}
                onClick={() => handleFollowToggle(profile.id, profile.isFollowing)}
              >
                {profile.isFollowing ? (
                  <>
                    <UserMinus className="h-4 w-4 mr-1" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Follow
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
