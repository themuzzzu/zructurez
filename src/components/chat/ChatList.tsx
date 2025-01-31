import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Chat, Group } from "@/types/chat";
import { ChatListItem } from "./ChatListItem";

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
  onAddMembers,
}: ChatListProps) => {
  const separateGroupsAndChats = localStorage.getItem("separateGroupsAndChats") === "true";

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-4 border-b border-border/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-10 bg-[#1a1a1a]/50 border-[#2a2a2a]"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        {separateGroupsAndChats ? (
          <>
            <div className="py-2 px-4 text-sm font-medium text-muted-foreground">
              Chats
            </div>
            {chats.length > 0 ? (
              chats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  isSelected={selectedChat?.id === chat.id}
                  onClick={() => onSelectChat(chat)}
                />
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No messages yet
              </div>
            )}
            
            <div className="py-2 px-4 text-sm font-medium text-muted-foreground mt-4">
              Groups
            </div>
            {groups.length > 0 ? (
              groups.map((group) => (
                <ChatListItem
                  key={group.id}
                  chat={{
                    id: group.id,
                    name: group.name,
                    avatar: group.image_url || '/placeholder.svg',
                    time: group.created_at,
                    lastMessage: null,
                    unread: 0,
                    type: 'group',
                    participants: [],
                    messages: [],
                    userId: group.user_id
                  }}
                  isSelected={selectedGroup?.id === group.id}
                  onClick={() => onSelectGroup(group)}
                />
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No groups yet
              </div>
            )}
          </>
        ) : (
          <>
            {[...chats, ...groups.map(group => ({
              id: group.id,
              name: group.name,
              avatar: group.image_url || '/placeholder.svg',
              time: group.created_at,
              lastMessage: null,
              unread: 0,
              type: 'group',
              participants: [],
              messages: [],
              userId: group.user_id
            }))].map((item) => (
              <ChatListItem
                key={item.id}
                chat={item}
                isSelected={item.type === 'group' ? selectedGroup?.id === item.id : selectedChat?.id === item.id}
                onClick={() => item.type === 'group' ? onSelectGroup(groups.find(g => g.id === item.id)!) : onSelectChat(item as Chat)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};