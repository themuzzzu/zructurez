
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MessageLayout } from "./components/MessageLayout";
import { ChatSidebar } from "./components/ChatSidebar";
import { EmptyState } from "./components/EmptyState";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatDialogs } from "@/components/chat/ChatDialogs";
import type { Chat } from "@/types/chat";
import type { Group } from "@/types/group";

export const Messages = () => {
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
  
  // Check premium status
  useEffect(() => {
    const checkPremiumStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // For demo, set premium status randomly
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

    // Process messages into chat objects
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

    // Get user's group memberships
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

    // Fetch group details
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
  
  // Fetch data periodically
  useEffect(() => {
    fetchChats();
    fetchGroups();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Handle folder selection
  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
    // Filter chats based on folder in a real app
  };
  
  // Handle new chat creation
  const handleNewChat = () => {
    setShowNewChat(true);
  };

  // Handle successfully created chat
  const handleChatCreated = async (userId: string) => {
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
  };

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

      <MessageLayout>
        <ChatSidebar 
          chats={chats}
          groups={groups}
          selectedChat={selectedChat}
          selectedGroup={selectedGroup}
          activeTab={activeTab}
          selectedFolder={selectedFolder}
          searchQuery={searchQuery}
          isPremiumUser={isPremiumUser}
          onSelectChat={setSelectedChat}
          onSelectGroup={setSelectedGroup}
          onTabChange={setActiveTab}
          onFolderSelect={handleFolderSelect}
          onSearchChange={setSearchQuery}
          onNewChat={handleNewChat}
        />
        
        {selectedChat ? (
          <ChatWindow
            selectedChat={selectedChat}
            onClose={() => setSelectedChat(null)}
          />
        ) : (
          <EmptyState onNewChat={handleNewChat} />
        )}
      </MessageLayout>

      <ChatDialogs
        selectedChat={selectedChat}
        showNewChat={showNewChat}
        onNewChat={handleChatCreated}
        onCloseNewChat={() => setShowNewChat(false)}
      />
    </div>
  );
};
