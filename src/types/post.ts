
export interface UserPost {
  id: string;
  user_id: string;
  profile_id: string;
  business_id?: string;
  content: string;
  image_url?: string;
  created_at: string;
  category?: string;
  likes_count: number;
  comments_count: number;
  reposts_count: number;
  profile: {
    id: string;
    username: string;
    avatar_url?: string;
    full_name?: string;
  };
}
