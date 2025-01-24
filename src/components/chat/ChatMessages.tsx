import { useEffect, useRef } from "react";
import { MessageBubble } from "../MessageBubble";
import { ScrollArea } from "../ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

// Base message type without recursion
type BaseMessage = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
};

// Separate types for direct and group messages
type DirectMessage = BaseMessage & {
  receiver_id: string;
  read?: boolean;
  expires_at?: string;
};

type GroupMessage = BaseMessage & {
  group_id: string;
};

// Union type for all message types
type Message = DirectMessage | GroupMessage;

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
  isGroup?: boolean;
  onForwardMessage?: (messageId: string) => void;
}

export const ChatMessages = ({ messages, currentUserId, isGroup, onForwardMessage }: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };

    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload: { new: Message }) => {
          // Handle new message
          console.log('New message received:', payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ScrollArea ref={scrollRef} className="h-[calc(100vh-15rem)] px-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            content={message.content}
            timestamp={format(new Date(message.created_at), 'p')}
            isOwn={message.sender_id === currentUserId}
            messageId={message.id}
            onForward={onForwardMessage}
          />
        ))}
      </div>
    </ScrollArea>
  );
};