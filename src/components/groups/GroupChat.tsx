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

  useEffect(() => {
    const initializeChat = async () => {
      try {
        await fetchCurrentUser();
        await fetchMessages();
        subscribeToMessages();
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Failed to initialize chat");
      }
    };

    initializeChat();

    return () => {
      const channel = supabase.channel('messages');
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

  const fetchMessages = async () => {
    try {
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("receiver_id", groupId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(messages || []);

      // Mark messages as read
      if (messages && messages.length > 0 && currentUserId) {
        const { error: updateError } = await supabase
          .from("messages")
          .update({ read: true })
          .eq("receiver_id", groupId)
          .eq("read", false)
          .neq("sender_id", currentUserId);

        if (updateError) {
          console.error("Error marking messages as read:", updateError);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${groupId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newMessage = payload.new as Message;
            setMessages((current) => [...current, newMessage]);
            
            // Mark new message as read if it's not from current user
            if (currentUserId && newMessage.sender_id !== currentUserId) {
              const { error } = await supabase
                .from("messages")
                .update({ read: true })
                .eq("id", newMessage.id);

              if (error) {
                console.error("Error marking new message as read:", error);
              }
            }
          } else if (payload.eventType === "DELETE") {
            const deletedMessage = payload.old as Message;
            setMessages((current) => 
              current.filter((msg) => msg.id !== deletedMessage.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId) return;

    try {
      const { error } = await supabase.from("messages").insert({
        content: newMessage.trim(),
        receiver_id: groupId,
        sender_id: currentUserId,
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