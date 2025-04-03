
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Reply } from "lucide-react";
import { ReplyForm } from "./ReplyForm";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";

interface CommentItemProps {
  comment: any;
  isBusinessOwner: boolean;
  replyingTo: string | null;
  onReplyClick: (commentId: string) => void;
  onReplySubmit: (content: string) => void;
  onReplyCancel: () => void;
}

export const CommentItem = ({
  comment,
  isBusinessOwner,
  replyingTo,
  onReplyClick,
  onReplySubmit,
  onReplyCancel
}: CommentItemProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 p-4 border rounded-lg">
        <AvatarWithFallback 
          src={comment.profile?.avatar_url}
          name={comment.profile?.username}
          userId={comment.user_id}
          size="md"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">
              {comment.profile?.username || "Anonymous"}
            </span>
            {comment.rating && (
              <div className="flex items-center">
                {Array.from({ length: comment.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            )}
          </div>
          <p className="text-muted-foreground">{comment.content}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
            {isBusinessOwner && !comment.reply_to && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReplyClick(comment.id)}
                className="flex items-center gap-2"
              >
                <Reply className="h-4 w-4" />
                Reply
              </Button>
            )}
          </div>
        </div>
      </div>

      {isBusinessOwner && replyingTo === comment.id && (
        <div className="ml-12">
          <ReplyForm
            onSubmit={onReplySubmit}
            onCancel={onReplyCancel}
          />
        </div>
      )}

      {comment.replies?.map((reply: any) => (
        <div key={reply.id} className="ml-12 flex gap-4 p-4 border rounded-lg bg-muted/50">
          <Avatar className="h-8 w-8">
            <img
              src={reply.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.user_id}`}
              alt={reply.profile?.username || "User"}
            />
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">
                {reply.profile?.username || "Anonymous"}
              </span>
              <Badge variant="outline">Business Owner</Badge>
            </div>
            <p className="text-muted-foreground">{reply.content}</p>
            <span className="text-sm text-muted-foreground">
              {new Date(reply.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
