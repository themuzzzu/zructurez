
import { Chat } from "@/types/chat";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Check, CheckCheck } from "lucide-react";

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
      className={`w-full p-4 flex items-start gap-3 transition-colors hover:bg-accent/30
        ${isSelected ? 'bg-accent' : ''}`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={chat.avatar}
          alt={chat.name}
          className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
        />
        {/* Online indicator - would be dynamic in a real app */}
        {Math.random() > 0.5 && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
        )}
      </div>
      
      <div className="flex-1 text-left min-w-0">
        <div className="flex justify-between items-start mb-1">
          <span className="font-semibold text-base text-foreground truncate">
            {chat.name}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatTimestamp(chat.time)}
          </span>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground truncate pr-2 w-[70%]">
            {chat.lastMessage ? (
              <>
                {chat.lastMessage.sender_id === chat.userId ? '' : 'You: '}
                {chat.lastMessage.content}
              </>
            ) : (
              <span className="text-muted-foreground/70 italic">No messages yet</span>
            )}
          </p>
          <div className="flex items-center">
            {chat.lastMessage && chat.lastMessage.sender_id !== chat.userId && (
              <span className="text-xs mr-1">
                {chat.lastMessage.read ? (
                  <CheckCheck className="h-4 w-4 text-blue-500" />
                ) : (
                  <Check className="h-4 w-4 text-muted-foreground" />
                )}
              </span>
            )}
            {chat.unread > 0 && (
              <span className="inline-flex items-center justify-center bg-primary text-primary-foreground text-xs font-medium h-5 min-w-5 rounded-full px-1.5">
                {chat.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};
