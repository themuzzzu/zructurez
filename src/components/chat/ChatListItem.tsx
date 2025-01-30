import { Chat } from "@/types/chat";
import { formatDistanceToNow, parseISO } from "date-fns";

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
}

export const ChatListItem = ({ chat, isSelected, onClick }: ChatListItemProps) => {
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = parseISO(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'recently';
    }
  };

  return (
    <button
      className={`w-full p-4 flex items-start gap-3 transition-colors hover:bg-[#1a1a1a]/70
        ${isSelected ? 'bg-[#1a1a1a]' : ''}`}
      onClick={onClick}
    >
      <img
        src={chat.avatar}
        alt={chat.name}
        className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
      />
      <div className="flex-1 text-left min-w-0">
        <div className="flex justify-between items-start mb-1">
          <span className="font-semibold text-base text-foreground truncate">
            {chat.name}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatTimestamp(chat.time)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {chat.lastMessage?.content}
        </p>
        {chat.unread > 0 && (
          <span className="inline-flex items-center justify-center bg-primary text-primary-foreground text-xs font-medium h-5 min-w-5 rounded-full px-1.5 mt-1">
            {chat.unread}
          </span>
        )}
      </div>
    </button>
  );
};