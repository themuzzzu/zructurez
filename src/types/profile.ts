
export interface Profile {
  id: string;
  username?: string | null;
  name?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at?: string;
  email?: string;
  bio?: string | null;
  location?: string | null;
  theme_preference?: 'light' | 'dark' | 'system';
  privacy_settings?: {
    profile_visibility: 'public' | 'followers' | 'private';
    message_permissions: 'everyone' | 'followers' | 'none';
  };
  notification_preferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  display_preferences?: {
    font_size: number;
    ui_color: string;
    language: string;
  };
}
