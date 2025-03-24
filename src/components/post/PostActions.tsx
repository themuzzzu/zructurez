
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Share2, Repeat2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface PostActionsProps {
  id: string;
  likes: number;
  comments: number;
  currentLikeStatus: boolean;
  toggleLike: () => void;
  setShowComments: (show: boolean) => void;
  showComments: boolean;
}

export const PostActions = ({
  id,
  likes,
  comments,
  currentLikeStatus,
  toggleLike,
  setShowComments,
  showComments
}: PostActionsProps) => {
  const { user } = useAuth();

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this post: ${window.location.origin}/?post=${id}`);
    toast.success('Link copied to clipboard');
  };

  const handleRepost = () => {
    if (!user) {
      toast.error("Please sign in to repost");
      return;
    }
    toast.success("Post reshared to your timeline");
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
        className="flex items-center gap-2 rounded-full hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950"
        onClick={handleRepost}
      >
        <Repeat2 className="h-4 w-4" />
        <span>0</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-2 rounded-full ${
          currentLikeStatus 
            ? "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950" 
            : "hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
        }`}
        onClick={toggleLike}
      >
        <Heart className={`h-4 w-4 ${currentLikeStatus ? "fill-current" : ""}`} />
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
