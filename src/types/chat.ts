import { Profile } from "./profile";

export interface Chat {
  id: string;
  participants: Profile[];
  lastMessage?: Message;
  unreadCount?: number;
  isGroup?: boolean;
  groupInfo?: Group;
  userId: string;
  type: 'direct' | 'group';
  name: string;
  avatar: string;
  time: string;
  unread: number;
  messages: Message[];
}

export interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read?: boolean;
  expires_at?: string;
  type?: 'text' | 'image' | 'video' | 'document';
  fileUrl?: string;
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
  onBack?: () => void;
  onClose?: () => void; // Added this line
}

export interface ChatDialogsProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedChat?: Chat;
  showNewChat: boolean;
  showNewGroup: boolean;
  showAddMembers: boolean;
  showContactInfo?: boolean;
  setShowContactInfo?: (show: boolean) => void;
  showImageUpload?: boolean;
  setShowImageUpload?: (show: boolean) => void;
  showVideoUpload?: boolean;
  setShowVideoUpload?: (show: boolean) => void;
  showDocumentUpload?: boolean;
  setShowDocumentUpload?: (show: boolean) => void;
  showPollDialog?: boolean;
  setShowPollDialog?: (show: boolean) => void;
  showContactDialog?: boolean;
  setShowContactDialog?: (show: boolean) => void;
  selectedImage?: string | null;
  setSelectedImage?: (image: string | null) => void;
  selectedVideo?: string | null;
  setSelectedVideo?: (video: string | null) => void;
  newMemberEmail: string;
  onNewChat: (userId: string) => Promise<void>;
  onNewGroup: (name: string, description?: string) => Promise<void>;
  onAddMembers: (emails: any) => Promise<void>;
  onCloseNewChat: () => void;
  onCloseNewGroup: () => void;
  onCloseAddMembers: () => void;
}