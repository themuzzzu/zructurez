export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read?: boolean;
  expires_at?: string | null;
}

export interface GroupMessage {
  id: string;
  content: string;
  sender_id: string;
  group_id: string;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
  user_id: string;
  messages?: GroupMessage[];
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  userId: string;
  name: string;
  avatar: string;
  time: string;
  lastMessage?: string;
  unread?: number;
  messages?: Message[];
  participants: string[];
}

export interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onNewChat?: () => void;
  groups: Group[];
  selectedGroup: Group | null;
  onSelectGroup: (group: Group) => void;
  onNewGroup?: () => void;
  onAddMembers?: () => void;
}

export interface ChatWindowProps {
  selectedChat: Chat | null;
  onClose: () => void;
  chat: Chat | null;
  group: Group | null;
}

export interface ChatDialogsProps {
  selectedChat: Chat;
  showContactInfo: boolean;
  setShowContactInfo: (show: boolean) => void;
  showImageUpload: boolean;
  setShowImageUpload: (show: boolean) => void;
  showVideoUpload: boolean;
  setShowVideoUpload: (show: boolean) => void;
  showDocumentUpload: boolean;
  setShowDocumentUpload: (show: boolean) => void;
  showPollDialog: boolean;
  setShowPollDialog: (show: boolean) => void;
  showContactDialog: boolean;
  setShowContactDialog: (show: boolean) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  selectedVideo: string | null;
  setSelectedVideo: (video: string | null) => void;
  showNewChat?: boolean;
  showNewGroup?: boolean;
  showAddMembers?: boolean;
  newMemberEmail?: string;
  onNewChat?: (userId: string) => Promise<void>;
  onNewGroup?: (name: string, description?: string) => Promise<void>;
  onAddMembers?: (emails: string[]) => Promise<void>;
  onCloseNewChat?: () => void;
  onCloseNewGroup?: () => void;
  onCloseAddMembers?: () => void;
}