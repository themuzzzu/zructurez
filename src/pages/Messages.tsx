import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatDialogs } from "@/components/chat/ChatDialogs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";
import type { Chat, Group } from "@/types/chat";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  
  const { data: groups = [] } = useGroups(true);

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

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);

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
                groups={[]}
                selectedChat={selectedChat}
                selectedGroup={null}
                onSelectChat={setSelectedChat}
                onSelectGroup={() => {}}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onNewChat={() => setShowNewChat(true)}
                onNewGroup={() => {}}
                onAddMembers={() => {}}
              />
            </TabsContent>

            <TabsContent value="groups">
              <ChatList
                chats={[]}
                groups={groups}
                selectedChat={null}
                selectedGroup={selectedGroup}
                onSelectChat={() => {}}
                onSelectGroup={setSelectedGroup}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onNewChat={() => {}}
                onNewGroup={() => setShowNewGroup(true)}
                onAddMembers={() => setShowAddMembers(true)}
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
        showNewGroup={showNewGroup}
        showAddMembers={showAddMembers}
        newMemberEmail={newMemberEmail}
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
        onNewGroup={async (name: string, description?: string) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data: group, error } = await supabase
            .from('groups')
            .insert([
              {
                name,
                description,
                user_id: user.id,
              }
            ])
            .select()
            .single();

          if (error) {
            console.error('Error creating group:', error);
            return;
          }

          setShowNewGroup(false);
        }}
        onAddMembers={async (emails: string[]) => {
          if (!selectedGroup) return;

          const { error } = await supabase
            .from('group_members')
            .insert(
              emails.map(email => ({
                group_id: selectedGroup.id,
                user_id: email,
              }))
            );

          if (error) {
            console.error('Error adding members:', error);
            return;
          }

          setShowAddMembers(false);
        }}
        onCloseNewChat={() => setShowNewChat(false)}
        onCloseNewGroup={() => setShowNewGroup(false)}
        onCloseAddMembers={() => setShowAddMembers(false)}
      />
    </div>
  );
};

export default Messages;