export interface Group {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  user_id: string;
  group_members?: {
    count: number;
  }[];
}

export interface Message {
  id: string;
  content: string;
  timestamp?: string;
  senderId?: string;
  sender_id: string;
  group_id: string;
  created_at: string;
  read?: boolean;
}