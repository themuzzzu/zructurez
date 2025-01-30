import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatList } from "@/components/chat/ChatList";
import { ChatDialogs } from "@/components/chat/ChatDialogs";
import { Navbar } from "@/components/Navbar";
import type { Chat, Group } from "@/types/chat";

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

  useEffect(() => {
    const fetchChats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Fetch direct messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        return;
      }

      // Create unique chats from messages
      const uniqueChats = messages.reduce((acc: Chat[], message) => {
        const chatUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        if (!acc.find(chat => chat.userId === chatUserId)) {
          acc.push({
            id: chatUserId,
            userId: chatUserId,
            type: 'chat',
            lastMessage: message.content,
            unreadCount: message.read ? 0 : 1
          });
        }
        return acc;
      }, []);

      setChats(uniqueChats);

      // Fetch groups
      const { data: userGroups, error: groupsError } = await supabase
        .from('group_members')
        .select(`
          group:groups (
            id,
            name,
            description,
            image_url,
            created_at,
            user_id
          )
        `)
        .eq('user_id', user.id);

      if (groupsError) {
        console.error('Error fetching groups:', groupsError);
        return;
      }

      setGroups(userGroups.map(ug => ug.group));
    };

    fetchChats();
  }, [navigate]);

  const handleNewChat = async (userId: string) => {
    const chat: Chat = {
      id: userId,
      userId,
      type: 'chat'
    };
    setSelectedChat(chat);
    setShowNewChat(false);
  };

  const handleNewGroup = async (name: string, description?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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

      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id
        });

      if (memberError) throw memberError;

      setGroups(prev => [...prev, group]);
      setSelectedGroup(group);
      setShowNewGroup(false);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleAddMember = async () => {
    if (!selectedGroup || !newMemberEmail) return;

    try {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newMemberEmail)
        .maybeSingle();

      if (profileError || !profiles) {
        console.error('Error finding user:', profileError);
        return;
      }

      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: selectedGroup.id,
          user_id: profiles.id
        });

      if (memberError) throw memberError;

      setNewMemberEmail("");
      setShowAddMembers(false);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-7xl mx-auto pt-20 pb-16">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4 space-y-4">
            <ChatList
              chats={chats}
              groups={groups}
              selectedChat={selectedChat}
              selectedGroup={selectedGroup}
              onSelectChat={setSelectedChat}
              onSelectGroup={setSelectedGroup}
              onNewChat={() => setShowNewChat(true)}
              onNewGroup={() => setShowNewGroup(true)}
              onAddMembers={() => setShowAddMembers(true)}
            />
          </div>
          <div className="col-span-8">
            <ChatWindow
              chat={selectedChat}
              group={selectedGroup}
              onClose={() => {
                setSelectedChat(null);
                setSelectedGroup(null);
              }}
            />
          </div>
        </div>
      </div>

      <ChatDialogs
        showNewChat={showNewChat}
        showNewGroup={showNewGroup}
        showAddMembers={showAddMembers}
        newMemberEmail={newMemberEmail}
        onNewChat={handleNewChat}
        onNewGroup={handleNewGroup}
        onAddMember={handleAddMember}
        onNewMemberEmailChange={setNewMemberEmail}
        onCloseNewChat={() => setShowNewChat(false)}
        onCloseNewGroup={() => setShowNewGroup(false)}
        onCloseAddMembers={() => setShowAddMembers(false)}
      />
    </div>
  );
};

export default Messages;