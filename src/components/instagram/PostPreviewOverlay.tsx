
import { Heart, MessageCircle } from "lucide-react";

interface PostPreviewOverlayProps {
  likes: number;
  comments: number;
}

export const PostPreviewOverlay = ({ likes, comments }: PostPreviewOverlayProps) => {
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 text-white opacity-0 hover:opacity-100 transition-opacity">
      <div className="flex items-center gap-1">
        <Heart className="h-5 w-5 fill-white" />
        <span className="font-medium">{likes}</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageCircle className="h-5 w-5" />
        <span className="font-medium">{comments}</span>
      </div>
    </div>
  );
};
