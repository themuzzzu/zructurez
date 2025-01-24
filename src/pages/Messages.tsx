import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatList } from "@/components/chat/ChatList";
import { toast } from "sonner";
import type { Chat } from "@/types/chat";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [groups, setGroups] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please log in to view messages");
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

      // Create a map to store unique chats
      const uniqueChats = new Map<string, Chat>();
      
      if (messages) {
        // First, get all unique user IDs (both senders and receivers)
        const userIds = new Set<string>();
        messages.forEach(msg => {
          userIds.add(msg.sender_id);
          userIds.add(msg.receiver_id);
        });

        // Fetch all relevant profiles in one go
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .in('id', Array.from(userIds));

        if (!profiles) {
          console.error("No profiles found");
          return;
        }

        // Create a map of profiles for easy lookup
        const profilesMap = new Map(profiles.map(profile => [profile.id, profile]));

        messages.forEach(msg => {
          const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          const otherUserProfile = profilesMap.get(otherUserId);

          if (!otherUserProfile) return;

          if (!uniqueChats.has(otherUserId)) {
            uniqueChats.set(otherUserId, {
              id: otherUserId,
              name: otherUserProfile.username || 'Unknown User',
              avatar: otherUserProfile.avatar_url || '/placeholder.svg',
              lastMessage: msg.content,
              time: new Date(msg.created_at).toLocaleTimeString(),
              unread: msg.receiver_id === user.id && !msg.read ? 1 : 0,
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
          group_id,
          groups (
            id,
            name,
            image_url,
            description
          )
        `)
        .eq('user_id', user.id);

      if (groupsError) {
        console.error("Error loading groups:", groupsError);
        return;
      }

      const formattedGroups = userGroups?.map(membership => ({
        id: membership.groups.id,
        name: membership.groups.name,
        avatar: membership.groups.image_url || '/placeholder.svg',
        lastMessage: '',
        time: '',
        unread: 0,
        userId: user.id,
        messages: [],
        type: 'group' as const
      })) || [];

      setGroups(formattedGroups);

    } catch (error) {
      console.error('Error loading chats:', error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <div 
        className={`${
          selectedChat ? 'hidden md:flex' : 'flex'
        } w-full md:w-80 border-r flex-shrink-0`}
      >
        <ChatList
          chats={[...chats, ...groups]}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
        />
      </div>
      <div 
        className={`${
          selectedChat ? 'flex' : 'hidden md:flex'
        } flex-1 flex-col`}
      >
        {selectedChat ? (
          <ChatWindow chat={selectedChat} onBack={handleBack} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;