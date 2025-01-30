import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatDialogs } from "@/components/chat/ChatDialogs";
import type { Chat, Group, Message } from "@/types/chat";

const Messages = () => {
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
    messages.forEach((message: Message) => {
      const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
      if (!chatMap.has(otherUserId)) {
        chatMap.set(otherUserId, []);
      }
      chatMap.get(otherUserId)?.push({
        senderId: message.sender_id,
        content: message.content,
        timestamp: new Date(message.created_at).toISOString(),
        id: message.id,
      });
    });

    const chatArray = Array.from(chatMap.entries()).map(([userId, messages]) => ({
      id: userId,
      userId: userId,
      messages: messages,
      lastMessage: messages[0],
      unreadCount: messages.filter(m => !m.read && m.sender_id !== user.id).length,
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
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
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
            messages: [],
            lastMessage: null,
            unreadCount: 0,
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

          setGroups([...groups, group]);
          setShowNewGroup(false);
        }}
        onAddMembers={async (emails: string[]) => {
          // Add members to the selected group
          if (!selectedGroup) return;

          const { error } = await supabase
            .from('group_members')
            .insert(
              emails.map(email => ({
                group_id: selectedGroup.id,
                user_id: email, // Assuming email is actually the user ID
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