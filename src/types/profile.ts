
export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  bio: string | null;
  location?: string | null;
  name?: string | null;
  theme_preference?: "light" | "dark" | "system";
  privacy_settings?: {
    profile_visibility?: "public" | "followers" | "private";
    message_permissions?: "everyone" | "followers" | "none";
    show_contact_info?: boolean;
    show_location?: boolean;
  };
  notification_preferences?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
  display_preferences?: {
    font_size?: number;
    ui_color?: string;
  };
  // Business profile related fields
  is_business?: boolean;
  business_id?: string | null;
}
