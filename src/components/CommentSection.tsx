import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar } from "./ui/avatar";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment, getComments } from "@/services/postService";

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      await addComment(postId, newComment);
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

  if (isLoading) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex gap-4">
        <Avatar>
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
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

      <div className="space-y-4 mt-6">
        {comments?.map((comment: any) => (
          <div key={comment.id} className="flex gap-4 animate-fade-up">
            <Avatar>
              <img
                src={comment.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`}
                alt={`${comment.profile?.username || 'Anonymous'}'s avatar`}
                className="h-8 w-8 rounded-full"
              />
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{comment.profile?.username || 'Anonymous'}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};