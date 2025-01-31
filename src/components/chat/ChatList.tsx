import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { ChatListItem } from "@/components/chat/ChatListItem";
import type { Chat, Group } from "@/types/chat";

interface ChatListProps {
  chats: Chat[];
  groups: Group[];
  selectedChat: Chat | null;
  selectedGroup: Group | null;
  onSelectChat: (chat: Chat) => void;
  onSelectGroup: (group: Group) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewChat: () => void;
  onNewGroup: () => void;
  onAddMembers: () => void;
}

export const ChatList = ({ 
  chats, 
  groups,
  selectedChat,
  selectedGroup,
  onSelectChat,
  onSelectGroup,
  searchQuery,
  onSearchChange,
  onNewChat,
  onNewGroup,
  onAddMembers 
}: ChatListProps) => {
  const [separateGroupsAndChats] = useState(() => {
    const saved = localStorage.getItem("separateGroupsAndChats");
    return saved ? JSON.parse(saved) : false;
  });

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mappedGroups = filteredGroups.map(group => ({
    id: group.id,
    userId: group.user_id,
    type: "group" as const,
    name: group.name,
    avatar: group.image_url || '/placeholder.svg',
    time: group.created_at,
    lastMessage: null,
    unread: 0,
    participants: [],
    messages: [],
    unreadCount: 0,
    isGroup: true
  }));

  const allChats = separateGroupsAndChats 
    ? filteredChats 
    : [...filteredChats, ...mappedGroups];

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search messages..."
          />
          <Button variant="outline" size="icon" onClick={onNewChat}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {separateGroupsAndChats ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Chats</h3>
              </div>
              {filteredChats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  isSelected={selectedChat?.id === chat.id}
                  onClick={() => onSelectChat(chat)}
                />
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Groups</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={onNewGroup}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={onAddMembers}>
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {mappedGroups.map((group) => (
                <ChatListItem
                  key={group.id}
                  chat={group}
                  isSelected={selectedGroup?.id === group.id}
                  onClick={() => onSelectGroup(group)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-2">
            {allChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isSelected={
                  chat.type === "direct"
                    ? selectedChat?.id === chat.id
                    : selectedGroup?.id === chat.id
                }
                onClick={() =>
                  chat.type === "direct"
                    ? onSelectChat(chat)
                    : onSelectGroup(chat)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
