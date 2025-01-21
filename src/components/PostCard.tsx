import { useEffect } from "react";
import { Eye } from "lucide-react";
import { incrementViews } from "@/services/postService";

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
  views = 0 
}: PostCardProps) => {
  useEffect(() => {
    // Increment view count when post is rendered
    incrementViews('posts', id);
  }, [id]);

  return (
    <div className="flex flex-col p-4 border rounded-lg">
      {image && <img src={image} alt={content} className="w-full h-48 object-cover rounded-md" />}
      <div className="flex items-center mt-2">
        <img src={avatar} alt={author} className="w-10 h-10 rounded-full" />
        <div className="ml-2">
          <h3 className="font-semibold">{author}</h3>
          <p className="text-sm text-muted-foreground">{time}</p>
        </div>
      </div>
      <p className="mt-2">{content}</p>
      <div className="flex items-center gap-4 mt-2 text-muted-foreground">
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          {views}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">{likes}</span> Likes
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">{comments}</span> Comments
        </div>
      </div>
    </div>
  );
};
