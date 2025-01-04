import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { 
  Star, 
  Heart,
  Bell,
  Archive,
  Check,
  X,
  ArrowLeft,
  MessageCircle
} from "lucide-react";

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export const MessageBubble = ({ content, timestamp, isOwn }: MessageBubbleProps) => {
  const handleMarkUnread = () => {
    // Implementation for marking as unread
    console.log("Marked as unread");
  };

  const handlePinToTop = () => {
    // Implementation for pinning to top
    console.log("Pinned to top");
  };

  const handleAddFavorite = () => {
    // Implementation for adding to favorites
    console.log("Added to favorites");
  };

  const handleMute = () => {
    // Implementation for muting
    console.log("Muted");
  };

  const handleArchive = () => {
    // Implementation for archiving
    console.log("Archived");
  };

  const handleClearMessage = () => {
    // Implementation for clearing message
    console.log("Message cleared");
  };

  const handleExitGroup = () => {
    // Implementation for exiting group
    console.log("Exited group");
  };

  const handleCloseChat = () => {
    // Implementation for closing chat
    console.log("Chat closed");
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              isOwn
                ? 'bg-primary text-primary-foreground ml-auto'
                : 'bg-accent/50 text-foreground'
            }`}
          >
            <p className="text-sm break-words">{content}</p>
            <span className={`text-xs mt-1 block ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
              {timestamp}
            </span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem onClick={handleMarkUnread}>
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Mark as unread</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={handlePinToTop}>
            <Star className="mr-2 h-4 w-4" />
            <span>Pin to top</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleAddFavorite}>
            <Heart className="mr-2 h-4 w-4" />
            <span>Add to favorite</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleMute}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Muted</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleArchive}>
            <Archive className="mr-2 h-4 w-4" />
            <span>Archive</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleClearMessage}>
            <Check className="mr-2 h-4 w-4" />
            <span>Clear message</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleExitGroup}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Exit group</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleCloseChat}>
            <X className="mr-2 h-4 w-4" />
            <span>Close chat</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};