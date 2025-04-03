import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Post, Poll, PollVote } from "./types/postTypes";
import { MessageSquare, ThumbsUp, Share2, Bookmark, Flag, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

interface PostItemProps {
  post: Post;
  onVote: () => void;
}

export const PostItem = ({ post, onVote }: PostItemProps) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleVote = async (pollId: string, optionIndex: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to vote");
        return;
      }

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('poll_votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Update existing vote
        const { error } = await supabase
          .from('poll_votes')
          .update({ option_index: optionIndex })
          .eq('id', existingVote.id);

        if (error) throw error;
      } else {
        // Create new vote
        const { error } = await supabase
          .from('poll_votes')
          .insert({
            poll_id: pollId,
            option_index: optionIndex,
            user_id: user.id
          });

        if (error) throw error;
      }

      onVote();
      toast.success("Vote recorded");
    } catch (error) {
      console.error('Error voting in poll:', error);
      toast.error("Failed to record vote");
    }
  };

  const getVoteCount = (pollOptions: any[], optionIndex: number) => {
    if (!post.poll?.votes) return 0;
    return post.poll.votes.filter(vote => vote.option_index === optionIndex).length;
  };

  const getTotalVotes = () => {
    if (!post.poll?.votes) return 0;
    return post.poll.votes.length;
  };

  const handleLike = () => {
    if (!user) {
      toast.error("Please sign in to like posts");
      return;
    }
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Post unliked" : "Post liked");
  };

  const handleBookmark = () => {
    if (!user) {
      toast.error("Please sign in to bookmark posts");
      return;
    }
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Post removed from bookmarks" : "Post bookmarked");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this post: ${window.location.origin}/communities?post=${post.id}`);
    toast.success("Link copied to clipboard");
  };

  const handleReport = () => {
    toast.success("Post reported. Our team will review it.");
  };

  return (
    <Card key={post.id} className="p-4">
      <div className="flex items-start gap-4">
        <AvatarWithFallback 
          src={post.profile?.avatar_url}
          name={post.profile?.username} 
          userId={post.user_id}
          size="md"
        />
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">{post.profile?.username || "Anonymous"}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.created_at).toLocaleString()} 
                {post.group && ` • in ${post.group.name}`}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleBookmark}>
                  <Bookmark className="h-4 w-4 mr-2" />
                  {isBookmarked ? "Remove bookmark" : "Bookmark"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReport}>
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="mt-2">{post.content}</p>
          
          {post.image_url && (
            <div className="mt-4">
              <img 
                src={post.image_url} 
                alt="Post image" 
                className="max-h-96 object-contain rounded-md"
              />
            </div>
          )}
          
          {post.gif_url && (
            <div className="mt-4">
              <img 
                src={post.gif_url} 
                alt="GIF" 
                className="max-h-96 object-contain rounded-md"
              />
            </div>
          )}
          
          {post.poll && post.poll.id && (
            <div className="mt-4 border rounded-md p-4">
              <p className="font-medium mb-2">{post.poll.question}</p>
              <div className="space-y-2">
                {Array.isArray(post.poll.options) ? 
                  post.poll.options.map((option, index) => {
                    const voteCount = getVoteCount(post.poll!.options, index);
                    const totalVotes = getTotalVotes();
                    const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                    
                    return (
                      <div key={index} className="relative">
                        <Button
                          variant="outline"
                          className="w-full justify-between hover:bg-muted"
                          onClick={() => handleVote(post.poll!.id, index)}
                        >
                          <span>{typeof option === 'string' ? option : option.text}</span>
                          <span>{voteCount} votes ({percentage}%)</span>
                        </Button>
                        <div 
                          className="absolute top-0 left-0 h-full bg-primary/10 rounded-l-sm"
                          style={{ width: `${percentage}%`, zIndex: -1 }}
                        />
                      </div>
                    );
                  })
                  : null
                }
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {getTotalVotes()} votes total
              </p>
            </div>
          )}
          
          <div className="flex items-center mt-4 gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`gap-2 ${isLiked ? 'text-primary' : ''}`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4" />
              Like
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="h-4 w-4" />
              Comment
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`gap-2 ml-auto ${isBookmarked ? 'text-primary' : ''}`}
              onClick={handleBookmark}
            >
              <Bookmark className="h-4 w-4" />
              {isBookmarked ? "Saved" : "Save"}
            </Button>
          </div>
          
          {showComments && (
            <div className="mt-4 border-t pt-4">
              <p className="text-center text-muted-foreground">Comments will appear here</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
