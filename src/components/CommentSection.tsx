import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar } from "./ui/avatar";
import { toast } from "sonner";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export const CommentSection = ({ postId, initialComments }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      toast.error("Please write something first!");
      return;
    }

    const comment: Comment = {
      id: Math.random().toString(36).substring(7),
      author: "Felix",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      content: newComment,
      timestamp: "Just now"
    };

    setComments([comment, ...comments]);
    setNewComment("");
    toast.success("Comment added!");
  };

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
          <Button onClick={handleSubmitComment} className="float-right">
            Comment
          </Button>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 animate-fade-up">
            <Avatar>
              <img
                src={comment.avatar}
                alt={`${comment.author}'s avatar`}
                className="h-8 w-8 rounded-full"
              />
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{comment.author}</span>
                <span className="text-sm text-muted-foreground">{comment.timestamp}</span>
              </div>
              <p className="mt-1 text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};