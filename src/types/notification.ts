export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean | null;
  created_at: string;
}