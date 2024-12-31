export interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  read?: boolean;
}

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}