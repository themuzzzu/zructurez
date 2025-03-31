
export interface UserPost {
  id: string;
  user_id: string;
  profile_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  category?: string;
  location?: string;
  business_id?: string;
  views?: number;
  likes_count?: number;
  comments_count?: number;
  reposts_count?: number;
  profile?: {
    username?: string;
    avatar_url?: string;
    name?: string;
  };
}
