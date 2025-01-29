import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Chat } from "@/types/chat";
import { ChatListItem } from "./ChatListItem";
import { CreateGroupDialog } from "../groups/CreateGroupDialog";
import { useState } from "react";

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ChatList = ({
  chats,
  selectedChat,
  onSelectChat,
  searchQuery,
  onSearchChange,
}: ChatListProps) => {
  const [showCreateGroup, setShowCreateGroup] = useState(false);

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
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => setShowCreateGroup(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Group
        </Button>
      </div>
      <div className="overflow-y-auto flex-1">
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
      </div>
      <CreateGroupDialog 
        open={showCreateGroup} 
        onClose={() => setShowCreateGroup(false)} 
      />
    </div>
  );
};