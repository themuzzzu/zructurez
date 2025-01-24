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

interface MessageWithProfiles {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  sender?: Profile;
  receiver?: Profile;
}

export const ChatMessages = ({ chat, onForwardMessage }: ChatMessagesProps) => {
  const [messages, setMessages] = useState<MessageWithProfiles[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // First, fetch messages
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

        // Then, fetch profiles for all unique user IDs in messages
        const userIds = new Set<string>();
        messagesData.forEach(msg => {
          userIds.add(msg.sender_id);
          if (msg.receiver_id) userIds.add(msg.receiver_id);
        });

        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', Array.from(userIds));

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          toast.error("Failed to load user profiles");
          return;
        }

        // Create a map of profiles for easy lookup
        const profilesMap = new Map(profilesData.map(profile => [profile.id, profile]));

        // Combine messages with profile data
        const formattedMessages = messagesData.map(msg => ({
          id: msg.id,
          content: msg.content,
          timestamp: new Date(msg.created_at).toLocaleString(),
          senderId: msg.sender_id,
          sender: profilesMap.get(msg.sender_id),
          receiver: msg.receiver_id ? profilesMap.get(msg.receiver_id) : undefined
        }));

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
          console.log("Received real-time update:", payload);
          if (payload.eventType === 'INSERT') {
            // Fetch the sender's profile
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', payload.new.sender_id)
              .single();

            const newMessage = {
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
      .subscribe((status) => {
        console.log("Subscription status:", status);
        if (status === 'SUBSCRIBED') {
          console.log("Successfully subscribed to chat messages");
        }
      });

    return () => {
      console.log("Cleaning up subscription");
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