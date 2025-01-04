import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "../MessageBubble";
import { Chat } from "@/types/chat";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessagesProps {
  chat: Chat;
  onForwardMessage: (messageId: string) => void;
}

export const ChatMessages = ({ chat, onForwardMessage }: ChatMessagesProps) => {
  const [messages, setMessages] = useState(chat.messages || []);

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: chat.type === 'group' ? 'group_messages' : 'messages',
          filter: chat.type === 'group' 
            ? `group_id=eq.${chat.userId}`
            : `or(sender_id.eq.${chat.userId},receiver_id.eq.${chat.userId})`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = {
              id: payload.new.id,
              content: payload.new.content,
              timestamp: new Date(payload.new.created_at).toLocaleString(),
              senderId: payload.new.sender_id
            };
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chat.userId, chat.type]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((msg) => (
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