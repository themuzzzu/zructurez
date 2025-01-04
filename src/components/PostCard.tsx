import { useState } from "react";
import { Card } from "./ui/card";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { CommentSection } from "./CommentSection";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PostCardProps {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  category?: string;
  likes?: number;
  comments?: number;
  image?: string | null;
  isLiked?: boolean;
}

export const PostCard = ({
  id,
  author,
  avatar,
  time,
  content,
  category,
  likes = 0,
  comments = 0,
  image,
  isLiked = false,
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(likes);
  const [imageLoaded, setImageLoaded] = useState(false);
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (isLikedState) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert([{ post_id: id, user_id: user.id }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      setIsLikedState(!isLikedState);
      setLikesCount(prev => isLikedState ? prev - 1 : prev + 1);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Error toggling like:', error);
      toast.error("Failed to update like");
    },
  });

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.target as HTMLImageElement;
    setImageLoaded(true);
  };

  return (
    <Card className="overflow-hidden">
      <div className={cn("p-4", !image && "pb-0")}>
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <img src={avatar} alt={author} className="h-10 w-10 rounded-full" />
          </Avatar>
          <div>
            <div className="font-semibold">{author}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>{time}</span>
              {category && (
                <>
                  <span>•</span>
                  <span>{category}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="mb-4">{content}</p>
      </div>

      {image && (
        <div className="relative mb-4 bg-muted">
          <img
            src={image}
            alt="Post content"
            className={cn(
              "w-full transition-opacity duration-200",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            style={{
              maxHeight: "calc(100vh - 200px)",
              objectFit: "contain",
              margin: "0 auto",
              display: "block"
            }}
            onLoad={handleImageLoad}
          />
        </div>
      )}

      <div className="px-4 pb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => likeMutation.mutate()}
          >
            <Heart
              className={cn(
                "h-4 w-4 mr-2",
                isLikedState ? "fill-current text-red-500" : ""
              )}
            />
            {likesCount}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {comments}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => toast.info("Sharing coming soon!")}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {showComments && (
        <div className="border-t">
          <CommentSection postId={id} />
        </div>
      )}
    </Card>
  );
};