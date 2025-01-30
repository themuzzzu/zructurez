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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Messages = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadChats();
    loadGroups();
    subscribeToMessages();
    subscribeToGroupMessages();
  }, []);

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('New message received:', payload);
          loadChats(); // Reload chats when new message arrives
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const subscribeToGroupMessages = () => {
    const channel = supabase
      .channel('group-messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_messages'
        },
        (payload) => {
          console.log('New group message received:', payload);
          loadGroups(); // Reload groups when new message arrives
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

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

      const userIds = new Set<string>();
      messages?.forEach(msg => {
        userIds.add(msg.sender_id);
        userIds.add(msg.receiver_id);
      });

      if (userIds.size === 0) {
        setChats([]);
        setLoading(false);
        return;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', Array.from(userIds));

      if (profilesError) throw profilesError;

      const profileMap = new Map(profiles?.map(profile => [profile.id, profile]));
      const chatMap = new Map<string, Chat>();
      
      messages?.forEach(msg => {
        const isUserSender = msg.sender_id === user.id;
        const otherUserId = isUserSender ? msg.receiver_id : msg.sender_id;
        const otherUser = profileMap.get(otherUserId);

        if (!chatMap.has(otherUserId) && otherUser) {
          chatMap.set(otherUserId, {
            id: otherUserId,
            name: otherUser.username || 'Unknown User',
            avatar: otherUser.avatar_url || '/placeholder.svg',
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userGroups, error: groupsError } = await supabase
        .from('group_members')
        .select(`
          group:groups (
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
        `)
        .eq('user_id', user.id);

      if (groupsError) throw groupsError;

      const formattedGroups = userGroups
        .map(membership => membership.group)
        .filter(group => group)
        .map(group => ({
          ...group,
          group_members: {
            count: group.group_members.length,
            members: group.group_members.map((m: any) => m.user_id)
          }
        }));

      setGroups(formattedGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
      toast.error("Failed to load groups");
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

      if (profileError) throw profileError;
      if (!profiles) {
        toast.error("User not found");
        return;
      }

      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: selectedGroup.id,
          user_id: profiles.id
        });

      if (memberError) {
        if (memberError.code === '23505') {
          toast.error("User is already a member of this group");
        } else {
          throw memberError;
        }
      } else {
        toast.success("Member added successfully");
        loadGroups();
        setNewMemberEmail("");
        setShowAddMembers(false);
      }
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error("Failed to add member");
    }
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
              onSelectChat={setSelectedChat}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </TabsContent>
          <TabsContent value="groups" className="mt-0">
            <GroupList
              groups={groups}
              selectedGroup={selectedGroup}
              onSelectGroup={(group) => {
                setSelectedGroup(group);
                setSelectedChat(null);
              }}
              onAddMembers={() => setShowAddMembers(true)}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className={`${
        (selectedChat || selectedGroup) ? 'flex' : 'hidden md:flex'
      } flex-1 flex-col`}>
        {(selectedChat || selectedGroup) && (
          <div className="p-4 border-b flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedChat(null);
                setSelectedGroup(null);
              }}
              className="md:hidden hover:bg-accent/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="font-semibold">
              {selectedChat?.name || selectedGroup?.name}
            </span>
            {selectedGroup && (
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => setShowAddMembers(true)}
              >
                <Users2 className="h-4 w-4 mr-2" />
                Add Members
              </Button>
            )}
          </div>
        )}
        
        {selectedChat && (
          <ChatWindow
            selectedChat={selectedChat}
            onBack={() => setSelectedChat(null)}
            onMessageSent={loadChats}
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

      <Dialog open={showAddMembers} onOpenChange={setShowAddMembers}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Members</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter member email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
            />
            <Button onClick={handleAddMember} className="w-full">
              Add Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;
