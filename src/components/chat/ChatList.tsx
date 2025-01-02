import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Chat } from "@/types/chat";

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
  return (
    <div className="w-80 border-r">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/70" />
          <Input
            placeholder="Search messages..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-220px)]">
        {chats.map((chat) => (
          <button
            key={chat.id}
            className={`w-full p-4 flex items-start gap-3 hover:bg-[#fde5e8] transition-colors ${
              selectedChat?.id === chat.id ? 'bg-[#fde5e8]' : ''
            }`}
            onClick={() => onSelectChat(chat)}
          >
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1 text-left min-w-0">
              <div className="flex justify-between items-start gap-2">
                <span className={`font-semibold truncate ${selectedChat?.id === chat.id ? 'text-black' : 'text-white'}`}>
                  {chat.name}
                </span>
                <span className={`text-xs whitespace-nowrap flex-shrink-0 ${selectedChat?.id === chat.id ? 'text-black' : 'text-white'}`}>
                  {chat.time}
                </span>
              </div>
              <p className={`text-sm truncate pr-2 ${selectedChat?.id === chat.id ? 'text-black' : 'text-white'}`}>
                {chat.lastMessage}
              </p>
            </div>
            {chat.unread > 0 && (
              <span className="bg-[#ea384c] text-white text-xs font-medium px-2.5 py-0.5 rounded-full animate-pulse flex-shrink-0">
                {chat.unread}
              </span>
            )}
          </button>
        ))}
      </ScrollArea>
    </div>
  );
};