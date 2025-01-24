import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type { Chat } from "@/types/chat";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Profile } from "@/types/profile";

interface MessageWithProfile {
  sender: Profile;
  content: string;
  created_at: string;
  receiver_id: string;
  sender_id: string;
}

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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Please login to view messages");
          return;
        }

        // Load direct messages
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (messagesError) {
          console.error("Error loading messages:", messagesError);
          toast.error("Failed to load messages");
          return;
        }

        // Create unique chats from messages
        const uniqueChats = new Map<string, Chat>();
        
        if (messages) {
          // First, get all unique user IDs (both senders and receivers)
          const userIds = new Set<string>();
          messages.forEach(msg => {
            userIds.add(msg.sender_id);
            userIds.add(msg.receiver_id);
          });

          // Fetch all relevant profiles in one go
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', Array.from(userIds));

          if (profilesError) {
            console.error("Error loading profiles:", profilesError);
            toast.error("Failed to load user profiles");
            return;
          }

          // Create a map of profiles for easy lookup
          const profilesMap = new Map(profiles?.map(profile => [profile.id, profile]));

          messages.forEach(msg => {
            const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
            
            if (!uniqueChats.has(otherUserId)) {
              const otherUserProfile = profilesMap.get(otherUserId);
              
              uniqueChats.set(otherUserId, {
                id: otherUserId,
                name: otherUserProfile?.username || 'Anonymous',
                avatar: otherUserProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserId}`,
                lastMessage: msg.content,
                time: new Date(msg.created_at).toLocaleString(),
                unread: 0,
                userId: otherUserId,
                messages: [],
                type: 'chat' as const
              });
            }
          });
        }

        setChats(Array.from(uniqueChats.values()));

        const { data: userGroups, error: groupsError } = await supabase
          .from('group_members')
          .select(`
            group:groups (
              id,
              name,
              description,
              image_url,
              created_at
            )
          `)
          .eq('user_id', user.id);

        if (groupsError) {
          console.error("Error loading groups:", groupsError);
          toast.error("Failed to load groups");
          return;
        }

        const formattedGroups: Chat[] = userGroups?.map(({ group }) => ({
          id: group.id,
          name: group.name,
          avatar: group.image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${group.name}`,
          lastMessage: group.description || "No messages yet",
          time: new Date(group.created_at).toLocaleString(),
          unread: 0,
          userId: group.id,
          messages: [],
          type: 'group' as const
        })) || [];

        setGroups(formattedGroups);

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

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to send messages");
        return;
      }

      if (selectedChat.type === 'chat') {
        const { error: messageError } = await supabase
          .from('messages')
          .insert({
            content: message,
            sender_id: user.id,
            receiver_id: selectedChat.userId,
          });

        if (messageError) throw messageError;
      } else {
        const { error: groupMessageError } = await supabase
          .from('group_messages')
          .insert({
            content: message,
            sender_id: user.id,
            group_id: selectedChat.userId,
          });

        if (groupMessageError) throw groupMessageError;
      }

      setMessage("");
      toast.success("Message sent!");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    }
  };

  const filteredItems = (activeTab === 'chats' ? chats : groups).filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          <div className="w-[400px] border-r border-[#2a2a2a] flex flex-col">
            <div className="p-4 border-b border-[#2a2a2a] flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
                className="shrink-0 hover:bg-[#1a1a1a]"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            </div>
            <Tabs 
              defaultValue="chats" 
              className="flex-1 flex flex-col" 
              onValueChange={setActiveTab}
            >
              <div className="px-4 pt-2">
                <TabsList className="w-full bg-[#1a1a1a]/50">
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
          <div className="flex-1">
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
