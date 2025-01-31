import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatDialogs } from "@/components/chat/ChatDialogs";
import { Button } from "@/components/ui/button";
import { Home, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Chat, Group, Message } from "@/types/chat";

const Messages = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

    const chatMap = new Map<string, Message[]>();
    messages.forEach((message: any) => {
      const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
      if (!chatMap.has(otherUserId)) {
        chatMap.set(otherUserId, []);
      }
      chatMap.get(otherUserId)?.push({
        id: message.id,
        content: message.content,
        sender_id: message.sender_id,
        created_at: message.created_at,
        read: message.read || false,
        expires_at: message.expires_at
      });
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
      participants: [{ id: user.id, username: null, avatar_url: null, created_at: '', bio: null }],
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
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => navigate('/communities')}
        >
          <Users className="h-4 w-4" />
          <span>Groups</span>
        </Button>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <ChatList
            chats={chats}
            groups={groups}
            selectedChat={selectedChat}
            selectedGroup={selectedGroup}
            onSelectChat={setSelectedChat}
            onSelectGroup={setSelectedGroup}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNewChat={() => setShowNewChat(true)}
            onNewGroup={() => setShowNewGroup(true)}
            onAddMembers={() => setShowAddMembers(true)}
          />
        </div>
        <div className="col-span-8">
          {selectedChat && (
            <ChatWindow
              selectedChat={selectedChat}
              onClose={() => setSelectedChat(null)}
            />
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

          const newGroup: Group = {
            ...group,
            group_members: {
              count: 1,
              members: [user.id]
            }
          };

          setGroups([...groups, newGroup]);
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