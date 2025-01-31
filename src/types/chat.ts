export interface Chat {
  id: string;
  userId: string;
  type: "direct" | "group";
  name: string;
  avatar: string;
  time: string;
  lastMessage: Message | null;
  unread: number;
  participants: Participant[];
  messages: Message[];
  unreadCount: number;
  isGroup: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  user_id: string;
  group_members: {
    count: number;
    members: string[];
  };
  type: "group";
  avatar: string;
  lastMessage: Message | null;
  unread: number;
  participants: Participant[];
  messages: Message[];
  unreadCount: number;
  isGroup: boolean;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read?: boolean;
  expires_at?: string | null;
}

export interface Participant {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  bio: string | null;
}

export interface ChatHeaderProps {
  chat: Chat;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  setShowContactInfo: (show: boolean) => void;
  setIsSelectMode: (mode: boolean) => void;
  isSelectMode: boolean;
  onClose: () => void;
}