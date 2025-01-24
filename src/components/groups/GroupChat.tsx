import { useState, useEffect } from "react";
import { Message } from "./types";
import { MessageBubble } from "../MessageBubble";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GroupChatProps {
  groupId: string;
}

export const GroupChat = ({ groupId }: GroupChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        await fetchCurrentUser();
        await checkGroupMembership();
        await fetchMessages();
        subscribeToMessages();
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Failed to initialize chat");
      }
    };

    initializeChat();

    return () => {
      const channel = supabase.channel('group_messages');
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  const fetchCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setCurrentUserId(user?.id || null);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user information");
    }
  };

  const checkGroupMembership = async () => {
    if (!currentUserId) return;
    
    try {
      const { data: membership, error } = await supabase
        .from("group_members")
        .select("*")
        .eq("group_id", groupId)
        .eq("user_id", currentUserId)
        .maybeSingle();

      if (error) throw error;
      setIsMember(!!membership);
    } catch (error) {
      console.error("Error checking group membership:", error);
      toast.error("Failed to verify group membership");
    }
  };

  const fetchMessages = async () => {
    try {
      const { data: messages, error } = await supabase
        .from("group_messages")
        .select("*")
        .eq("group_id", groupId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel("group_messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "group_messages",
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newMessage = payload.new as Message;
            setMessages((current) => [...current, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId || !isMember) {
      if (!isMember) {
        toast.error("You must be a member of this group to send messages");
      }
      return;
    }

    try {
      const { error } = await supabase.from("group_messages").insert({
        content: newMessage.trim(),
        sender_id: currentUserId,
        group_id: groupId,
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleForwardMessage = (content: string) => {
    setNewMessage(content);
  };

  if (loading) {
    return <div className="p-4">Loading messages...</div>;
  }

  if (!isMember) {
    return <div className="p-4">You are not a member of this group.</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              messageId={message.id}
              content={message.content}
              timestamp={new Date(message.created_at).toLocaleString()}
              isOwn={message.sender_id === currentUserId}
              onForward={handleForwardMessage}
            />
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};