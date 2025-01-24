import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "../MessageBubble";
import { Chat } from "@/types/chat";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/types/profile";

interface ChatMessagesProps {
  chat: Chat;
  onForwardMessage: (messageId: string) => void;
}

// Separate base message type to avoid recursion
type BaseMessage = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
};

// Extend base type for direct messages
type DirectMessage = BaseMessage & {
  receiver_id: string;
  read?: boolean;
  expires_at?: string;
};

// Extend base type for group messages
type GroupMessage = BaseMessage & {
  group_id: string;
};

// Separate type for messages with profile data
type FormattedMessage = {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  sender?: Profile;
};

export const ChatMessages = ({ chat, onForwardMessage }: ChatMessagesProps) => {
  const [messages, setMessages] = useState<FormattedMessage[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data: messagesData, error: messagesError } = await supabase
          .from(chat.type === 'group' ? 'group_messages' : 'messages')
          .select('*')
          .eq(chat.type === 'group' ? 'group_id' : 'receiver_id', chat.userId)
          .order('created_at', { ascending: true });

        if (messagesError) {
          console.error("Error fetching messages:", messagesError);
          toast.error("Failed to load messages");
          return;
        }

        // Get unique sender IDs
        const senderIds = [...new Set(messagesData?.map(msg => msg.sender_id) || [])];

        // Fetch profiles for senders
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', senderIds);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          toast.error("Failed to load user profiles");
          return;
        }

        // Create a map of profiles
        const profileMap = new Map(profiles?.map(profile => [profile.id, profile]));

        // Format messages with profile data
        const formattedMessages = messagesData?.map((msg: DirectMessage | GroupMessage) => ({
          id: msg.id,
          content: msg.content,
          timestamp: new Date(msg.created_at).toLocaleString(),
          senderId: msg.sender_id,
          sender: profileMap.get(msg.sender_id)
        })) || [];

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error in fetchMessages:", error);
        toast.error("Failed to load messages");
      }
    };

    fetchMessages();

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
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', payload.new.sender_id)
              .single();

            const newMessage: FormattedMessage = {
              id: payload.new.id,
              content: payload.new.content,
              timestamp: new Date(payload.new.created_at).toLocaleString(),
              senderId: payload.new.sender_id,
              sender: profileData
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