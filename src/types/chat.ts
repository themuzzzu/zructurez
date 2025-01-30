export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read?: boolean;
  expires_at?: string | null;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  participants: string[];
  messages?: Message[];
  lastMessage?: Message;
  unreadCount?: number;
}

export interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onNewChat?: () => void;
  groups?: any[];
  selectedGroup?: any;
  onSelectGroup?: (group: any) => void;
  onNewGroup?: () => void;
  onAddMembers?: () => void;
}

export interface ChatWindowProps {
  selectedChat?: Chat;
  onClose: () => void;
  chat?: Chat;
  group?: any;
}

export interface ChatDialogsProps {
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