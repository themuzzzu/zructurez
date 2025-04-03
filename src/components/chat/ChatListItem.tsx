import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Chat } from '@/types/chat';
import { AvatarWithFallback } from '@/components/ui/avatar-with-fallback';

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onSelect: () => void;
  presenceStatus?: string;
}

export const ChatListItem = ({
  chat,
  isSelected,
  onSelect,
  presenceStatus,
}: ChatListItemProps) => {
  const formattedTime = chat.time 
    ? formatDistanceToNow(new Date(chat.time), { addSuffix: true })
    : '';

  const getStatusIndicator = () => {
    if (!presenceStatus) return null;
    
    if (presenceStatus === 'online') {
      return <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />;
    }
    
    // If it's a timestamp, show gray for offline
    return <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 rounded-full border-2 border-background" />;
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-lg p-2 cursor-pointer mb-1 transition-colors ${
        isSelected ? 'bg-accent' : 'hover:bg-muted'
      }`}
      onClick={onSelect}
    >
      <div className="relative">
        <AvatarWithFallback
          src={chat.avatar}
          name={chat.name}
          userId={chat.userId}
          size="md"
        />
        {getStatusIndicator()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium truncate">{chat.name}</p>
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
        <p className="text-xs truncate text-muted-foreground">
          {chat.lastMessage ? chat.lastMessage.content : 'No messages yet'}
        </p>
      </div>
      {chat.unread > 0 && (
        <div className="rounded-full bg-primary w-5 h-5 flex items-center justify-center">
          <span className="text-[10px] font-medium text-primary-foreground">
            {chat.unread}
          </span>
        </div>
      )}
    </div>
  );
};
