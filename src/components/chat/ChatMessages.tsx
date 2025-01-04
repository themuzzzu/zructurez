import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "../MessageBubble";
import { Chat } from "@/types/chat";

interface ChatMessagesProps {
  chat: Chat;
  onForwardMessage: (messageId: string) => void;
}

export const ChatMessages = ({ chat, onForwardMessage }: ChatMessagesProps) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {chat.messages?.map((msg) => (
          <MessageBubble
            key={msg.id}
            messageId={msg.id}
            content={msg.content}
            timestamp={msg.timestamp}
            isOwn={msg.senderId === "me"}
            onForward={onForwardMessage}
          />
        ))}
      </div>
    </ScrollArea>
  );
};