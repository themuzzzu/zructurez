import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { GroupList } from "@/components/groups/GroupList";
import { GroupChat } from "@/components/groups/GroupChat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Users2, MessageCircle } from "lucide-react";
import type { Chat } from "@/types/chat";
import type { Group } from "@/types/group";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Messages = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [separateView] = useState(() => {
    const saved = localStorage.getItem("separateGroupsAndChats");
    return saved ? JSON.parse(saved) : false;
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadChats();
    loadGroups();
  }, []);

  const loadChats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to view messages");
        return;
      }

      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Get unique user IDs from messages
      const userIds = new Set<string>();
      messages?.forEach(msg => {
        userIds.add(msg.sender_id === user.id ? msg.receiver_id : msg.sender_id);
      });

      // Fetch profiles for all users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', Array.from(userIds));

      if (profilesError) throw profilesError;

      // Create chat objects
      const chatMap = new Map<string, Chat>();
      messages?.forEach(msg => {
        const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        const profile = profiles?.find(p => p.id === otherUserId);
        
        if (!profile) return;

        if (!chatMap.has(otherUserId)) {
          chatMap.set(otherUserId, {
            id: otherUserId,
            name: profile.username || 'Unknown User',
            avatar: profile.avatar_url || '/placeholder.svg',
            lastMessage: msg.content,
            time: new Date(msg.created_at).toLocaleTimeString(),
            unread: msg.receiver_id === user.id && !msg.read ? 1 : 0,
            userId: otherUserId,
            messages: [],
            type: 'chat'
          });
        }
      });

      setChats(Array.from(chatMap.values()));
    } catch (error) {
      console.error('Error loading chats:', error);
      toast.error("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const loadGroups = async () => {
    try {
      const { data: userGroups, error: groupsError } = await supabase
        .from('group_members')
        .select(`
          group_id,
          groups (
            id,
            name,
            description,
            image_url,
            created_at,
            user_id,
            group_members (
              user_id
            )
          )
        `);

      if (groupsError) throw groupsError;

      const formattedGroups = userGroups.map(membership => ({
        ...membership.groups,
        group_members: {
          count: membership.groups.group_members.length,
          members: membership.groups.group_members.map((m: any) => m.user_id)
        }
      }));

      setGroups(formattedGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
      toast.error("Failed to load groups");
    }
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setSelectedGroup(null);
  };

  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
    setSelectedChat(null);
  };

  const handleBack = () => {
    setSelectedChat(null);
    setSelectedGroup(null);
  };

  const handleSendMessage = () => {
    loadChats();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <div className={`${
        (selectedChat || selectedGroup) ? 'hidden md:flex' : 'flex'
      } w-full md:w-80 border-r flex-col`}>
        <div className="p-4 border-b flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="hover:bg-accent/50"
          >
            <Home className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Messages</h1>
          <div className="w-10" />
        </div>
        
        {separateView ? (
          <Tabs defaultValue="chats" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="chats" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chats
              </TabsTrigger>
              <TabsTrigger value="groups" className="w-full">
                <Users2 className="w-4 h-4 mr-2" />
                Groups
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chats" className="mt-0">
              <ChatList
                chats={chats}
                selectedChat={selectedChat}
                onSelectChat={handleSelectChat}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </TabsContent>
            <TabsContent value="groups" className="mt-0">
              <GroupList
                groups={groups}
                selectedGroup={selectedGroup}
                onSelectGroup={handleSelectGroup}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex-1 overflow-hidden">
            <ChatList
              chats={chats}
              selectedChat={selectedChat}
              onSelectChat={handleSelectChat}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <div className="px-4 py-2 font-semibold text-sm text-muted-foreground mt-4">Groups</div>
            <GroupList
              groups={groups}
              selectedGroup={selectedGroup}
              onSelectGroup={handleSelectGroup}
            />
          </div>
        )}
      </div>

      <div className={`${
        (selectedChat || selectedGroup) ? 'flex' : 'hidden md:flex'
      } flex-1 flex-col`}>
        {(selectedChat || selectedGroup) && (
          <div className="p-4 border-b flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="md:hidden hover:bg-accent/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="font-semibold">
              {selectedChat?.name || selectedGroup?.name}
            </span>
          </div>
        )}
        
        {selectedChat && (
          <ChatWindow
            selectedChat={selectedChat}
            onBack={handleBack}
            onMessageSent={handleSendMessage}
          />
        )}
        
        {selectedGroup && (
          <GroupChat groupId={selectedGroup.id} />
        )}
        
        {!selectedChat && !selectedGroup && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a chat or group to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;