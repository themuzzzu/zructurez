import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatDialogs } from "@/components/chat/ChatDialogs";
import { GroupList } from "@/components/groups/GroupList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users } from "lucide-react";
import { toast } from "sonner";
import type { Chat } from "@/types/chat";
import type { Group } from "@/types/group";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");

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

    const { data: userGroups, error } = await supabase
      .from('group_members')
      .select(`
        group:groups (
          id,
          name,
          description,
          image_url,
          created_at,
          user_id,
          group_members (count)
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching groups:', error);
      return;
    }

    const groups = userGroups.map((ug: any) => ({
      ...ug.group,
      type: 'group' as const,
      avatar: ug.group.image_url || '/placeholder.svg',
      time: ug.group.created_at,
      lastMessage: null,
      unread: 0,
      participants: [],
      messages: [],
      unreadCount: 0,
      isGroup: true
    }));

    setGroups(groups);
  };

  useEffect(() => {
    fetchChats();
    fetchGroups();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateGroup = async (name: string, description?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create a group");
        return;
      }

      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          name,
          description,
          user_id: user.id
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as first member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id
        });

      if (memberError) throw memberError;

      toast.success("Group created successfully!");
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error("Failed to create group");
    }
  };

  return (
    <div className="container max-w-[1400px] pt-20 pb-16">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <Tabs defaultValue="chats" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="chats" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chats
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex-1">
                <Users className="w-4 h-4 mr-2" />
                Groups
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chats">
              <ChatList
                chats={chats}
                selectedChat={selectedChat}
                onSelectChat={setSelectedChat}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onNewChat={() => setShowNewChat(true)}
              />
            </TabsContent>

            <TabsContent value="groups">
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

        <div className="col-span-8">
          {selectedChat && (
            <ChatWindow
              selectedChat={selectedChat}
              onClose={() => setSelectedChat(null)}
            />
          )}
          {!selectedChat && !selectedGroup && (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a chat or group to start messaging
            </div>
          )}
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