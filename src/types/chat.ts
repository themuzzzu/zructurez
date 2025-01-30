export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read?: boolean;
}

export interface GroupMessage {
  id: string;
  content: string;
  sender_id: string;
  group_id: string;
  created_at: string;
}

export type ChatType = 'chat' | 'group';

export interface Chat {
  id: string;
  userId: string;
  type: ChatType;
  lastMessage?: string;
  unreadCount?: number;
  messages?: Message[];
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