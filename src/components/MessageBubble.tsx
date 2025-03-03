
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
  MessageCircle,
  Trash2,
  Forward,
  Copy
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isOwn: boolean;
  messageId: string;
  onForward?: (content: string) => void;
}

export const MessageBubble = ({ content, timestamp, isOwn, messageId, onForward }: MessageBubbleProps) => {
  const [showActions, setShowActions] = useState(false);
  
  const handleMarkUnread = () => {
    // Implementation for marking as unread
    console.log("Marked as unread");
    toast.success("Message marked as unread");
  };

  const handlePinToTop = () => {
    // Implementation for pinning to top
    console.log("Pinned to top");
    toast.success("Message pinned to top");
  };

  const handleAddFavorite = () => {
    // Implementation for adding to favorites
    console.log("Added to favorites");
    toast.success("Message added to favorites");
  };

  const handleMute = () => {
    // Implementation for muting
    console.log("Muted");
    toast.success("Notifications muted");
  };

  const handleArchive = () => {
    // Implementation for archiving
    console.log("Archived");
    toast.success("Conversation archived");
  };

  const handleClearMessage = () => {
    // Implementation for clearing message
    console.log("Message cleared");
    toast.success("Message cleared");
  };

  const handleExitGroup = () => {
    // Implementation for exiting group
    console.log("Exited group");
    toast.success("You left the group");
  };

  const handleCloseChat = () => {
    // Implementation for closing chat
    console.log("Chat closed");
    toast.success("Chat closed");
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied to clipboard");
  };

  const handleDeleteMessage = async () => {
    try {
      // Validate that messageId is a valid UUID
      if (!messageId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        throw new Error('Invalid message ID format');
      }

      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("Failed to delete message");
    }
  };

  const handleForwardMessage = () => {
    if (onForward) {
      onForward(content);
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${
              isOwn
                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                : 'bg-muted text-foreground rounded-tl-sm'
            }`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
          >
            <p className="text-sm break-words">{content}</p>
            <div className={`flex items-center justify-end gap-2 mt-1 ${
              isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
            }`}>
              <span className="text-xs">
                {timestamp}
              </span>
              {isOwn && (
                <Check className="h-3 w-3" />
              )}
            </div>
            
            {showActions && (
              <div className={`absolute ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1`}>
                <button 
                  className="rounded-full bg-muted p-1.5 hover:bg-accent text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleForwardMessage();
                  }}
                >
                  <Forward className="h-3.5 w-3.5" />
                </button>
                <button 
                  className="rounded-full bg-muted p-1.5 hover:bg-accent text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyMessage();
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem onClick={handleMarkUnread}>
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Mark as unread</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleCopyMessage}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy text</span>
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
          <ContextMenuItem onClick={handleForwardMessage}>
            <Forward className="mr-2 h-4 w-4" />
            <span>Forward message</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleDeleteMessage} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete message</span>
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
