
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isPending: boolean;
}

export const CommentForm = ({ onSubmit, isPending }: CommentFormProps) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit(comment);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        className="min-h-[100px]"
      />
      <Button type="submit" disabled={isPending || !comment.trim()}>
        {isPending ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
};
