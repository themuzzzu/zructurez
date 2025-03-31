import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePostLike } from "@/hooks/usePostLike";
import { usePostRepost } from "@/hooks/usePostRepost";
import { MessageCircle, Heart, Repeat2, Share2, MoreHorizontal } from "lucide-react";
import { UserPost } from "@/types/business";
import { format } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PostCardProps {
  post: UserPost;
  onRefresh: () => void;
}

export const PostCard = ({ post, onRefresh }: PostCardProps) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const { currentLikeStatus, toggleLike } = usePostLike(post.id);
  const { hasReposted, toggleRepost } = usePostRepost(post.id);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy · h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this post: ${window.location.origin}/post/${post.id}`);
    toast.success("Link copied to clipboard");
  };

  const handleDelete = async () => {
    if (!user || user.id !== post.user_id) {
      toast.error("You can only delete your own posts");
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;
      
      toast.success("Post deleted successfully");
      onRefresh();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error("Failed to delete post");
    }
  };

  return (
    <Card className="p-4 mb-4 hover:bg-accent/10 transition-colors">
      <div className="flex">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage 
            src={post.profile?.avatar_url} 
            alt={post.profile?.username || "Anonymous"} 
          />
          <AvatarFallback>
            {(post.profile?.username || "A").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-1">
              <span className="font-semibold">{post.profile?.username || "Anonymous"}</span>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-muted-foreground text-sm">{formatDate(post.created_at)}</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user && user.id === post.user_id && (
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive" 
                    onClick={handleDelete}
                  >
                    Delete Post
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleShare}>
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-1 mb-3 whitespace-pre-wrap">{post.content}</div>
          
          {post.image_url && (
            <div className="mb-3 rounded-md overflow-hidden border">
              <img 
                src={post.image_url} 
                alt="Post attachment" 
                className="w-full h-auto max-h-80 object-cover" 
              />
            </div>
          )}
          
          <div className="flex justify-between mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-1" 
              onClick={handleComment}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments_count || 0}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center space-x-1 ${hasReposted ? "text-green-500" : ""}`} 
              onClick={() => toggleRepost()}
            >
              <Repeat2 className="h-4 w-4" />
              <span>{post.reposts_count || 0}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center space-x-1 ${currentLikeStatus ? "text-red-500" : ""}`}
              onClick={() => toggleLike()}
            >
              <Heart className={`h-4 w-4 ${currentLikeStatus ? "fill-current" : ""}`} />
              <span>{post.likes_count || 0}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center space-x-1"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          
          {showComments && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm text-muted-foreground text-center">Comments will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
