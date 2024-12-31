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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            className={`w-full p-4 flex items-start gap-3 hover:bg-accent/50 transition-colors border-b ${
              selectedChat?.id === chat.id ? 'bg-accent/50' : ''
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
                <span className="font-semibold truncate">{chat.name}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                  {chat.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate pr-2">
                {chat.lastMessage}
              </p>
            </div>
            {chat.unread > 0 && (
              <span className="bg-primary text-primary-foreground min-w-[20px] h-5 rounded-full text-xs flex items-center justify-center flex-shrink-0 px-1.5">
                {chat.unread}
              </span>
            )}
          </button>
        ))}
      </ScrollArea>
    </div>
  );
};