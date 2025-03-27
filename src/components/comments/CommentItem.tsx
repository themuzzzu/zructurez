
import { Avatar } from "../ui/avatar";

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
  );
};
