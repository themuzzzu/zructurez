import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar } from "../ui/avatar";
import { toast } from "sonner";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CommentFormProps {
  postId: string;
}

export const CommentForm = ({ postId }: CommentFormProps) => {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  // Get current user's profile
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return profile;
    },
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          profile_id: profile?.id,
          content: newComment,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success("Comment added!");
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast.error("Failed to add comment");
    },
  });

  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      toast.error("Please write something first!");
      return;
    }

    commentMutation.mutate();
  };

  return (
    <div className="flex gap-4">
      <Avatar>
        <img
          src={profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
          alt="Your avatar"
          className="h-8 w-8 rounded-full"
        />
      </Avatar>
      <div className="flex-1 space-y-2">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px] resize-none"
        />
        <Button 
          onClick={handleSubmitComment} 
          className="float-right"
          disabled={commentMutation.isPending}
        >
          {commentMutation.isPending ? "Posting..." : "Comment"}
        </Button>
      </div>
    </div>
  );
};