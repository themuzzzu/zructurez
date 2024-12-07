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
            className={`w-full p-4 flex items-start gap-3 hover:bg-accent dark:hover:text-black transition-colors border-b ${
              selectedChat?.id === chat.id ? 'bg-accent dark:text-black' : ''
            }`}
            onClick={() => onSelectChat(chat)}
          >
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 text-left">
              <div className="flex justify-between items-start">
                <span className="font-semibold dark:hover:text-black">{chat.name}</span>
                <span className="text-xs text-muted-foreground">{chat.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate dark:hover:text-black">
                {chat.lastMessage}
              </p>
            </div>
            {chat.unread > 0 && (
              <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center">
                {chat.unread}
              </span>
            )}
          </button>
        ))}
      </ScrollArea>
    </div>
  );
};