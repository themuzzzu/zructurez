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

export interface ChatUser {
  id: string;
  name?: string;
  avatar_url?: string;
  last_seen?: string;
}

export interface Chat {
  id: string;
  userId: string;
  type: ChatType;
  name?: string;
  avatar?: string;
  lastMessage?: string;
  unread?: number;
  time?: string;
  messages?: Message[];
  user?: ChatUser;
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