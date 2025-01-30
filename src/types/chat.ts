export interface Chat {
  id: string;
  userId: string;
  type: 'direct' | 'group';
  name: string;
  avatar: string;
  time: string;
  lastMessage?: string;
  unread: number;
  participants: string[];
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  type?: 'text' | 'image' | 'video' | 'document';
  fileUrl?: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  read: boolean;
  expires_at?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
  user_id: string;
}