import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type { Chat, Message } from "@/types/chat";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialChats = async () => {
      try {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .limit(3);

        if (profiles) {
          const sampleChats: Chat[] = profiles.map(profile => ({
            id: profile.id,
            name: profile.username || 'Anonymous',
            avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
            lastMessage: "Hey there!",
            time: "2m ago",
            unread: Math.floor(Math.random() * 3),
            userId: profile.id,
            messages: []
          }));

          setChats(sampleChats);
        }
      } catch (error) {
        console.error('Error loading chats:', error);
        toast.error("Failed to load chats");
      }
    };

    loadInitialChats();
  }, []);

  const handleSelectChat = (chat: Chat) => {
    const updatedChats = chats.map(c => {
      if (c.id === chat.id) {
        return { ...c, unread: 0 };
      }
      return c;
    });
    setChats(updatedChats);
    setSelectedChat(chat);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date().toLocaleTimeString(),
      senderId: "me"
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...(chat.messages || []), newMessage],
          lastMessage: message,
          time: "Just now"
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setSelectedChat(updatedChats.find(chat => chat.id === selectedChat.id) || null);
    setMessage("");
    toast.success("Message sent!");
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          <div className="w-[400px] border-r bg-background flex flex-col">
            <div className="p-4 border-b flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Messages</h1>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChatList
                chats={filteredChats}
                selectedChat={selectedChat}
                onSelectChat={handleSelectChat}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          </div>
          <div className="flex-1 bg-background">
            <ChatWindow
              selectedChat={selectedChat}
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;