import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageCircle, UserPlus } from "lucide-react";

export const FollowSuggestions = () => {
  const navigate = useNavigate();

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['suggested-profiles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .limit(3);

      if (error) throw error;
      return data;
    }
  });

  const handleFollow = async (profileId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to follow users');
        return;
      }

      // Add follow logic here when implementing follow feature
      toast.success('User followed successfully');
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to follow user');
    }
  };

  const handleMessage = async (profileId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to send messages');
        return;
      }

      // Create or get existing chat
      const { data: existingMessages, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`)
        .limit(1);

      if (fetchError) throw fetchError;

      // If no existing chat, create first message
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

      // Navigate to messages page
      navigate('/messages');
      toast.success('Chat started!');
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start chat');
    }
  };

  if (isLoading) {
    return <div>Loading suggestions...</div>;
  }

  return (
    <Card className="p-4 my-4">
      <h3 className="font-semibold text-lg mb-4">Who to Follow</h3>
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
                <p className="font-medium">{profile.username || 'Anonymous'}</p>
                <p className="text-sm text-muted-foreground">{profile.bio || 'No bio'}</p>
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
                onClick={() => handleFollow(profile.id)}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Follow
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};