
import { useEffect, useRef } from "react";
import { MessageBubble } from "../MessageBubble";
import { ScrollArea } from "../ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import type { Message } from "@/types/chat";
import { toast } from "sonner";

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
  isGroup?: boolean;
  onForwardMessage?: (content: string) => void;
  typingUsers?: Record<string, boolean>;
  otherUserId?: string;
}

export const ChatMessages = ({ 
  messages, 
  currentUserId, 
  isGroup, 
  onForwardMessage,
  typingUsers = {},
  otherUserId
}: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };

    scrollToBottom();
  }, [messages, typingUsers]);

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
        (payload) => {
          console.log('New message received:', payload.new);
          // The Messages component will handle the state update
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to new messages');
        }
        if (status === 'CHANNEL_ERROR') {
          toast.error('Error connecting to chat');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleForwardMessage = (content: string) => {
    if (onForwardMessage) {
      onForwardMessage(content);
    }
  };

  // Group messages by date for better organization
  const groupedMessages: { [key: string]: Message[] } = {};
  messages.forEach(message => {
    const date = new Date(message.created_at).toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  // Check if other user is typing
  const isOtherUserTyping = otherUserId && typingUsers[otherUserId];

  return (
    <ScrollArea ref={scrollRef} className="h-[calc(100vh-15rem)] px-4">
      <div className="py-4 space-y-6">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-4">
            <div className="flex justify-center">
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            
            {dateMessages.map((message) => (
              <MessageBubble
                key={message.id}
                content={message.content}
                timestamp={format(new Date(message.created_at), 'p')}
                isOwn={message.sender_id === currentUserId}
                messageId={message.id}
                onForward={handleForwardMessage}
              />
            ))}
          </div>
        ))}
        
        {messages.length === 0 && !isOtherUserTyping && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-20">
            <p className="text-sm mb-2">No messages yet</p>
            <p className="text-xs">Start the conversation by sending a message</p>
          </div>
        )}
        
        {isOtherUserTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-muted rounded-2xl rounded-tl-sm p-3 flex items-center gap-1 text-muted-foreground">
              <span className="typing-dot animate-pulse">•</span>
              <span className="typing-dot animate-pulse delay-150">•</span>
              <span className="typing-dot animate-pulse delay-300">•</span>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
