
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { incrementViews } from "@/services/postService";
import { MessageCircle, Heart, Share2, Eye, MoreHorizontal, Repeat2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

interface PostCardProps {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  category?: string;
  image?: string | null;
  likes: number;
  comments: number;
  views?: number;
  isLiked?: boolean;
}

export const EnhancedPostCard = ({
  id,
  author,
  avatar,
  time,
  content,
  category,
  image,
  likes,
  comments,
  views = 0,
  isLiked = false,
}: PostCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    incrementViews('posts', id);
  }, [id]);

  const { data: currentLikeStatus } = useQuery({
    queryKey: ['post-like', id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      return !!data;
    },
    initialData: isLiked,
  });

  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to like posts');

      if (currentLikeStatus) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert([
            { post_id: id, user_id: user.id }
          ]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-like', id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success(currentLikeStatus ? 'Post unliked' : 'Post liked');
    },
    onError: (error) => {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status');
    },
  });

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this post: ${window.location.origin}/?post=${id}`);
    toast.success('Link copied to clipboard');
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return time;
  };

  const handleRepost = () => {
    if (!user) {
      toast.error("Please sign in to repost");
      return;
    }
    toast.success("Post reshared to your timeline");
  };

  return (
    <div className="p-4">
      <div className="flex">
        <Avatar className="h-10 w-10 mr-3 mt-1 flex-shrink-0">
          <AvatarImage src={avatar} alt={author} />
          <AvatarFallback>{author[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center text-sm">
              <span className="font-semibold mr-2 hover:underline cursor-pointer">{author}</span>
              <span className="text-muted-foreground">· {formatTimeAgo(time)}</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  Not interested in this post
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Follow {author}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Report post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="text-base mb-3 whitespace-pre-wrap">{content}</div>
          
          {image && (
            <div className="mt-2 mb-3 rounded-xl overflow-hidden border">
              <img src={image} alt="" className="w-full h-auto max-h-96 object-cover" />
            </div>
          )}
          
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
              onClick={() => toggleLike()}
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
          
          {showComments && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-center text-muted-foreground">Comments are loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
