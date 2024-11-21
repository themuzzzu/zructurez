import { MessageCircle, Heart, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface PostCardProps {
  author: string;
  avatar: string;
  time: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  image?: string;
}

export const PostCard = ({
  author,
  avatar,
  time,
  content,
  category,
  likes,
  comments,
  image,
}: PostCardProps) => {
  return (
    <Card className="mb-4 animate-fade-in">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <img src={avatar} alt={author} className="h-10 w-10 rounded-full" />
          <div>
            <h3 className="font-semibold">{author}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{time}</span>
              <span>•</span>
              <span className="text-primary">{category}</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-800 mb-4">{content}</p>
        
        {image && (
          <img
            src={image}
            alt="Post content"
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
        
        <div className="flex items-center gap-4 pt-2 border-t">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Heart className="h-4 w-4 mr-2" />
            {likes}
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <MessageCircle className="h-4 w-4 mr-2" />
            {comments}
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 ml-auto">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};