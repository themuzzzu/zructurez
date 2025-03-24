
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { formatTimeAgo } from "@/utils/timeUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface PostHeaderProps {
  author: string;
  avatar: string;
  time: string;
}

export const PostHeader = ({ author, avatar, time }: PostHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center text-sm">
        <span className="font-semibold mr-2 hover:underline cursor-pointer">{author}</span>
        <span className="text-muted-foreground">· {formatTimeAgo(time)}</span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            Not interested in this post
          </DropdownMenuItem>
          <DropdownMenuItem>
            Follow {author}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            Report post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
