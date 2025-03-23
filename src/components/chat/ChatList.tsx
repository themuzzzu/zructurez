
import { SearchInput } from "@/components/SearchInput";
import { ChatListItem } from "@/components/chat/ChatListItem";
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
}: ChatListProps) => {
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-2 sm:px-3 py-2 border-b">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search messages..."
          className="w-full"
        />
      </div>

      <div className="overflow-y-auto flex-1 pb-safe">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat?.id === chat.id}
              onClick={() => onSelectChat(chat)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground py-6 px-2 sm:py-8 sm:px-4">
            <p className="text-xs sm:text-sm mb-1 sm:mb-2">No conversations found</p>
            <p className="text-xs">Try searching for something else or start a new chat</p>
          </div>
        )}
      </div>
    </div>
  );
};
