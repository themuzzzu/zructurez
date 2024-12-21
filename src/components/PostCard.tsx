import { MessageCircle, Heart, Share2, MoreHorizontal, Smile } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import { CommentSection } from "./CommentSection";
import { likePost, unlikePost } from "@/services/postService";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const EMOJI_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

interface PostCardProps {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  image?: string;
  isLiked: boolean;
}

export const PostCard = ({
  id,
  author,
  avatar,
  time,
  content,
  category,
  likes: initialLikes,
  comments: initialComments,
  image,
  isLiked: initialIsLiked,
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [reactions, setReactions] = useState<{ [key: string]: number }>({});
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (initialIsLiked) {
        await unlikePost(id);
      } else {
        await likePost(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success(initialIsLiked ? "Post unliked" : "Post liked!");
    },
    onError: (error) => {
      console.error('Error toggling like:', error);
      toast.error("Failed to update like status");
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleReaction = (emoji: string) => {
    setReactions(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }));
    toast.success(`You reacted with ${emoji}`);
  };

  const handleShare = () => {
    // Copy post URL to clipboard
    const postUrl = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(postUrl);
    toast.success("Post link copied to clipboard!");
  };

  const handleMoreOptions = () => {
    toast.info("More options coming soon!");
  };

  return (
    <Card className="mb-4 opacity-0 animate-fade-up [animation-fill-mode:forwards] [animation-delay:200ms] bg-card hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={avatar} alt={author} className="h-10 w-10 rounded-full transition-transform duration-300 hover:scale-110" />
            <div>
              <h3 className="font-semibold line-clamp-1">{author}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="line-clamp-1">{time}</span>
                <span>•</span>
                <span className="text-primary line-clamp-1">{category}</span>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground transition-transform duration-300 hover:rotate-90 shrink-0"
            onClick={handleMoreOptions}
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
        
        <p className="whitespace-pre-line mb-4 text-sm sm:text-base">{content}</p>
        
        {image && (
          <img
            src={image}
            alt="Post content"
            className="w-full h-48 sm:h-64 object-cover rounded-lg mb-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          />
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(reactions).map(([emoji, count]) => (
            <span key={emoji} className="text-sm bg-accent/50 px-2 py-1 rounded-full">
              {emoji} {count}
            </span>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-muted-foreground transition-all duration-300 hover:scale-105 hover:bg-accent/80 ${initialIsLiked ? 'text-primary' : ''}`}
            onClick={handleLike}
            disabled={likeMutation.isPending}
          >
            <Heart className={`h-4 w-4 mr-2 ${initialIsLiked ? 'fill-current' : ''}`} />
            {initialLikes}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground transition-all duration-300 hover:scale-105 hover:bg-accent/80"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {initialComments}
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground transition-all duration-300 hover:scale-105 hover:bg-accent/80"
              >
                <Smile className="h-4 w-4 mr-2" />
                React
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-2">
              <div className="flex flex-wrap gap-2">
                {EMOJI_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="text-xl hover:scale-125 transition-transform p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground ml-auto transition-all duration-300 hover:scale-105 hover:bg-accent/80"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {showComments && (
          <CommentSection
            postId={id}
            initialComments={[]}
          />
        )}
      </div>
    </Card>
  );
};