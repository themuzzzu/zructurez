export interface Chat {
  id: string;
  userId: string;
  type: 'direct' | 'group';
  name: string;
  avatar: string;
  time: string;
  lastMessage: Message | null;
  unread: number;
  participants: any[];
  messages: Message[];
  unreadCount: number;
  isGroup: boolean;
}

export interface Group extends Chat {
  description: string | null;
  image_url: string | null;
  created_at: string;
  user_id: string;
  group_members: {
    count: number;
    members: string[];
  };
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read?: boolean;
  expires_at?: string | null;
}

export interface ChatHeaderProps {
  chat: Chat;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  setShowContactInfo: (show: boolean) => void;
  setIsSelectMode: (select: boolean) => void;
  isSelectMode: boolean;
  onBack?: () => void;
  onClose?: () => void;
}