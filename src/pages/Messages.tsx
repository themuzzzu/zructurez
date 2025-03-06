
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatDialogs } from "@/components/chat/ChatDialogs";
import { GroupList } from "@/components/groups/GroupList";
import { FoldersSection } from "@/components/chat/FoldersSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { Chat } from "@/types/chat";
import type { Group } from "@/types/group";

const Messages = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  
  // Checking if user is premium (in a real app, this would check subscription status)
  useEffect(() => {
    const checkPremiumStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // This is where you'd check if user has premium status
        // For demo, let's set it to true 50% of the time
        setIsPremiumUser(Math.random() > 0.5);
      }
    };
    
    checkPremiumStatus();
  }, []);

  const fetchChats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    const chatMap = new Map<string, any[]>();
    messages.forEach((message: any) => {
      const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
      if (!chatMap.has(otherUserId)) {
        chatMap.set(otherUserId, []);
      }
      chatMap.get(otherUserId)?.push(message);
    });

    const chatArray: Chat[] = Array.from(chatMap.entries()).map(([userId, messages]) => ({
      id: userId,
      userId: userId,
      type: 'direct',
      name: 'User',
      avatar: '/placeholder.svg',
      time: messages[0]?.created_at || new Date().toISOString(),
      lastMessage: messages[0] || null,
      unread: messages.filter(m => !m.read && m.sender_id !== user.id).length,
      participants: [],
      messages: messages,
      unreadCount: 0,
      isGroup: false
    }));

    setChats(chatArray);
  };

  const fetchGroups = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // First get the groups the user is a member of
    const { data: userGroups, error: memberError } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', user.id);

    if (memberError) {
      console.error('Error fetching group memberships:', memberError);
      return;
    }

    if (!userGroups?.length) {
      setGroups([]);
      return;
    }

    const groupIds = userGroups.map(ug => ug.group_id);

    // Then fetch the actual group details
    const { data: groupsData, error: groupsError } = await supabase
      .from('groups')
      .select(`
        *,
        group_members!inner (
          user_id
        )
      `)
      .in('id', groupIds)
      .order('created_at', { ascending: false });

    if (groupsError) {
      console.error('Error fetching groups:', groupsError);
      return;
    }

    const formattedGroups: Group[] = groupsData.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      image_url: group.image_url,
      created_at: group.created_at,
      user_id: group.user_id,
      group_members: {
        count: group.group_members?.length || 0,
        members: group.group_members?.map((member: any) => member.user_id) || []
      }
    }));

    setGroups(formattedGroups);
  };
  
  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
    // In a real app, you would filter chats based on folder here
  };
  
  const handleNewChat = () => {
    setShowNewChat(true);
  };

  useEffect(() => {
    fetchChats();
    fetchGroups();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container max-w-[1400px] pt-20 pb-16">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-160px)]">
        <div className="col-span-12 md:col-span-4 border rounded-lg overflow-hidden bg-background shadow-sm">
          <FoldersSection 
            onSelectFolder={handleFolderSelect} 
            isPremiumUser={isPremiumUser}
          />
          
          <Tabs defaultValue="chats" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full px-4 py-2">
              <TabsTrigger value="chats" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chats
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex-1">
                <Users className="w-4 h-4 mr-2" />
                Groups
              </TabsTrigger>
            </TabsList>

            <div className="p-4 flex justify-end border-b">
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-1" 
                onClick={activeTab === "chats" ? handleNewChat : () => {}}
              >
                <Plus className="h-4 w-4" />
                {activeTab === "chats" ? "New Chat" : "New Group"}
              </Button>
            </div>

            <TabsContent value="chats" className="m-0">
              <ChatList
                chats={chats}
                selectedChat={selectedChat}
                onSelectChat={setSelectedChat}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onNewChat={handleNewChat}
              />
            </TabsContent>

            <TabsContent value="groups" className="m-0">
              <GroupList
                groups={groups}
                selectedGroup={selectedGroup}
                onSelectGroup={setSelectedGroup}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onAddMembers={() => {}}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="col-span-12 md:col-span-8 h-full md:block" 
             style={{ display: selectedChat ? 'block' : 'none' }}>
          {selectedChat && (
            <ChatWindow
              selectedChat={selectedChat}
              onClose={() => setSelectedChat(null)}
            />
          )}
        </div>

        <div className="col-span-12 md:col-span-8 h-full" 
             style={{ display: !selectedChat && !selectedGroup ? 'block' : 'none' }}>
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground border rounded-lg bg-background p-8 shadow-sm">
            <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
            <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
            <p className="text-center max-w-md">
              Select a chat or group to start messaging, or create a new conversation to connect with others.
            </p>
            <Button 
              className="mt-6"
              onClick={handleNewChat}
            >
              <Plus className="h-4 w-4 mr-2" />
              Start New Conversation
            </Button>
          </div>
        </div>
      </div>

      <ChatDialogs
        selectedChat={selectedChat}
        showNewChat={showNewChat}
        onNewChat={async (userId: string) => {
          const newChat: Chat = {
            id: userId,
            userId: userId,
            type: 'direct',
            name: 'New Chat',
            avatar: '/placeholder.svg',
            time: new Date().toISOString(),
            lastMessage: null,
            unread: 0,
            participants: [],
            messages: [],
            unreadCount: 0,
            isGroup: false
          };
          setChats([...chats, newChat]);
          setSelectedChat(newChat);
          setShowNewChat(false);
        }}
        onCloseNewChat={() => setShowNewChat(false)}
      />
    </div>
  );
};

export default Messages;
