import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Chat } from "@/types/chat";
import { useState } from "react";

interface ChatMenuProps {
  selectedChat: Chat;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  setShowContactInfo: (show: boolean) => void;
  setIsSelectMode: (select: boolean) => void;
  isSelectMode: boolean;
}

export const ChatMenu = ({
  selectedChat,
  isMuted,
  setIsMuted,
  setShowContactInfo,
  setIsSelectMode,
  isSelectMode,
}: ChatMenuProps) => {
  const [isBlocked, setIsBlocked] = useState(false);

  const handleViewContactInfo = () => {
    setShowContactInfo(true);
  };

  const handleSelectMessages = () => {
    setIsSelectMode(!isSelectMode);
    toast.success(isSelectMode ? "Selection mode disabled" : "Selection mode enabled");
  };

  const handleMuteNotifications = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from('notifications')
        .update({ muted: !isMuted })
        .eq('user_id', user.id);

      if (error) throw error;

      setIsMuted(!isMuted);
      toast.success(isMuted ? "Notifications unmuted" : "Notifications muted");
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error("Failed to update notification settings");
    }
  };

  const handleClearMessages = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // Delete messages where the current user is either sender or receiver
      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${selectedChat.userId},receiver_id.eq.${selectedChat.userId}`);

      if (error) throw error;
      
      toast.success("Messages cleared successfully");
    } catch (error) {
      console.error('Error clearing messages:', error);
      toast.error("Failed to clear messages");
    }
  };

  const handleBlockContact = async () => {
    try {
      // In a real app, you would update a blocked_users table in the database
      setIsBlocked(true);
      toast.success("Contact blocked successfully");
    } catch (error) {
      toast.error("Failed to block contact");
    }
  };

  const handleUnblockContact = async () => {
    try {
      // In a real app, you would remove the entry from blocked_users table
      setIsBlocked(false);
      toast.success("Contact unblocked successfully");
    } catch (error) {
      toast.error("Failed to unblock contact");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleViewContactInfo}>
          View contact info
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSelectMessages}>
          Select messages
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleMuteNotifications}>
          {isMuted ? "Unmute notifications" : "Mute notifications"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleClearMessages}>
          Clear messages
        </DropdownMenuItem>
        {isBlocked ? (
          <DropdownMenuItem 
            onClick={handleUnblockContact}
            className="text-primary"
          >
            Unblock contact
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem 
            onClick={handleBlockContact}
            className="text-destructive"
          >
            Block contact
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};