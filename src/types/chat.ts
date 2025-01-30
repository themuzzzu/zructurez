export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  userId: string;
  messages: Array<{
    id: string;
    content: string;
    senderId: string;
    timestamp: string;
  }>;
  type: 'chat';
}