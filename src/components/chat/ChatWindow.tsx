import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage();
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src={selectedChat.avatar}
            alt={selectedChat.name}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold">{selectedChat.name}</span>
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
                    : "bg-[#FFDEE2] text-foreground"
                }`}
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
    </div>
  );
};