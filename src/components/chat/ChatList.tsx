import { Search } from "lucide-react";
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
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        {chats.map((chat) => (
          <button
            key={chat.id}
            className={`w-full p-4 flex items-start gap-3 hover:bg-accent/50 transition-colors ${
              selectedChat?.id === chat.id ? 'bg-accent' : ''
            }`}
            onClick={() => onSelectChat(chat)}
          >
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
            />
            <div className="flex-1 text-left min-w-0">
              <div className="flex justify-between items-start gap-2">
                <span className="font-semibold truncate">
                  {chat.name}
                </span>
                <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                  {chat.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate pr-2">
                {chat.lastMessage}
              </p>
              {chat.unread > 0 && (
                <span className="inline-flex items-center justify-center bg-primary text-primary-foreground text-xs font-medium h-5 min-w-5 rounded-full px-1.5 mt-1">
                  {chat.unread}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};