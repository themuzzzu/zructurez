
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Post, Poll, PollVote } from "./PostsList";

interface PostItemProps {
  post: Post;
  onVote: () => void;
}

export const PostItem = ({ post, onVote }: PostItemProps) => {
  const handleVote = async (pollId: string, optionIndex: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to vote");
        return;
      }

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('poll_votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Update existing vote
        const { error } = await supabase
          .from('poll_votes')
          .update({ option_index: optionIndex })
          .eq('id', existingVote.id);

        if (error) throw error;
      } else {
        // Create new vote
        const { error } = await supabase
          .from('poll_votes')
          .insert({
            poll_id: pollId,
            option_index: optionIndex,
            user_id: user.id
          });

        if (error) throw error;
      }

      onVote();
      toast.success("Vote recorded");
    } catch (error) {
      console.error('Error voting in poll:', error);
      toast.error("Failed to record vote");
    }
  };

  const getVoteCount = (pollOptions: any[], optionIndex: number) => {
    if (!post.poll?.votes) return 0;
    return post.poll.votes.filter(vote => vote.option_index === optionIndex).length;
  };

  const getTotalVotes = () => {
    if (!post.poll?.votes) return 0;
    return post.poll.votes.length;
  };

  return (
    <Card key={post.id} className="p-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage 
            src={post.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`} 
            alt={post.profile?.username || "User"} 
          />
          <AvatarFallback>{post.profile?.username?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">{post.profile?.username || "Anonymous"}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.created_at).toLocaleString()} 
                {post.group && ` • in ${post.group.name}`}
              </p>
            </div>
          </div>
          <p className="mt-2">{post.content}</p>
          
          {post.image_url && (
            <div className="mt-4">
              <img 
                src={post.image_url} 
                alt="Post image" 
                className="max-h-96 object-contain rounded-md"
              />
            </div>
          )}
          
          {post.gif_url && (
            <div className="mt-4">
              <img 
                src={post.gif_url} 
                alt="GIF" 
                className="max-h-96 object-contain rounded-md"
              />
            </div>
          )}
          
          {post.poll && post.poll.id && (
            <div className="mt-4 border rounded-md p-4">
              <p className="font-medium mb-2">{post.poll.question}</p>
              <div className="space-y-2">
                {Array.isArray(post.poll.options) ? 
                  post.poll.options.map((option, index) => {
                    const voteCount = getVoteCount(post.poll!.options, index);
                    const totalVotes = getTotalVotes();
                    const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                    
                    return (
                      <div key={index} className="relative">
                        <Button
                          variant="outline"
                          className="w-full justify-between hover:bg-muted"
                          onClick={() => handleVote(post.poll!.id, index)}
                        >
                          <span>{typeof option === 'string' ? option : option.text}</span>
                          <span>{voteCount} votes ({percentage}%)</span>
                        </Button>
                        <div 
                          className="absolute top-0 left-0 h-full bg-primary/10 rounded-l-sm"
                          style={{ width: `${percentage}%`, zIndex: -1 }}
                        />
                      </div>
                    );
                  })
                  : null
                }
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {getTotalVotes()} votes total
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
