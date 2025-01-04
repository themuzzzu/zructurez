export interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  userId: string; // Added userId field for proper UUID handling
  messages: Message[];
}