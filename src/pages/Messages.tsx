import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type { Chat } from "@/types/chat";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [groups, setGroups] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialChats = async () => {
      try {
        // Load direct chats
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
            messages: [],
            type: 'chat'
          }));

          setChats(sampleChats);
        }

        // Load groups
        const { data: groupsData } = await supabase
          .from('groups')
          .select('id, name, image_url, description')
          .limit(3);

        if (groupsData) {
          const sampleGroups: Chat[] = groupsData.map(group => ({
            id: group.id,
            name: group.name,
            avatar: group.image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${group.name}`,
            lastMessage: "Latest group message",
            time: "5m ago",
            unread: Math.floor(Math.random() * 5),
            userId: group.id,
            messages: [],
            type: 'group'
          }));

          setGroups(sampleGroups);
        }
      } catch (error) {
        console.error('Error loading chats:', error);
        toast.error("Failed to load messages");
      }
    };

    loadInitialChats();
  }, []);

  const handleSelectChat = (chat: Chat) => {
    if (chat.type === 'chat') {
      const updatedChats = chats.map(c => {
        if (c.id === chat.id) {
          return { ...c, unread: 0 };
        }
        return c;
      });
      setChats(updatedChats);
    } else {
      const updatedGroups = groups.map(g => {
        if (g.id === chat.id) {
          return { ...g, unread: 0 };
        }
        return g;
      });
      setGroups(updatedGroups);
    }
    setSelectedChat(chat);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date().toLocaleTimeString(),
      senderId: "me"
    };

    if (selectedChat.type === 'chat') {
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
    } else {
      const updatedGroups = groups.map(group => {
        if (group.id === selectedChat.id) {
          return {
            ...group,
            messages: [...(group.messages || []), newMessage],
            lastMessage: message,
            time: "Just now"
          };
        }
        return group;
      });
      setGroups(updatedGroups);
      setSelectedChat(updatedGroups.find(group => group.id === selectedChat.id) || null);
    }

    setMessage("");
    toast.success("Message sent!");
  };

  const filteredItems = (activeTab === 'chats' ? chats : groups).filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <Tabs defaultValue="chats" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
              <div className="px-4 pt-2">
                <TabsList className="w-full">
                  <TabsTrigger value="chats" className="flex-1">Chats</TabsTrigger>
                  <TabsTrigger value="groups" className="flex-1">Groups</TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-1 overflow-hidden">
                <TabsContent value="chats" className="h-full m-0">
                  <ChatList
                    chats={filteredItems}
                    selectedChat={selectedChat}
                    onSelectChat={handleSelectChat}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </TabsContent>
                <TabsContent value="groups" className="h-full m-0">
                  <ChatList
                    chats={filteredItems}
                    selectedChat={selectedChat}
                    onSelectChat={handleSelectChat}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </TabsContent>
              </div>
            </Tabs>
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