import { Chat } from "@/types/chat";

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
}

export const ChatListItem = ({ chat, isSelected, onClick }: ChatListItemProps) => {
  return (
    <button
      className={`w-full p-4 flex items-start gap-3 transition-colors
        ${isSelected 
          ? 'bg-[#1a1a1a]' // Darker background when selected
          : 'hover:bg-[#1a1a1a]/70' // Slightly transparent dark on hover
        }`}
      onClick={onClick}
    >
      <img
        src={chat.avatar}
        alt={chat.name}
        className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
      />
      <div className="flex-1 text-left min-w-0">
        <div className="flex justify-between items-start gap-2">
          <span className="font-semibold truncate text-foreground">
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
  );
};