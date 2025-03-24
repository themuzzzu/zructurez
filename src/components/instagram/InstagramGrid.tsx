import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from "react-router-dom";
import { PostPreviewOverlay } from "./PostPreviewOverlay";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface Post {
  id: string;
  image_url?: string | null;
  content: string;
  likes: number;
  comments: number;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

interface InstagramGridProps {
  posts: Post[];
}

export const InstagramGrid = ({ posts }: InstagramGridProps) => {
  const navigate = useNavigate();
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null);
  
  // Filter posts with images for grid view
  const postsWithImages = posts.filter(post => post.image_url);
  
  if (postsWithImages.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-medium">No Photos to Show</p>
        <p className="text-sm text-muted-foreground mt-1">
          The people you follow haven't posted any photos yet
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-2">
      {postsWithImages.map((post) => (
        <div 
          key={post.id}
          className="relative cursor-pointer"
          onClick={() => navigate(`/post/${post.id}`)}
          onMouseEnter={() => setHoveredPostId(post.id)}
          onMouseLeave={() => setHoveredPostId(null)}
        >
          <AspectRatio ratio={1} className="bg-muted overflow-hidden">
            <img 
              src={post.image_url || ''} 
              alt={post.content.substring(0, 20)} 
              className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
            />
            {hoveredPostId === post.id && (
              <PostPreviewOverlay likes={post.likes} comments={post.comments} />
            )}
          </AspectRatio>
        </div>
      ))}
    </div>
  );
};
