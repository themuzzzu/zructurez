export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read?: boolean;
  expires_at?: string | null;
}

export interface Chat {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  time: string;
  unread: number;
  lastMessage?: string;
  type: 'direct' | 'group';
  messages: Message[];
  participants: string[];
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
  user_id: string;
}

export interface ChatListProps {
  chats: Chat[];
  groups: Group[];
  selectedChat: Chat | null;
  selectedGroup: Group | null;
  onSelectChat: (chat: Chat) => void;
  onSelectGroup: (group: Group) => void;
  onNewChat: () => void;
  onNewGroup: () => void;
  onAddMembers: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export interface ChatWindowProps {
  selectedChat: Chat | null;
  onClose: () => void;
  onMessageSent?: () => void;
  onBack?: () => void;
}

export interface ChatDialogsProps {
  showNewChat: boolean;
  showNewGroup: boolean;
  showAddMembers: boolean;
  newMemberEmail: string;
  onNewChat: (userId: string) => Promise<void>;
  onNewGroup: (name: string, description?: string) => Promise<void>;
  onAddMembers: (emails: string[]) => Promise<void>;
  onCloseNewChat: () => void;
  onCloseNewGroup: () => void;
  onCloseAddMembers: () => void;
}