import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "@/components/MessageBubble";
import { Chat } from "@/types/chat";

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
  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src={selectedChat.avatar}
            alt="Chat avatar"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold">{selectedChat.name}</span>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {selectedChat.messages?.map((msg) => (
            <MessageBubble
              key={msg.id}
              content={msg.content}
              timestamp={msg.timestamp}
              isOwn={msg.senderId === "me"}
            />
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
          />
          <Button onClick={onSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};