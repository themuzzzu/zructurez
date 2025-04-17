
import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { FeedItem } from "@/types/feed";
import { formatDistanceToNow } from "date-fns";

interface FeedItemComponentProps {
  item: FeedItem;
  onLikeToggle: (id: string) => void;
}

export const FeedItemComponent: React.FC<FeedItemComponentProps> = ({ item, onLikeToggle }) => {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={item.author.avatar} />
          <AvatarFallback>{item.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{item.author.name}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onLikeToggle(item.id)}
              className={item.userHasLiked ? "text-red-500" : ""}
            >
              <Heart className="h-4 w-4 mr-1" fill={item.userHasLiked ? "currentColor" : "none"} />
              {item.likes}
            </Button>
          </div>
          <p className="mt-2">{item.content}</p>
        </div>
      </div>
    </Card>
  );
};
