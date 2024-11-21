import { MessageCircle, Heart, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

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
    <Card className="mb-4 opacity-0 animate-fade-up [animation-fill-mode:forwards] [animation-delay:200ms] bg-card hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={avatar} alt={author} className="h-10 w-10 rounded-full transition-transform duration-300 hover:scale-110" />
            <div>
              <h3 className="font-semibold">{author}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{time}</span>
                <span>•</span>
                <span className="text-primary">{category}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground transition-transform duration-300 hover:rotate-90">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
        
        <p className="whitespace-pre-line mb-4">{content}</p>
        
        {image && (
          <img
            src={image}
            alt="Post content"
            className="w-full h-64 object-cover rounded-lg mb-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          />
        )}
        
        <Separator className="my-4" />
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground transition-all duration-300 hover:scale-105 hover:bg-accent/80">
            <Heart className="h-4 w-4 mr-2" />
            {likes}
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground transition-all duration-300 hover:scale-105 hover:bg-accent/80">
            <MessageCircle className="h-4 w-4 mr-2" />
            {comments}
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground ml-auto transition-all duration-300 hover:scale-105 hover:bg-accent/80">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};