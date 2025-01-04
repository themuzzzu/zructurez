import { Send, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chat } from "@/types/chat";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChatWindowProps {
  selectedChat: Chat | null;
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export const ChatWindow = ({
  selectedChat,
  message,
  onMessageChange,
  onSendMessage,
}: ChatWindowProps) => {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a chat to start messaging
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage();
  };

  const handleViewContactInfo = () => {
    setShowContactInfo(true);
  };

  const handleSelectMessages = () => {
    setIsSelectMode(!isSelectMode);
    toast.success(isSelectMode ? "Selection mode disabled" : "Selection mode enabled");
  };

  const handleMuteNotifications = async () => {
    try {
      // Update notifications settings in the database
      const { error } = await supabase
        .from('notifications')
        .update({ muted: !isMuted })
        .eq('user_id', selectedChat.id);

      if (error) throw error;

      setIsMuted(!isMuted);
      toast.success(isMuted ? "Notifications unmuted" : "Notifications muted");
    } catch (error) {
      toast.error("Failed to update notification settings");
    }
  };

  const handleClearMessages = async () => {
    try {
      // Delete messages from the database
      const { error } = await supabase
        .from('messages')
        .delete()
        .match({ 
          sender_id: supabase.auth.user()?.id,
          receiver_id: selectedChat.id 
        });

      if (error) throw error;
      
      toast.success("Messages cleared successfully");
    } catch (error) {
      toast.error("Failed to clear messages");
    }
  };

  const handleBlockContact = async () => {
    try {
      // Implement blocking logic here
      toast.success("Contact blocked successfully");
    } catch (error) {
      toast.error("Failed to block contact");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedChat.avatar}
              alt={selectedChat.name}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-semibold">{selectedChat.name}</span>
          </div>
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
              <DropdownMenuItem 
                onClick={handleBlockContact}
                className="text-destructive"
              >
                Block contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {selectedChat.messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.senderId === "me"
                    ? "bg-primary text-primary-foreground"
                    : "bg-[#FFDEE2] text-black/80"
                } ${isSelectMode ? "cursor-pointer select-none hover:opacity-80" : ""}`}
              >
                <p>{msg.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <Dialog open={showContactInfo} onOpenChange={setShowContactInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <img
                src={selectedChat.avatar}
                alt={selectedChat.name}
                className="w-24 h-24 rounded-full"
              />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{selectedChat.name}</h3>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};