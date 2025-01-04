export interface Message {
  id: string;
  content: string;
  timestamp?: string;
  senderId?: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read?: boolean;
}