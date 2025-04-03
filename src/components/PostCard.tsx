
import { useEffect, useState } from "react";
import { Eye, Heart, MessageCircle, Repeat2 } from "lucide-react";
import { incrementViews } from "@/services/postService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { CommentSection } from "./CommentSection";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";

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
  reposts?: number;
  views?: number;
  isLiked?: boolean;
}

export const PostCard = ({ 
  id, 
  author, 
  avatar, 
  time, 
  content, 
  category, 
  image, 
  likes, 
  comments,
  reposts = 0,
  views = 0,
  isLiked = false
}: PostCardProps) => {
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

  const { data: currentRepostStatus } = useQuery({
    queryKey: ['post-repost', id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('reposts')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      return !!data;
    },
    initialData: false,
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

  const { mutate: toggleRepost } = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to repost');

      if (currentRepostStatus) {
        const { error } = await supabase
          .from('reposts')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('reposts')
          .insert([
            { post_id: id, user_id: user.id }
          ]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-repost', id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success(currentRepostStatus ? 'Post unreposted' : 'Post reposted');
    },
    onError: (error) => {
      console.error('Error toggling repost:', error);
      toast.error('Failed to update repost status');
    },
  });

  return (
    <div className="flex flex-col space-y-4 p-4 border rounded-lg">
      {image && (
        <div className="w-full aspect-[16/9] overflow-hidden rounded-lg">
          <img 
            src={image} 
            alt={content} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex items-center">
        <AvatarWithFallback
          src={avatar}
          name={author}
          size="md"
        />
        
        <div className="ml-2">
          <h3 className="font-semibold">{author}</h3>
          <p className="text-sm text-muted-foreground">{time}</p>
        </div>
      </div>
      <p className="text-sm">{content}</p>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          {views}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center gap-1 ${currentLikeStatus ? 'text-red-500' : ''}`}
          onClick={() => toggleLike()}
        >
          <Heart className={`h-4 w-4 ${currentLikeStatus ? 'fill-current' : ''}`} />
          <span className="font-medium">{likes}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center gap-1 ${currentRepostStatus ? 'text-green-500' : ''}`}
          onClick={() => toggleRepost()}
        >
          <Repeat2 className={`h-4 w-4 ${currentRepostStatus ? 'fill-current' : ''}`} />
          <span className="font-medium">{reposts}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-4 w-4" />
          <span className="font-medium">{comments}</span>
        </Button>
      </div>
      {showComments && <CommentSection postId={id} />}
    </div>
  );
};
