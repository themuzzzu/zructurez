import { Profile } from "./profile";

export interface Chat {
  id: string;
  participants: Profile[];
  lastMessage?: Message;
  unreadCount?: number;
  isGroup?: boolean;
  groupInfo?: Group;
}

export interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read?: boolean;
  expires_at?: string;
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
}

export interface ChatHeaderProps {
  chat: Chat;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  setShowContactInfo: (show: boolean) => void;
  setIsSelectMode: (mode: boolean) => void;
  isSelectMode: boolean;
  onClose?: () => void;
}

export interface ChatDialogsProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedChat?: Chat;
}