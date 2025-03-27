
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Share2, Repeat2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { usePostRepost } from "@/hooks/usePostRepost";
import { useState } from "react";

interface PostActionsProps {
  id: string;
  likes: number;
  comments: number;
  reposts?: number;
  currentLikeStatus: boolean;
  toggleLike: () => void;
  setShowComments: (show: boolean) => void;
  showComments: boolean;
}

export const PostActions = ({
  id,
  likes,
  comments,
  reposts = 0,
  currentLikeStatus,
  toggleLike,
  setShowComments,
  showComments
}: PostActionsProps) => {
  const { user } = useAuth();
  const { hasReposted, toggleRepost } = usePostRepost(id);
  const [isLiking, setIsLiking] = useState(false);
  const [isReposting, setIsReposting] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this post: ${window.location.origin}/?post=${id}`);
    toast.success('Link copied to clipboard');
  };

  const handleLike = () => {
    if (!user) {
      toast.error("Please sign in to like posts");
      return;
    }
    
    setIsLiking(true);
    toggleLike();
    setTimeout(() => setIsLiking(false), 300);
  };

  const handleRepost = () => {
    if (!user) {
      toast.error("Please sign in to repost");
      return;
    }
    
    setIsReposting(true);
    toggleRepost();
    setTimeout(() => setIsReposting(false), 300);
  };

  return (
    <div className="flex justify-between mt-2 text-muted-foreground">
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-2 rounded-full hover:text-primary hover:bg-primary/10"
        onClick={() => setShowComments(!showComments)}
      >
        <MessageCircle className="h-4 w-4" />
        <span>{comments}</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-2 rounded-full ${
          hasReposted 
            ? "text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950" 
            : "hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950"
        }`}
        onClick={handleRepost}
        disabled={isReposting}
      >
        <Repeat2 className={`h-4 w-4 ${isReposting ? "animate-spin" : ""} ${hasReposted ? "fill-current" : ""}`} />
        <span>{reposts}</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-2 rounded-full ${
          currentLikeStatus 
            ? "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950" 
            : "hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
        }`}
        onClick={handleLike}
        disabled={isLiking}
      >
        <Heart className={`h-4 w-4 ${isLiking ? "animate-ping" : ""} ${currentLikeStatus ? "fill-current" : ""}`} />
        <span>{likes}</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-2 rounded-full hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
