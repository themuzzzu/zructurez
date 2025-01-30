export interface Chat {
  id: string;
  userId: string;
  type: 'direct' | 'group';
  name: string;
  avatar: string;
  time: string;
  lastMessage: Message | null;
  unread: number;
  participants: string[];
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  read: boolean;
  type?: 'text' | 'image' | 'video' | 'document';
  fileUrl?: string;
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
  setIsSelectMode: (select: boolean) => void;
  isSelectMode: boolean;
  onBack?: () => void;
  onClose?: () => void;
}

export interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
  isGroup?: boolean;
  onForwardMessage?: (messageId: string) => void;
}

export interface ChatInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onAttachment: (type: string) => void;
}

export interface ChatDialogsProps {
  selectedChat: Chat | null;
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