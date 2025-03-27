
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { incrementViews } from "@/services/postService";
import { Eye } from "lucide-react";
import { PostHeader } from "./post/PostHeader";
import { PostActions } from "./post/PostActions";
import { usePostLike } from "@/hooks/usePostLike";
import { CommentSection } from "./CommentSection";

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
  reposts = 0,
  views = 0,
  isLiked = false,
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const { currentLikeStatus, toggleLike } = usePostLike(id, isLiked);

  useEffect(() => {
    incrementViews('posts', id);
  }, [id]);

  return (
    <div className="p-4">
      <div className="flex">
        <Avatar className="h-10 w-10 mr-3 mt-1 flex-shrink-0">
          <AvatarImage src={avatar} alt={author} />
          <AvatarFallback>{author[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <PostHeader author={author} avatar={avatar} time={time} />
          
          <div className="text-base mb-3 whitespace-pre-wrap">{content}</div>
          
          {image && (
            <div className="mt-2 mb-3 rounded-xl overflow-hidden border">
              <img src={image} alt="" className="w-full h-auto max-h-96 object-cover" />
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Eye className="h-3 w-3" /> <span>{views} views</span>
          </div>
          
          <PostActions 
            id={id}
            likes={likes}
            comments={comments}
            reposts={reposts}
            currentLikeStatus={currentLikeStatus}
            toggleLike={toggleLike}
            setShowComments={setShowComments}
            showComments={showComments}
          />
          
          {showComments && (
            <div className="mt-4 pt-4 border-t">
              <CommentSection postId={id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
