
import { AvatarWithFallback } from "../ui/avatar-with-fallback";

interface CommentItemProps {
  comment: {
    id: string;
    profile?: {
      username?: string;
      avatar_url?: string;
    };
    user_id: string;
    content: string;
    created_at: string;
  };
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className="flex gap-4 animate-fade-up">
      <AvatarWithFallback
        src={comment.profile?.avatar_url}
        name={comment.profile?.username || 'Anonymous'}
        size="sm"
      />
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
  );
};
