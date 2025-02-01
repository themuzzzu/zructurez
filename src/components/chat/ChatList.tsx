import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/SearchInput";
import { ChatListItem } from "@/components/chat/ChatListItem";
import { Plus } from "lucide-react";
import type { Chat } from "@/types/chat";

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewChat: () => void;
}

export const ChatList = ({
  chats,
  selectedChat,
  onSelectChat,
  searchQuery,
  onSearchChange,
  onNewChat,
}: ChatListProps) => {
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        <div className="space-y-2">
          {filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat?.id === chat.id}
              onClick={() => onSelectChat(chat)}
            />
          ))}
          {filteredChats.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No chats found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};