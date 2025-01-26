import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar } from "../ui/avatar";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "@/services/postService";

interface CommentFormProps {
  postId: string;
}

export const CommentForm = ({ postId }: CommentFormProps) => {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

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

  return (
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
  );
};